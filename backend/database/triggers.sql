USE softec_db;

DELIMITER //

DROP TRIGGER IF EXISTS prevent_venue_conflict//
CREATE TRIGGER prevent_venue_conflict
BEFORE INSERT ON events
FOR EACH ROW
BEGIN
  DECLARE v_conflicting_event VARCHAR(160);
  DECLARE v_message VARCHAR(255);

  SELECT COALESCE(MAX(event_name), 'unknown event') INTO v_conflicting_event
  FROM events
  WHERE venue_id = NEW.venue_id
    AND event_date = NEW.event_date;

  IF NEW.venue_id IS NOT NULL AND EXISTS (
    SELECT 1
    FROM events
    WHERE venue_id = NEW.venue_id
      AND event_date = NEW.event_date
  ) THEN
    SET v_message = CONCAT('Venue is already booked for this date by event: ', v_conflicting_event);
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = v_message;
  END IF;
END//

DROP TRIGGER IF EXISTS prevent_venue_conflict_update//
CREATE TRIGGER prevent_venue_conflict_update
BEFORE UPDATE ON events
FOR EACH ROW
BEGIN
  DECLARE v_conflicting_event VARCHAR(160);
  DECLARE v_message VARCHAR(255);

  SELECT COALESCE(MAX(event_name), 'unknown event') INTO v_conflicting_event
  FROM events
  WHERE venue_id = NEW.venue_id
    AND event_date = NEW.event_date
    AND event_id <> OLD.event_id;

  IF NEW.venue_id IS NOT NULL AND EXISTS (
    SELECT 1
    FROM events
    WHERE venue_id = NEW.venue_id
      AND event_date = NEW.event_date
      AND event_id <> OLD.event_id
  ) THEN
    SET v_message = CONCAT('Venue is already booked for this date by event: ', v_conflicting_event);
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = v_message;
  END IF;
END//

DROP TRIGGER IF EXISTS auto_register_participant//
CREATE TRIGGER auto_register_participant
AFTER INSERT ON payments
FOR EACH ROW
BEGIN
  IF NEW.payment_type = 'registration'
     AND NEW.status = 'completed'
     AND NEW.event_id IS NOT NULL THEN
    INSERT IGNORE INTO participants (user_id, event_id)
    VALUES (NEW.user_id, NEW.event_id);
  END IF;
END//

DELIMITER ;
