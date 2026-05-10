USE softec_db;

/*
  SOFTEC Event Management System
  QUERIES_DEMO.sql

  Purpose:
  A single instructor-facing file demonstrating graded SQL concepts:
  joins, subqueries, GROUP BY, HAVING, indexing, transactions, triggers,
  stored procedures, views, and the 6 required report queries.
*/

/* =========================================================
   0. INDEXING DEMONSTRATION
   ========================================================= */

-- Indexes implemented in schema.sql:
-- users(email), users(role), events(category), events(event_date),
-- participants(user_id), participants(event_id), judging(event_id),
-- payments(user_id, status).

SHOW INDEX FROM users;
SHOW INDEX FROM events;
SHOW INDEX FROM participants;
SHOW INDEX FROM payments;

-- Example optimizer check using indexed columns.
EXPLAIN
SELECT event_id, event_name, category, event_date
FROM events
WHERE category = 'Tech Events'
  AND event_date BETWEEN '2026-06-01' AND '2026-06-10';

/* Sample output columns:
   key: idx_events_category or idx_events_event_date
   rows: reduced scan count compared with a full table scan
*/

/* =========================================================
   1. SIX GRADED REPORT QUERIES
   ========================================================= */

-- Q1: LEFT JOIN + GROUP BY + COUNT + ORDER BY
SELECT
  e.event_id,
  e.event_name,
  e.category,
  e.event_date,
  COUNT(p.participant_id) AS total_participants
FROM events e
LEFT JOIN participants p ON p.event_id = e.event_id
GROUP BY e.event_id, e.event_name, e.category, e.event_date
ORDER BY e.event_date, total_participants DESC;

/* Sample output:
   event_id | event_name          | category    | event_date | total_participants
   1        | Speed Programming   | Tech Events | 2026-06-01 | 5
   2        | SOFTEC Hackathon    | Tech Events | 2026-06-02 | 3
*/

-- Q2: INNER JOIN + GROUP BY + AVG + HAVING
SELECT
  e.event_id,
  e.event_name,
  ROUND(AVG(j.score), 2) AS average_score,
  COUNT(j.judging_id) AS scores_submitted
FROM events e
INNER JOIN judging j ON j.event_id = e.event_id
GROUP BY e.event_id, e.event_name
HAVING AVG(j.score) > 7.5
ORDER BY average_score DESC;

/* Sample output:
   event_id | event_name        | average_score | scores_submitted
   1        | Speed Programming | 8.88          | 10
   2        | SOFTEC Hackathon  | 8.63          | 4
*/

-- Q3: JOIN + GROUP BY + SUM
SELECT
  s.sponsor_id,
  s.company_name,
  s.sponsorship_level,
  SUM(sp.amount) AS total_funds,
  COUNT(DISTINCT sp.event_id) AS sponsored_events
FROM sponsors s
JOIN sponsorships sp ON sp.sponsor_id = s.sponsor_id
WHERE sp.status = 'confirmed'
GROUP BY s.sponsor_id, s.company_name, s.sponsorship_level
ORDER BY total_funds DESC;

/* Sample output:
   sponsor_id | company_name    | sponsorship_level | total_funds | sponsored_events
   1          | Systems Limited | Gold              | 1700000.00  | 2
*/

-- Q4: multi-JOIN + COALESCE + WHERE
SELECT
  u.user_id,
  u.name,
  COUNT(DISTINCT p.event_id) AS registered_events,
  COALESCE(SUM(CASE WHEN pay.status = 'completed' THEN pay.amount END), 0) AS total_paid,
  COALESCE(MAX(a.room_type), 'No accommodation') AS accommodation_status
FROM users u
LEFT JOIN participants p ON p.user_id = u.user_id
LEFT JOIN payments pay ON pay.user_id = u.user_id
LEFT JOIN user_accommodations ua ON ua.user_id = u.user_id
LEFT JOIN accommodations a ON a.accommodation_id = ua.accommodation_id
WHERE u.role = 'participant'
GROUP BY u.user_id, u.name
ORDER BY registered_events DESC, u.name;

/* Sample output:
   user_id | name         | registered_events | total_paid | accommodation_status
   7       | Bilal Ahmed  | 2                 | 10500.00   | Double
*/

-- Q5: LEFT JOIN + GROUP BY + COUNT
SELECT
  v.venue_id,
  v.venue_name,
  v.capacity,
  COUNT(e.event_id) AS events_hosted,
  COALESCE(SUM(e.registered_participants), 0) AS total_registered
FROM venues v
LEFT JOIN events e ON e.venue_id = v.venue_id
GROUP BY v.venue_id, v.venue_name, v.capacity
ORDER BY events_hosted DESC;

/* Sample output:
   venue_id | venue_name      | capacity | events_hosted | total_registered
   4        | Sports Complex  | 300      | 5             | 1
*/

-- Q6: JOIN + AVG + LIMIT 10
SELECT
  p.participant_id,
  u.name AS participant_name,
  e.event_name,
  ROUND(AVG(j.score), 2) AS avg_score
FROM judging j
JOIN participants p ON p.participant_id = j.participant_id
JOIN users u ON u.user_id = p.user_id
JOIN events e ON e.event_id = j.event_id
WHERE e.event_id = 1
GROUP BY p.participant_id, u.name, e.event_name
ORDER BY avg_score DESC
LIMIT 10;

/* Sample output:
   participant_id | participant_name | event_name        | avg_score
   5              | Hassan Tariq     | Speed Programming | 9.50
*/

/* =========================================================
   2. JOIN TYPE EXAMPLES
   ========================================================= */

-- INNER JOIN: only events that have at least one participant.
SELECT DISTINCT e.event_name
FROM events e
INNER JOIN participants p ON p.event_id = e.event_id;

-- LEFT JOIN: all events, including events with zero participants.
SELECT e.event_name, COUNT(p.participant_id) AS registrations
FROM events e
LEFT JOIN participants p ON p.event_id = e.event_id
GROUP BY e.event_id, e.event_name;

-- RIGHT JOIN: all judges, including judges not yet assigned to an event.
SELECT j.name, COUNT(ej.event_id) AS assigned_events
FROM event_judges ej
RIGHT JOIN judges j ON j.judge_id = ej.judge_id
GROUP BY j.judge_id, j.name;

-- SELF JOIN: pairs of events scheduled at the same venue in different dates.
SELECT
  e1.event_name AS event_a,
  e2.event_name AS event_b,
  v.venue_name
FROM events e1
JOIN events e2
  ON e1.venue_id = e2.venue_id
 AND e1.event_id < e2.event_id
JOIN venues v ON v.venue_id = e1.venue_id
LIMIT 10;

/* =========================================================
   3. SUBQUERY EXAMPLES
   ========================================================= */

-- Scalar subquery: events above average registration fee.
SELECT event_name, registration_fee
FROM events
WHERE registration_fee > (
  SELECT AVG(registration_fee)
  FROM events
);

-- IN subquery: participants who have completed at least one payment.
SELECT user_id, name
FROM users
WHERE user_id IN (
  SELECT user_id
  FROM payments
  WHERE status = 'completed'
);

-- Correlated subquery: participant count per event.
SELECT
  e.event_name,
  (
    SELECT COUNT(*)
    FROM participants p
    WHERE p.event_id = e.event_id
  ) AS participant_count
FROM events e;

/* =========================================================
   4. TRANSACTION DEMONSTRATION
   ========================================================= */

-- Manual transaction: booking accommodation atomically.
START TRANSACTION;

UPDATE accommodations
SET available_rooms = available_rooms - 1
WHERE accommodation_id = 1
  AND available_rooms > 0;

INSERT INTO user_accommodations (user_id, accommodation_id, check_in, check_out)
VALUES (9, 1, '2026-06-01', '2026-06-04');

COMMIT;

-- Rollback example for demonstration only.
START TRANSACTION;
UPDATE payments SET status = 'failed' WHERE payment_id = 999999;
ROLLBACK;

/* =========================================================
   5. TRIGGER DEMONSTRATIONS
   ========================================================= */

-- Trigger demo A: prevent_venue_conflict.
-- Expected result: handled ERROR 1644 (45000), message includes conflicting event name.
DROP PROCEDURE IF EXISTS demo_venue_conflict_trigger;

DELIMITER //
CREATE PROCEDURE demo_venue_conflict_trigger()
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    GET DIAGNOSTICS CONDITION 1
      @demo_sqlstate = RETURNED_SQLSTATE,
      @demo_message = MESSAGE_TEXT;
    SELECT @demo_sqlstate AS sqlstate, @demo_message AS trigger_message;
  END;

  INSERT INTO events (
    event_name, description, category, event_date, max_participants,
    venue_id, organizer_id, registration_fee
  ) VALUES (
    'Conflict Demo Event',
    'This should fail because venue 3 is already booked on 2026-06-01.',
    'Tech Events',
    '2026-06-01',
    50,
    3,
    2,
    1000.00
  );
END//
DELIMITER ;

CALL demo_venue_conflict_trigger();
DROP PROCEDURE IF EXISTS demo_venue_conflict_trigger;

-- Trigger demo B: auto_register_participant.
-- Expected result: payment insert creates a participants row automatically.
DELETE FROM participants WHERE user_id = 26 AND event_id = 18;
DELETE FROM payments WHERE user_id = 26 AND event_id = 18 AND payment_type = 'registration';

INSERT INTO payments (user_id, event_id, amount, payment_type, status)
VALUES (26, 18, 0.00, 'registration', 'completed');

SELECT *
FROM participants
WHERE user_id = 26
  AND event_id = 18;

/* =========================================================
   6. STORED PROCEDURE CALL EXAMPLES
   ========================================================= */

-- Creates a team and members atomically, rejects duplicate event team membership.
CALL sp_register_team('Demo Builders', 18, JSON_ARRAY(27, 28, 29));

-- Schedules Prelims, Semi-Finals, Finals in one transaction.
CALL sp_schedule_event_rounds(
  18,
  '2026-06-18 09:00:00',
  '2026-06-18 13:00:00',
  '2026-06-18 17:00:00',
  1
);

-- Returns top 10 participants by average score.
CALL sp_get_leaderboard(1);

-- Creates reminders for events that are 3 days away.
CALL sp_generate_event_reminders();

-- Processes a refund and removes registration for registration payments.
CALL sp_process_refund(16);

/* =========================================================
   7. VIEW QUERY EXAMPLES
   ========================================================= */

SELECT * FROM venue_utilization_stats;
SELECT * FROM event_statistics ORDER BY registered_count DESC;
SELECT * FROM sponsor_summary ORDER BY total_amount DESC;
SELECT * FROM participant_logistics ORDER BY total_paid DESC;
SELECT * FROM revenue_breakdown;
SELECT * FROM high_quality_events;
SELECT * FROM upcoming_events ORDER BY event_date;
SELECT * FROM judge_workload ORDER BY events_assigned DESC;
