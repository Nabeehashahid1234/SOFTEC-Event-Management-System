-- Runtime schema stabilization for backend query compatibility.
-- Plain mysql2-compatible statements; no DELIMITER/procedure syntax.

SET @exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'events' AND COLUMN_NAME = 'registered_participants');
SET @ddl := IF(@exists = 0, 'ALTER TABLE events ADD COLUMN registered_participants INT NOT NULL DEFAULT 0 AFTER max_participants', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;
-- comment
SET @exists := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'events' AND INDEX_NAME = 'idx_events_registered_participants');
SET @ddl := IF(@exists = 0, 'ALTER TABLE events ADD INDEX idx_events_registered_participants (registered_participants)', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'participants' AND COLUMN_NAME = 'registration_date');
SET @ddl := IF(@exists = 0, 'ALTER TABLE participants ADD COLUMN registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER roll_number', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'event_rounds' AND COLUMN_NAME = 'start_time');
SET @ddl := IF(@exists = 0, 'ALTER TABLE event_rounds ADD COLUMN start_time TIME NULL AFTER round_date', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'event_rounds' AND COLUMN_NAME = 'end_time');
SET @ddl := IF(@exists = 0, 'ALTER TABLE event_rounds ADD COLUMN end_time TIME NULL AFTER start_time', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'registrations' AND COLUMN_NAME = 'user_id');
SET @ddl := IF(@exists = 0, 'ALTER TABLE registrations ADD COLUMN user_id INT NULL AFTER event_id', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

ALTER TABLE registrations MODIFY COLUMN participant_id INT NULL;
ALTER TABLE registrations MODIFY COLUMN registration_reference VARCHAR(100) NULL;

SET @exists := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'registrations' AND INDEX_NAME = 'idx_registrations_user_id');
SET @ddl := IF(@exists = 0, 'ALTER TABLE registrations ADD INDEX idx_registrations_user_id (user_id)', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE registrations r
LEFT JOIN participants p ON p.participant_id = r.participant_id
SET r.user_id = COALESCE(r.user_id, p.user_id)
WHERE r.user_id IS NULL;

SET @exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'payment_date');
SET @ddl := IF(@exists = 0, 'ALTER TABLE payments ADD COLUMN payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER status', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'sponsor_id');
SET @ddl := IF(@exists = 0, 'ALTER TABLE payments ADD COLUMN sponsor_id INT NULL AFTER registration_id', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

ALTER TABLE payments MODIFY COLUMN registration_id INT NULL;
ALTER TABLE payments MODIFY COLUMN event_id INT NULL;
ALTER TABLE payments MODIFY COLUMN payment_type ENUM('registration','accommodation','sponsorship','refund') NOT NULL;

SET @exists := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND INDEX_NAME = 'idx_payments_user');
SET @ddl := IF(@exists = 0, 'ALTER TABLE payments ADD INDEX idx_payments_user (user_id)', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND INDEX_NAME = 'idx_payments_event');
SET @ddl := IF(@exists = 0, 'ALTER TABLE payments ADD INDEX idx_payments_event (event_id)', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND INDEX_NAME = 'idx_payments_payment_date');
SET @ddl := IF(@exists = 0, 'ALTER TABLE payments ADD INDEX idx_payments_payment_date (payment_date)', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND INDEX_NAME = 'idx_payments_sponsor_id');
SET @ddl := IF(@exists = 0, 'ALTER TABLE payments ADD INDEX idx_payments_sponsor_id (sponsor_id)', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sponsors' AND COLUMN_NAME = 'sponsorship_level');
SET @ddl := IF(@exists = 0, 'ALTER TABLE sponsors ADD COLUMN sponsorship_level ENUM(''Title'',''Gold'',''Silver'',''Bronze'',''Partner'') NOT NULL DEFAULT ''Gold'' AFTER phone', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sponsors' AND COLUMN_NAME = 'amount');
SET @ddl := IF(@exists = 0, 'ALTER TABLE sponsors ADD COLUMN amount DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER sponsorship_level', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

ALTER TABLE sponsors MODIFY COLUMN contact_person VARCHAR(120) NULL;

SET @exists := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sponsors' AND INDEX_NAME = 'idx_sponsors_sponsorship_level');
SET @ddl := IF(@exists = 0, 'ALTER TABLE sponsors ADD INDEX idx_sponsors_sponsorship_level (sponsorship_level)', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE sponsors
SET sponsorship_level = CASE WHEN tier IN ('Title','Gold','Silver','Partner') THEN tier ELSE sponsorship_level END
WHERE sponsorship_level IS NULL OR sponsorship_level = 'Gold';

SET @exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sponsorships' AND COLUMN_NAME = 'user_id');
SET @ddl := IF(@exists = 0, 'ALTER TABLE sponsorships ADD COLUMN user_id INT NULL AFTER sponsor_id', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sponsorships' AND COLUMN_NAME = 'sponsorship_type');
SET @ddl := IF(@exists = 0, 'ALTER TABLE sponsorships ADD COLUMN sponsorship_type ENUM(''Title'',''Gold'',''Silver'',''Bronze'',''Partner'') NOT NULL DEFAULT ''Gold'' AFTER event_id', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sponsorships' AND COLUMN_NAME = 'created_at');
SET @ddl := IF(@exists = 0, 'ALTER TABLE sponsorships ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER sponsored_at', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sponsorships' AND INDEX_NAME = 'idx_sponsorships_user_id');
SET @ddl := IF(@exists = 0, 'ALTER TABLE sponsorships ADD INDEX idx_sponsorships_user_id (user_id)', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sponsorships' AND INDEX_NAME = 'idx_sponsorships_created_at');
SET @ddl := IF(@exists = 0, 'ALTER TABLE sponsorships ADD INDEX idx_sponsorships_created_at (created_at)', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE sponsorships sp
LEFT JOIN sponsors s ON s.sponsor_id = sp.sponsor_id
SET sp.user_id = COALESCE(sp.user_id, s.user_id),
    sp.sponsorship_type = CASE WHEN sp.tier IN ('Title','Gold','Silver','Partner') THEN sp.tier ELSE sp.sponsorship_type END
WHERE sp.user_id IS NULL OR sp.sponsorship_type = 'Gold';

SET @exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'teams' AND COLUMN_NAME = 'created_by');
SET @ddl := IF(@exists = 0, 'ALTER TABLE teams ADD COLUMN created_by INT NULL AFTER event_id', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'teams' AND INDEX_NAME = 'idx_teams_created_by');
SET @ddl := IF(@exists = 0, 'ALTER TABLE teams ADD INDEX idx_teams_created_by (created_by)', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS accommodations (
  accommodation_id INT AUTO_INCREMENT PRIMARY KEY,
  venue_name VARCHAR(160) NULL,
  room_type VARCHAR(100) NOT NULL,
  capacity INT NOT NULL DEFAULT 1,
  price_per_night DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  availability INT NOT NULL DEFAULT 0,
  available_rooms INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_accommodations_room_type (room_type),
  INDEX idx_accommodations_availability (availability),
  INDEX idx_accommodations_available_rooms (available_rooms)
) ENGINE=InnoDB;

SET @exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'accommodations' AND COLUMN_NAME = 'venue_name');
SET @ddl := IF(@exists = 0, 'ALTER TABLE accommodations ADD COLUMN venue_name VARCHAR(160) NULL AFTER accommodation_id', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'accommodations' AND COLUMN_NAME = 'availability');
SET @ddl := IF(@exists = 0, 'ALTER TABLE accommodations ADD COLUMN availability INT NOT NULL DEFAULT 0 AFTER price_per_night', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'accommodations' AND COLUMN_NAME = 'available_rooms');
SET @ddl := IF(@exists = 0, 'ALTER TABLE accommodations ADD COLUMN available_rooms INT NOT NULL DEFAULT 0 AFTER availability', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS user_accommodations (
  user_accommodation_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  accommodation_id INT NOT NULL,
  booked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  CONSTRAINT fk_user_accommodations_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_user_accommodations_accommodation FOREIGN KEY (accommodation_id) REFERENCES accommodations(accommodation_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_user_accommodations_user_id (user_id),
  INDEX idx_user_accommodations_accommodation_id (accommodation_id),
  INDEX idx_user_accommodations_check_in (check_in)
) ENGINE=InnoDB;

SET @exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user_accommodations' AND COLUMN_NAME = 'booked_at');
SET @ddl := IF(@exists = 0, 'ALTER TABLE user_accommodations ADD COLUMN booked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER accommodation_id', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'registrations' AND CONSTRAINT_NAME = 'fk_registrations_user');
SET @ddl := IF(@exists = 0, 'ALTER TABLE registrations ADD CONSTRAINT fk_registrations_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND CONSTRAINT_NAME = 'fk_payments_sponsor');
SET @ddl := IF(@exists = 0, 'ALTER TABLE payments ADD CONSTRAINT fk_payments_sponsor FOREIGN KEY (sponsor_id) REFERENCES sponsors(sponsor_id) ON DELETE SET NULL ON UPDATE CASCADE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'sponsorships' AND CONSTRAINT_NAME = 'fk_sponsorships_user');
SET @ddl := IF(@exists = 0, 'ALTER TABLE sponsorships ADD CONSTRAINT fk_sponsorships_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'teams' AND CONSTRAINT_NAME = 'fk_teams_created_by');
SET @ddl := IF(@exists = 0, 'ALTER TABLE teams ADD CONSTRAINT fk_teams_created_by FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'participants' AND INDEX_NAME = 'uq_participant_user');
SET @ddl := IF(@exists > 0, 'ALTER TABLE participants DROP INDEX uq_participant_user', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'participants' AND INDEX_NAME = 'uq_participant_user_event');
SET @ddl := IF(@exists = 0, 'ALTER TABLE participants ADD UNIQUE INDEX uq_participant_user_event (user_id, event_id)', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE events e
LEFT JOIN (
  SELECT event_id, COUNT(*) AS participant_count
  FROM participants
  GROUP BY event_id
) p ON p.event_id = e.event_id
SET e.registered_participants = COALESCE(p.participant_count, 0)
WHERE e.registered_participants = 0;
