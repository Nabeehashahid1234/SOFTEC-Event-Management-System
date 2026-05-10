USE softec_db;

DELIMITER //

DROP PROCEDURE IF EXISTS sp_get_leaderboard//
CREATE PROCEDURE sp_get_leaderboard(IN p_event_id INT)
BEGIN
  SELECT
    s.event_id,
    p.participant_id,
    u.name AS participant_name,
    ROUND(AVG(s.score), 2) AS average_score,
    COUNT(s.score_id) AS scores_count
  FROM scores s
  JOIN participants p ON p.participant_id = s.participant_id
  JOIN users u ON u.user_id = p.user_id
  WHERE s.event_id = p.event_id
    AND s.event_id = p.event_id
    AND s.event_id = p_event_id
  GROUP BY s.event_id, p.participant_id, u.name
  ORDER BY average_score DESC, scores_count DESC;
END//

DROP PROCEDURE IF EXISTS sp_assign_unassigned_events//
CREATE PROCEDURE sp_assign_unassigned_events()
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE current_event INT;
  DECLARE event_cursor CURSOR FOR
    SELECT event_id FROM events
    WHERE assigned_judge_id IS NULL
      AND event_status IN ('draft','open')
    ORDER BY event_date ASC;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  START TRANSACTION;
  OPEN event_cursor;
  read_loop: LOOP
    FETCH event_cursor INTO current_event;
    IF done THEN
      LEAVE read_loop;
    END IF;
    CALL sp_auto_assign_judge(current_event);
  END LOOP;
  CLOSE event_cursor;
  COMMIT;
END//

DROP PROCEDURE IF EXISTS sp_auto_assign_judge//
CREATE PROCEDURE sp_auto_assign_judge(IN p_event_id INT)
BEGIN
  DECLARE candidate_judge INT;
  DECLARE candidate_exists INT;

  SELECT u.user_id INTO candidate_judge
  FROM users u
  LEFT JOIN judge_assignments ja
    ON ja.judge_id = u.user_id
    AND ja.active = 1
  WHERE u.role = 'judge'
    AND u.status = 'active'
  GROUP BY u.user_id
  ORDER BY COUNT(ja.assignment_id) ASC, u.created_at ASC
  LIMIT 1;

  SET candidate_exists = candidate_judge IS NOT NULL;

  IF candidate_exists THEN
    UPDATE events SET assigned_judge_id = candidate_judge WHERE event_id = p_event_id;
    INSERT INTO judge_assignments (event_id, judge_id)
      VALUES (p_event_id, candidate_judge)
      ON DUPLICATE KEY UPDATE active = VALUES(active), assigned_at = VALUES(assigned_at);
  END IF;
END//

DROP PROCEDURE IF EXISTS sp_refresh_sponsorship_total//
CREATE PROCEDURE sp_refresh_sponsorship_total(IN p_event_id INT)
BEGIN
  UPDATE events e
  JOIN (
    SELECT COALESCE(SUM(s.amount), 0) AS sponsorship_total
    FROM sponsorships s
    WHERE s.event_id = p_event_id
      AND s.status = 'confirmed'
  ) totals
    ON 1=1
  SET e.sponsorship_total = totals.sponsorship_total,
      e.updated_at = CURRENT_TIMESTAMP
  WHERE e.event_id = p_event_id;
END//

DELIMITER ;
