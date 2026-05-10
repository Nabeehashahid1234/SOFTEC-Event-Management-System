USE softec_db;

SET GLOBAL event_scheduler = ON;

DROP EVENT IF EXISTS ev_generate_event_reminders_daily;

DELIMITER //

CREATE EVENT ev_generate_event_reminders_daily
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN
  CALL sp_generate_event_reminders();
END//

DELIMITER ;
