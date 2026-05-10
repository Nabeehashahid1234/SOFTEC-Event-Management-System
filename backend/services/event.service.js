const crypto = require("crypto");
const pool = require("../config/db");

function generateReference(prefix = "REG") {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
}

function generateToken() {
  return crypto.randomBytes(20).toString("hex");
}

async function checkVenueConflict({ event_id = 0, venue_id, event_date, start_time, end_time }, connection) {
  if (!venue_id) return false;

  const sql = `
    SELECT event_id
    FROM events
    WHERE venue_id = ?
      AND event_date = ?
      AND event_id != ?
      AND (
        (? IS NULL AND start_time IS NULL)
        OR (? IS NULL AND start_time IS NOT NULL)
        OR (? IS NOT NULL AND start_time IS NULL)
        OR (? IS NOT NULL AND start_time IS NOT NULL AND NOT (end_time <= ? OR start_time >= ?))
      )
    LIMIT 1
  `;

  const params = [
    venue_id,
    event_date,
    event_id,
    start_time,
    start_time,
    start_time,
    start_time,
    end_time,
    start_time,
  ];

  const [rows] = await connection.query(sql, params);
  return rows.length > 0;
}

async function findBestJudge(connection) {
  const [rows] = await connection.query(
    `
    SELECT u.user_id, COUNT(ja.assignment_id) AS active_assignments
    FROM users u
    LEFT JOIN judge_assignments ja
      ON ja.judge_id = u.user_id
      AND ja.active = 1
    WHERE u.role = 'judge'
      AND u.status = 'active'
    GROUP BY u.user_id
    ORDER BY active_assignments ASC, u.created_at ASC
    LIMIT 1
    `
  );

  return rows.length ? rows[0].user_id : null;
}

async function autoAssignJudge(eventId, assignedBy = null, connection = null) {
  const conn = connection || (await pool.getConnection());
  let localConn = false;
  try {
    if (!connection) {
      await conn.beginTransaction();
      localConn = true;
    }

    const judgeId = await findBestJudge(conn);
    if (!judgeId) {
      if (localConn) await conn.commit();
      return null;
    }

    await conn.query(
      `UPDATE events SET assigned_judge_id = ? WHERE event_id = ?`,
      [judgeId, eventId]
    );

    await conn.query(
      `INSERT INTO judge_assignments (event_id, judge_id, assigned_by) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE active = VALUES(active), assigned_at = VALUES(assigned_at)`,
      [eventId, judgeId, assignedBy]
    );

    if (localConn) await conn.commit();
    return judgeId;
  } catch (error) {
    if (localConn) await conn.rollback();
    throw error;
  } finally {
    if (!connection && conn) conn.release();
  }
}

async function createEvent(eventData, organizerId) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    if (eventData.venue_id) {
      const conflict = await checkVenueConflict(
        {
          venue_id: eventData.venue_id,
          event_date: eventData.event_date,
          start_time: eventData.start_time || null,
          end_time: eventData.end_time || null,
        },
        conn
      );
      if (conflict) {
        throw { code: "VENUE_CONFLICT", message: "Venue conflict detected for the selected date/time." };
      }
    }

    const [result] = await conn.query(
      `
      INSERT INTO events
        (event_name, description, category, event_date, start_time, end_time,
         max_participants, registration_fee, prize_pool, sponsorship_total,
         event_status, organizer_id, venue_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)
      `,
      [
        eventData.event_name,
        eventData.description || null,
        eventData.category,
        eventData.event_date,
        eventData.start_time || null,
        eventData.end_time || null,
        eventData.max_participants,
        eventData.registration_fee,
        eventData.prize_pool ?? 0,
        0,
        organizerId,
        eventData.venue_id || null,
      ]
    );

    const eventId = result.insertId;
    const assignedJudgeId = await autoAssignJudge(eventId, organizerId, conn);

    await conn.commit();
    return { event_id: eventId, assigned_judge_id: assignedJudgeId };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function assignPendingUnassignedEvents() {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [events] = await conn.query(
      `SELECT event_id FROM events WHERE assigned_judge_id IS NULL AND event_status IN ('draft','open') ORDER BY event_date ASC`
    );
    for (const event of events) {
      await autoAssignJudge(event.event_id, null, conn);
    }
    await conn.commit();
    return events.length;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function updateEventStatus(eventId, eventStatus) {
  const allowed = ['draft','open','full','ongoing','completed','cancelled'];
  if (!allowed.includes(eventStatus)) {
    throw new Error(`Invalid event_status: ${eventStatus}`);
  }

  const [result] = await pool.query(
    `UPDATE events SET event_status = ?, updated_at = CURRENT_TIMESTAMP WHERE event_id = ?`,
    [eventStatus, eventId]
  );
  return result.affectedRows > 0;
}

async function refreshEventStatus(eventId) {
  const [rows] = await pool.query(
    `
    SELECT
      e.max_participants,
      COALESCE(SUM(CASE WHEN r.status = 'confirmed' THEN 1 ELSE 0 END), 0) as confirmed_count
    FROM events e
    LEFT JOIN registrations r ON e.event_id = r.event_id
    WHERE e.event_id = ?
    GROUP BY e.max_participants
    `,
    [eventId]
  );

  if (!rows.length) return null;

  const confirmed = Number(rows[0].confirmed_count);
  const maxParticipants = Number(rows[0].max_participants);
  if (confirmed >= maxParticipants) {
    await updateEventStatus(eventId, 'full');
    return 'full';
  }
  return 'open';
}

async function calculatePrizePool(eventId) {
  const [rows] = await pool.query(
    `
    SELECT
      e.prize_pool,
      COALESCE(SUM(s.amount), 0) AS sponsorship_total
    FROM events e
    LEFT JOIN sponsorships s
      ON s.event_id = e.event_id
      AND s.status = 'approved'
    WHERE e.event_id = ?
    GROUP BY e.event_id, e.prize_pool
    `,
    [eventId]
  );

  if (!rows.length) return null;
  const total = Number(rows[0].prize_pool) + Number(rows[0].sponsorship_total);
  await pool.query(
    `UPDATE events SET sponsorship_total = ?, updated_at = CURRENT_TIMESTAMP WHERE event_id = ?`,
    [rows[0].sponsorship_total, eventId]
  );
  return total;
}

module.exports = {
  createEvent,
  autoAssignJudge,
  assignPendingUnassignedEvents,
  updateEventStatus,
  refreshEventStatus,
  calculatePrizePool,
  generateReference,
  generateToken,
};
