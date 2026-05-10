USE softec_db;

DELIMITER //

-- ─── Leaderboard: ranks participants by average judge score for an event ───────
DROP PROCEDURE IF EXISTS sp_get_leaderboard//
CREATE PROCEDURE sp_get_leaderboard(IN p_event_id INT)
BEGIN
  SELECT
    ranked.rank,
    ranked.participant_id,
    ranked.participant_name AS name,
    ranked.average_score   AS score
  FROM (
    SELECT
      p.participant_id,
      u.name                                                                   AS participant_name,
      ROUND(AVG(j.score), 2)                                                   AS average_score,
      ROW_NUMBER() OVER (ORDER BY AVG(j.score) DESC, COUNT(j.judging_id) DESC,
                         p.participant_id ASC)                                  AS rank
    FROM judging j
    JOIN participants p ON p.participant_id = j.participant_id
    JOIN users       u ON u.user_id         = p.user_id
    WHERE j.event_id = p_event_id
    GROUP BY p.participant_id, u.name
  ) AS ranked
  ORDER BY ranked.rank;
END//

-- ─── Assign the least-busy judge to every unassigned event ────────────────────
DROP PROCEDURE IF EXISTS sp_assign_unassigned_events//
CREATE PROCEDURE sp_assign_unassigned_events()
BEGIN
  DECLARE done          INT DEFAULT FALSE;
  DECLARE current_event INT;
  DECLARE event_cursor CURSOR FOR
    SELECT e.event_id
    FROM   events e
    WHERE  NOT EXISTS (
             SELECT 1 FROM event_judges ej WHERE ej.event_id = e.event_id
           )
      AND  e.event_status IN ('draft', 'open')
    ORDER BY e.event_date ASC;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  START TRANSACTION;
  OPEN event_cursor;
  read_loop: LOOP
    FETCH event_cursor INTO current_event;
    IF done THEN LEAVE read_loop; END IF;
    CALL sp_auto_assign_judge(current_event);
  END LOOP;
  CLOSE event_cursor;
  COMMIT;
END//

-- ─── Assign the least-busy judge to a single event ───────────────────────────
DROP PROCEDURE IF EXISTS sp_auto_assign_judge//
CREATE PROCEDURE sp_auto_assign_judge(IN p_event_id INT)
BEGIN
  DECLARE candidate_judge_id INT DEFAULT NULL;

  -- Pick the judge with the fewest current assignments (ties broken by judge_id)
  SELECT j.judge_id
  INTO   candidate_judge_id
  FROM   judges j
  LEFT JOIN event_judges ej ON ej.judge_id = j.judge_id
  GROUP  BY j.judge_id, j.assigned_events_count
  ORDER  BY j.assigned_events_count ASC, COUNT(ej.event_judge_id) ASC, j.judge_id ASC
  LIMIT  1;

  IF candidate_judge_id IS NOT NULL THEN
    INSERT IGNORE INTO event_judges (event_id, judge_id)
      VALUES (p_event_id, candidate_judge_id);

    IF ROW_COUNT() > 0 THEN
      UPDATE judges
      SET    assigned_events_count = assigned_events_count + 1
      WHERE  judge_id = candidate_judge_id;
    END IF;
  END IF;
END//

-- ─── Recalculate sponsorship_total for one event from approved sponsorships ──
DROP PROCEDURE IF EXISTS sp_refresh_sponsorship_total//
CREATE PROCEDURE sp_refresh_sponsorship_total(IN p_event_id INT)
BEGIN
  UPDATE events e
  JOIN (
    SELECT COALESCE(SUM(s.amount), 0) AS total
    FROM   sponsorships s
    WHERE  s.event_id = p_event_id
      AND  s.status   = 'approved'
  ) totals ON 1 = 1
  SET e.sponsorship_total = totals.total,
      e.updated_at        = CURRENT_TIMESTAMP
  WHERE e.event_id = p_event_id;
END//

DELIMITER ;
