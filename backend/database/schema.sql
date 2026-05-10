-- Drop database softec_db;
CREATE DATABASE IF NOT EXISTS softec_db;
USE softec_db;

SET FOREIGN_KEY_CHECKS = 0;
DROP PROCEDURE IF EXISTS sp_get_leaderboard;
DROP PROCEDURE IF EXISTS sp_assign_unassigned_events;
DROP PROCEDURE IF EXISTS sp_auto_assign_judge;
DROP PROCEDURE IF EXISTS sp_refresh_sponsorship_total;
DROP VIEW IF EXISTS venue_utilization_stats;
DROP VIEW IF EXISTS event_statistics;
DROP VIEW IF EXISTS sponsor_summary;
DROP VIEW IF EXISTS participant_logistics;
DROP VIEW IF EXISTS revenue_breakdown;
DROP VIEW IF EXISTS high_quality_events;
DROP VIEW IF EXISTS upcoming_events;
DROP VIEW IF EXISTS judge_workload;
DROP VIEW IF EXISTS vw_sponsorship_totals;
DROP VIEW IF EXISTS vw_judge_workload;
DROP VIEW IF EXISTS vw_event_leaderboard;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS event_passes;
DROP TABLE IF EXISTS passes;
DROP TABLE IF EXISTS scores;
DROP TABLE IF EXISTS judging;
DROP TABLE IF EXISTS event_judges;
DROP TABLE IF EXISTS sponsorships;
DROP TABLE IF EXISTS sponsors;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS team_members;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS participants;
DROP TABLE IF EXISTS judge_assignments;
DROP TABLE IF EXISTS judges;
DROP TABLE IF EXISTS user_accommodations;
DROP TABLE IF EXISTS accommodations;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS venues;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','organizer','judge','sponsor','participant') NOT NULL,
  status ENUM('active','inactive','suspended') NOT NULL DEFAULT 'active',
  phone VARCHAR(50) NULL,
  organization VARCHAR(160) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role),
  INDEX idx_users_status (status)
) ENGINE=InnoDB;

CREATE TABLE venues (
  venue_id INT AUTO_INCREMENT PRIMARY KEY,
  venue_name VARCHAR(120) NOT NULL,
  capacity INT NOT NULL CHECK (capacity > 0),
  facilities TEXT NULL,
  location VARCHAR(180) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_venues_name (venue_name)
) ENGINE=InnoDB;

CREATE TABLE events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(160) NOT NULL,
  description TEXT NULL,
  category ENUM('Tech Events','Business Competitions','Gaming Tournaments','General Events') NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NULL,
  end_time TIME NULL,
  max_participants INT NOT NULL CHECK (max_participants > 0),
  registered_participants INT NOT NULL DEFAULT 0,
  registration_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (registration_fee >= 0),
  prize_pool DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK (prize_pool >= 0),
  sponsorship_total DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK (sponsorship_total >= 0),
  total_prize_pool DECIMAL(12,2) AS (prize_pool + sponsorship_total) STORED,
  event_status ENUM('draft','open','full','ongoing','completed','cancelled') NOT NULL DEFAULT 'draft',
  assigned_judge_id INT NULL,
  organizer_id INT NOT NULL,
  venue_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_events_organizer FOREIGN KEY (organizer_id) REFERENCES users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_events_venue FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_events_assigned_judge FOREIGN KEY (assigned_judge_id) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_events_category (category),
  INDEX idx_events_status (event_status),
  INDEX idx_events_date (event_date),
  INDEX idx_events_organizer (organizer_id),
  INDEX idx_events_registered_participants (registered_participants),
  INDEX idx_events_assigned_judge (assigned_judge_id),
  INDEX idx_events_venue_date (venue_id, event_date)
) ENGINE=InnoDB;

CREATE TABLE event_rounds (
  round_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  round_type ENUM('Prelims','Semi-Finals','Finals','Custom') NOT NULL DEFAULT 'Custom',
  round_date DATETIME NOT NULL,
  start_time TIME NULL,
  end_time TIME NULL,
  venue_id INT NULL,
  status ENUM('scheduled','ongoing','completed') NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_event_rounds_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_event_rounds_venue FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_event_rounds_event_id (event_id),
  INDEX idx_event_rounds_venue_id (venue_id),
  INDEX idx_event_rounds_round_date (round_date)
) ENGINE=InnoDB;

CREATE TABLE judge_assignments (
  assignment_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  judge_id INT NOT NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  assigned_by INT NULL,
  CONSTRAINT uq_judge_assignment UNIQUE (event_id, judge_id),
  CONSTRAINT fk_judge_assignments_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_judge_assignments_judge FOREIGN KEY (judge_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_judge_assignments_assigned_by FOREIGN KEY (assigned_by) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_judge_assignments_judge_id (judge_id),
  INDEX idx_judge_assignments_event_id (event_id)
) ENGINE=InnoDB;

CREATE TABLE participants (
  participant_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  participant_type ENUM('individual','team') NOT NULL DEFAULT 'individual',
  roll_number VARCHAR(60) NULL,
  registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_participant_user_event UNIQUE (user_id, event_id),
  CONSTRAINT fk_participants_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_participants_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_participants_user_id (user_id),
  INDEX idx_participants_event_id (event_id)
) ENGINE=InnoDB;

CREATE TABLE judges (
  judge_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  contact VARCHAR(80),
  assigned_events_count INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE judging (
  judging_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  judge_id INT NOT NULL,
  participant_id INT NOT NULL,
  score DECIMAL(4,2) NOT NULL CHECK (score BETWEEN 0 AND 10),
  comments TEXT,
  judged_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_judging_once UNIQUE (event_id, judge_id, participant_id),
  CONSTRAINT fk_judging_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_judging_judge FOREIGN KEY (judge_id) REFERENCES judges(judge_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_judging_participant FOREIGN KEY (participant_id) REFERENCES participants(participant_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_judging_event_id (event_id)
) ENGINE=InnoDB;

CREATE TABLE event_judges (
  event_judge_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  judge_id INT NOT NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_event_judges_event_judge UNIQUE (event_id, judge_id),
  CONSTRAINT fk_event_judges_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_event_judges_judge FOREIGN KEY (judge_id) REFERENCES judges(judge_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE teams (
  team_id INT AUTO_INCREMENT PRIMARY KEY,
  team_name VARCHAR(120) NOT NULL,
  event_id INT NOT NULL,
  created_by INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_teams_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_teams_created_by FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_teams_event_id (event_id)
) ENGINE=InnoDB;

CREATE TABLE team_members (
  team_id INT NOT NULL,
  user_id INT NOT NULL,
  role VARCHAR(60) NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (team_id, user_id),
  CONSTRAINT fk_team_members_team FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_team_members_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE registrations (
  registration_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  user_id INT NULL,
  participant_id INT NULL,
  status ENUM('pending_payment','confirmed','cancelled') NOT NULL DEFAULT 'pending_payment',
  registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP NULL,
  seat_number VARCHAR(60) NULL,
  registration_reference VARCHAR(100) NULL UNIQUE,
  CONSTRAINT uq_registration_event_participant UNIQUE (event_id, participant_id),
  CONSTRAINT fk_registrations_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_registrations_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_registrations_participant FOREIGN KEY (participant_id) REFERENCES participants(participant_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_registrations_user_id (user_id),
  INDEX idx_registrations_event_id (event_id),
  INDEX idx_registrations_event (event_id),
  INDEX idx_registrations_participant_id (participant_id),
  INDEX idx_registrations_status (status)
) ENGINE=InnoDB;

CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  registration_id INT NULL,
  sponsor_id INT NULL,
  user_id INT NOT NULL,
  event_id INT NULL,
  amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
  payment_type ENUM('registration','accommodation','sponsorship','refund') NOT NULL,
  status ENUM('pending','completed','failed') NOT NULL DEFAULT 'pending',
  payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  provider_reference VARCHAR(160) NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_registration FOREIGN KEY (registration_id) REFERENCES registrations(registration_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_payments_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_payments_user (user_id),
  INDEX idx_payments_event (event_id),
  INDEX idx_payments_payment_date (payment_date),
  INDEX idx_payments_sponsor_id (sponsor_id),
  INDEX idx_payments_user_status (user_id, status),
  INDEX idx_payments_event_status (event_id, status)
) ENGINE=InnoDB;

CREATE TABLE sponsors (
  sponsor_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  company_name VARCHAR(160) NOT NULL,
  contact_person VARCHAR(120) NULL,
  email VARCHAR(160) NOT NULL,
  phone VARCHAR(80) NULL,
  sponsorship_level ENUM('Title','Gold','Silver','Bronze','Partner') NOT NULL DEFAULT 'Gold',
  amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  tier ENUM('Title','Gold','Silver','Partner') NOT NULL DEFAULT 'Gold',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_sponsors_email UNIQUE (email),
  CONSTRAINT fk_sponsors_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_sponsors_sponsorship_level (sponsorship_level),
  INDEX idx_sponsors_tier (tier)
) ENGINE=InnoDB;

ALTER TABLE payments
  ADD CONSTRAINT fk_payments_sponsor FOREIGN KEY (sponsor_id) REFERENCES sponsors(sponsor_id) ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE sponsorships (
  sponsorship_id INT AUTO_INCREMENT PRIMARY KEY,
  sponsor_id INT NOT NULL,
  user_id INT NULL,
  event_id INT NOT NULL,
  sponsorship_type ENUM('Title','Gold','Silver','Bronze','Partner') NOT NULL DEFAULT 'Gold',
  amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
  tier ENUM('Title','Gold','Silver','Partner') NOT NULL DEFAULT 'Gold',
  status ENUM('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  sponsored_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sponsorships_sponsor FOREIGN KEY (sponsor_id) REFERENCES sponsors(sponsor_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_sponsorships_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_sponsorships_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_sponsorships_event_id (event_id),
  INDEX idx_sponsorships_sponsor_id (sponsor_id),
  INDEX idx_sponsorships_user_id (user_id),
  INDEX idx_sponsorships_created_at (created_at),
  INDEX idx_sponsorships_status (status)
) ENGINE=InnoDB;

CREATE TABLE accommodations (
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

CREATE TABLE user_accommodations (
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

CREATE TABLE scores (
  score_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  judge_id INT NOT NULL,
  participant_id INT NOT NULL,
  score DECIMAL(4,2) NOT NULL CHECK (score >= 0 AND score <= 10),
  comments TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_scores_unique UNIQUE (event_id, judge_id, participant_id),
  CONSTRAINT fk_scores_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_scores_judge FOREIGN KEY (judge_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_scores_participant FOREIGN KEY (participant_id) REFERENCES participants(participant_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_scores_event_judge (event_id, judge_id),
  INDEX idx_scores_participant (participant_id)
) ENGINE=InnoDB;

CREATE TABLE event_passes (
  pass_id INT AUTO_INCREMENT PRIMARY KEY,
  registration_id INT NOT NULL,
  token VARCHAR(128) NOT NULL UNIQUE,
  qr_code VARCHAR(255) NULL,
  issued_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  status ENUM('active','used','revoked') NOT NULL DEFAULT 'active',
  CONSTRAINT fk_event_passes_registration FOREIGN KEY (registration_id) REFERENCES registrations(registration_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_event_passes_status (status)
) ENGINE=InnoDB;

CREATE TABLE notifications (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NULL,
  type ENUM('registration','payment','assignment','status','sponsorship','system') NOT NULL,
  title VARCHAR(160) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_notifications_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_notifications_user (user_id),
  INDEX idx_notifications_event (event_id),
  INDEX idx_notifications_type (type)
) ENGINE=InnoDB;

CREATE TABLE passes (
  pass_id VARCHAR(36) PRIMARY KEY,
  participant_id INT NOT NULL,
  event_id INT NOT NULL,
  issued_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('issued','redeemed','cancelled') NOT NULL DEFAULT 'issued',
  qr_code VARCHAR(255) NULL,
  CONSTRAINT uq_passes_participant_event UNIQUE (participant_id, event_id),
  CONSTRAINT fk_passes_participant FOREIGN KEY (participant_id) REFERENCES participants(participant_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_passes_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_passes_event_id (event_id)
) ENGINE=InnoDB;

CREATE OR REPLACE VIEW venue_utilization_stats AS
SELECT
  v.venue_id,
  v.venue_name,
  COUNT(e.event_id) AS events_hosted,
  COALESCE(SUM(e.max_participants), 0) AS total_capacity_available
FROM venues v
LEFT JOIN events e ON e.venue_id = v.venue_id
GROUP BY v.venue_id, v.venue_name;

CREATE OR REPLACE VIEW event_statistics AS
SELECT
  e.event_id,
  e.event_name,
  COUNT(DISTINCT p.participant_id) AS registered_count,
  ROUND(AVG(j.score), 2) AS avg_score,
  COUNT(DISTINCT ej.judge_id) AS judges_count
FROM events e
LEFT JOIN participants p ON p.event_id = e.event_id
LEFT JOIN judging j ON j.event_id = e.event_id
LEFT JOIN event_judges ej ON ej.event_id = e.event_id
GROUP BY e.event_id, e.event_name;

CREATE OR REPLACE VIEW sponsor_summary AS
SELECT
  s.sponsor_id,
  s.company_name,
  s.tier,
  COALESCE(SUM(sp.amount), 0) AS total_amount,
  COUNT(DISTINCT sp.event_id) AS events_sponsored
FROM sponsors s
LEFT JOIN sponsorships sp ON sp.sponsor_id = s.sponsor_id
GROUP BY s.sponsor_id, s.company_name, s.tier;

CREATE OR REPLACE VIEW participant_logistics AS
SELECT
  u.user_id,
  u.name,
  COUNT(DISTINCT p.event_id) AS events_count,
  COALESCE(SUM(CASE WHEN pay.status = 'completed' THEN pay.amount ELSE 0 END), 0) AS total_paid,
  FALSE AS has_accommodation
FROM users u
LEFT JOIN participants p ON p.user_id = u.user_id
LEFT JOIN payments pay ON pay.user_id = u.user_id
WHERE u.role = 'participant'
GROUP BY u.user_id, u.name;

CREATE OR REPLACE VIEW revenue_breakdown AS
SELECT
  payment_type,
  COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) AS total_completed,
  COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) AS total_pending,
  COALESCE(SUM(CASE WHEN status = 'failed' THEN amount ELSE 0 END), 0) AS total_failed
FROM payments
GROUP BY payment_type;

CREATE OR REPLACE VIEW high_quality_events AS
SELECT
  e.event_id,
  e.event_name,
  ROUND(AVG(j.score), 2) AS avg_score
FROM events e
JOIN judging j ON j.event_id = e.event_id
GROUP BY e.event_id, e.event_name
HAVING AVG(j.score) > 7.5;

CREATE OR REPLACE VIEW upcoming_events AS
SELECT
  e.event_id,
  e.event_name,
  e.category,
  e.event_date,
  v.venue_name,
  COUNT(DISTINCT p.participant_id) AS registered_participants,
  e.max_participants,
  e.registration_fee
FROM events e
LEFT JOIN venues v ON v.venue_id = e.venue_id
LEFT JOIN participants p ON p.event_id = e.event_id
WHERE e.event_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
GROUP BY e.event_id, e.event_name, e.category, e.event_date, v.venue_name, e.max_participants, e.registration_fee;

CREATE OR REPLACE VIEW judge_workload AS
SELECT
  j.judge_id,
  j.name,
  j.assigned_events_count AS events_assigned,
  COUNT(DISTINCT jud.judging_id) AS scores_submitted
FROM judges j
LEFT JOIN judging jud ON jud.judge_id = j.judge_id
GROUP BY j.judge_id, j.name, j.assigned_events_count;

CREATE OR REPLACE VIEW vw_event_leaderboard AS
SELECT
  j.event_id,
  p.participant_id,
  u.name AS participant_name,
  ROUND(AVG(j.score), 2) AS average_score,
  COUNT(j.judging_id) AS score_count,
  ROW_NUMBER() OVER (PARTITION BY j.event_id ORDER BY AVG(j.score) DESC, COUNT(j.judging_id) DESC) AS rank
FROM judging j
JOIN participants p ON p.participant_id = j.participant_id
JOIN users u ON u.user_id = p.user_id
GROUP BY j.event_id, p.participant_id, u.name;

CREATE OR REPLACE VIEW vw_judge_workload AS
SELECT
  j.judge_id,
  j.name AS judge_name,
  j.assigned_events_count AS assigned_events,
  MAX(ej.assigned_at) AS last_assigned_at
FROM judges j
LEFT JOIN event_judges ej ON ej.judge_id = j.judge_id
GROUP BY j.judge_id, j.name, j.assigned_events_count;

CREATE OR REPLACE VIEW vw_sponsorship_totals AS
SELECT
  e.event_id,
  e.event_name,
  COALESCE(SUM(CASE WHEN s.status = 'confirmed' THEN s.amount ELSE 0 END), 0) AS confirmed_sponsorship_amount,
  COUNT(DISTINCT CASE WHEN s.status = 'confirmed' THEN s.sponsor_id END) AS sponsor_count
FROM events e
LEFT JOIN sponsorships s ON s.event_id = e.event_id
GROUP BY e.event_id, e.event_name;

DELIMITER //

DROP PROCEDURE IF EXISTS sp_get_leaderboard//
CREATE PROCEDURE sp_get_leaderboard(IN p_event_id INT)
BEGIN
  SELECT
    ranked.rank,
    ranked.participant_id,
    ranked.participant_name AS name,
    ranked.average_score AS score
  FROM (
    SELECT
      p.participant_id,
      u.name AS participant_name,
      ROUND(AVG(j.score), 2) AS average_score,
      ROW_NUMBER() OVER (ORDER BY AVG(j.score) DESC, COUNT(j.judging_id) DESC, p.participant_id ASC) AS rank
    FROM judging j
    JOIN participants p ON p.participant_id = j.participant_id
    JOIN users u ON u.user_id = p.user_id
    WHERE j.event_id = p_event_id
    GROUP BY p.participant_id, u.name
  ) AS ranked
  ORDER BY ranked.rank;
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

