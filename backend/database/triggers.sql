USE softec_db;

DELIMITER //

-- ─── Venue conflict: block double-booking on INSERT ───────────────────────────
DROP TRIGGER IF EXISTS prevent_venue_conflict//
CREATE TRIGGER prevent_venue_conflict
BEFORE INSERT ON events
FOR EACH ROW
BEGIN
  DECLARE v_name    VARCHAR(160);
  DECLARE v_message VARCHAR(255);

  IF NEW.venue_id IS NOT NULL THEN
    SELECT COALESCE(MAX(event_name), 'unknown event')
    INTO   v_name
    FROM   events
    WHERE  venue_id   = NEW.venue_id
      AND  event_date = NEW.event_date;

    IF v_name IS NOT NULL AND EXISTS (
      SELECT 1 FROM events
      WHERE  venue_id   = NEW.venue_id
        AND  event_date = NEW.event_date
    ) THEN
      SET v_message = CONCAT('Venue already booked for this date by: ', v_name);
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_message;
    END IF;
  END IF;
END//

-- ─── Venue conflict: block double-booking on UPDATE ───────────────────────────
DROP TRIGGER IF EXISTS prevent_venue_conflict_update//
CREATE TRIGGER prevent_venue_conflict_update
BEFORE UPDATE ON events
FOR EACH ROW
BEGIN
  DECLARE v_name    VARCHAR(160);
  DECLARE v_message VARCHAR(255);

  IF NEW.venue_id IS NOT NULL THEN
    SELECT COALESCE(MAX(event_name), 'unknown event')
    INTO   v_name
    FROM   events
    WHERE  venue_id   = NEW.venue_id
      AND  event_date = NEW.event_date
      AND  event_id  <> OLD.event_id;

    IF v_name IS NOT NULL AND EXISTS (
      SELECT 1 FROM events
      WHERE  venue_id   = NEW.venue_id
        AND  event_date = NEW.event_date
        AND  event_id  <> OLD.event_id
    ) THEN
      SET v_message = CONCAT('Venue already booked for this date by: ', v_name);
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_message;
    END IF;
  END IF;
END//

-- ─── Auto-issue pass when registration payment completes ─────────────────────
-- The registration route inserts a participant record immediately on register.
-- This trigger fires when a payment is marked completed (free events at insert
-- time; paid events when PATCH /payments/:id/confirm is called).  It issues a
-- pass only if the participant record already exists (INSERT IGNORE is safe).
DROP TRIGGER IF EXISTS auto_issue_pass_on_payment//
CREATE TRIGGER auto_issue_pass_on_payment
AFTER UPDATE ON payments
FOR EACH ROW
BEGIN
  DECLARE v_participant_id INT DEFAULT NULL;

  IF NEW.payment_type = 'registration'
     AND NEW.status   = 'completed'
     AND OLD.status  <> 'completed'
     AND NEW.event_id IS NOT NULL
  THEN
    SELECT participant_id
    INTO   v_participant_id
    FROM   participants
    WHERE  user_id   = NEW.user_id
      AND  event_id  = NEW.event_id
    LIMIT  1;

    IF v_participant_id IS NOT NULL THEN
      INSERT IGNORE INTO passes (pass_id, participant_id, event_id, qr_code)
      VALUES (
        UUID(),
        v_participant_id,
        NEW.event_id,
        CONCAT('SOFTEC-', NEW.event_id, '-', v_participant_id)
      );
    END IF;
  END IF;
END//

-- ─── Keep sponsorship_total in sync when a sponsorship is approved/rejected ──
DROP TRIGGER IF EXISTS sync_sponsorship_total_on_update//
CREATE TRIGGER sync_sponsorship_total_on_update
AFTER UPDATE ON sponsorships
FOR EACH ROW
BEGIN
  -- Recalculate from scratch to avoid double-counting on repeated moderation updates
  UPDATE events
  SET    sponsorship_total = (
           SELECT COALESCE(SUM(amount), 0)
           FROM   sponsorships
           WHERE  event_id = NEW.event_id
             AND  status   = 'approved'
         )
  WHERE  event_id = NEW.event_id;
END//

DELIMITER ;
