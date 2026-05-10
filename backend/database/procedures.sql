USE softec_db;

DELIMITER //

CREATE PROCEDURE sp_register_team(
  IN p_team_name VARCHAR(120),
  IN p_event_id INT,
  IN p_member_user_ids JSON
)
BEGIN
  DECLARE v_team_id INT;
  DECLARE v_member_count INT DEFAULT 0;
  DECLARE v_conflicts INT DEFAULT 0;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

  SELECT COUNT(*) INTO v_member_count
  FROM JSON_TABLE(p_member_user_ids, '$[*]' COLUMNS (user_id INT PATH '$')) AS members;

  IF v_member_count = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Team must contain at least one member';
  END IF;

  SELECT COUNT(*) INTO v_conflicts
  FROM JSON_TABLE(p_member_user_ids, '$[*]' COLUMNS (user_id INT PATH '$')) AS requested
  JOIN team_members tm ON tm.user_id = requested.user_id
  JOIN teams t ON t.team_id = tm.team_id
  WHERE t.event_id = p_event_id;

  IF v_conflicts > 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'One or more members already belong to a team for this event';
  END IF;

  INSERT INTO teams (team_name, event_id)
  VALUES (p_team_name, p_event_id);

  SET v_team_id = LAST_INSERT_ID();

  INSERT INTO team_members (team_id, user_id, role)
  SELECT v_team_id, user_id,
         CASE WHEN ordinality = 1 THEN 'captain' ELSE 'member' END
  FROM JSON_TABLE(
    p_member_user_ids,
    '$[*]' COLUMNS (
      ordinality FOR ORDINALITY,
      user_id INT PATH '$'
    )
  ) AS members;

  COMMIT;

  SELECT v_team_id AS team_id;
END//

CREATE PROCEDURE sp_schedule_event_rounds(
  IN p_event_id INT,
  IN p_prelim_date DATETIME,
  IN p_semi_date DATETIME,
  IN p_final_date DATETIME,
  IN p_venue_id INT
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

  INSERT INTO event_rounds (event_id, round_type, round_date, venue_id)
  VALUES
    (p_event_id, 'Prelims', p_prelim_date, p_venue_id),
    (p_event_id, 'Semi-Finals', p_semi_date, p_venue_id),
    (p_event_id, 'Finals', p_final_date, p_venue_id);

  COMMIT;
END//

CREATE PROCEDURE sp_get_leaderboard(IN p_event_id INT)
BEGIN
  SELECT
    p.participant_id,
    u.user_id,
    u.name,
    ROUND(AVG(j.score), 2) AS avg_score,
    COUNT(j.judging_id) AS scores_count
  FROM participants p
  JOIN users u ON u.user_id = p.user_id
  JOIN judging j ON j.participant_id = p.participant_id
  WHERE p.event_id = p_event_id
  GROUP BY p.participant_id, u.user_id, u.name
  ORDER BY avg_score DESC, scores_count DESC
  LIMIT 10;
END//

CREATE PROCEDURE sp_generate_event_reminders()
BEGIN
  INSERT IGNORE INTO reminders (user_id, event_id, reminder_date, message)
  SELECT
    p.user_id,
    e.event_id,
    CURRENT_DATE(),
    CONCAT('Reminder: ', e.event_name, ' is scheduled on ', DATE_FORMAT(e.event_date, '%Y-%m-%d'))
  FROM participants p
  JOIN events e ON e.event_id = p.event_id
  WHERE e.event_date = DATE_ADD(CURRENT_DATE(), INTERVAL 3 DAY);
END//

CREATE PROCEDURE sp_process_refund(IN p_payment_id INT)
BEGIN
  DECLARE v_user_id INT;
  DECLARE v_event_id INT;
  DECLARE v_payment_type ENUM('registration','accommodation','sponsorship');

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

  SELECT user_id, event_id, payment_type
  INTO v_user_id, v_event_id, v_payment_type
  FROM payments
  WHERE payment_id = p_payment_id
  FOR UPDATE;

  UPDATE payments
  SET status = 'failed'
  WHERE payment_id = p_payment_id;

  IF v_payment_type = 'registration' AND v_event_id IS NOT NULL THEN
    DELETE FROM participants
    WHERE user_id = v_user_id
      AND event_id = v_event_id;
  END IF;

  COMMIT;
END//

DELIMITER ;
