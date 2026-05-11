-- ═══════════════════════════════════════════════════════════════════
-- SOFTEC '26 — Full Database Schema
-- Run this file in MySQL Workbench to create/recreate the database.
-- Includes: tables, views, stored procedures, triggers
--
-- ─── HOW TO USE ───────────────────────────────────────────────────
-- FRESH SETUP (recommended):
--   1. Run schema.sql  → drops and recreates all tables
--   2. Run seed.sql    → populates with demo data
--
-- LIVE DATABASE SYNC (add missing columns without losing data):
--   Run only the ALTER TABLE block at the BOTTOM of this file.
--   Requires MySQL 8.0.30+ for ADD COLUMN IF NOT EXISTS support.
-- ═══════════════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS softec_db;
USE softec_db;

SET FOREIGN_KEY_CHECKS = 0;

-- ─── Drop all objects in dependency order ──────────────────────────
DROP TRIGGER  IF EXISTS prevent_venue_conflict;
DROP TRIGGER  IF EXISTS prevent_venue_conflict_update;
DROP TRIGGER  IF EXISTS auto_issue_pass_on_payment;
DROP TRIGGER  IF EXISTS sync_sponsorship_total_on_update;

DROP PROCEDURE IF EXISTS sp_get_leaderboard;
DROP PROCEDURE IF EXISTS sp_assign_unassigned_events;
DROP PROCEDURE IF EXISTS sp_auto_assign_judge;
DROP PROCEDURE IF EXISTS sp_refresh_sponsorship_total;

DROP VIEW IF EXISTS vw_pending_sponsorships;
DROP VIEW IF EXISTS vw_sponsorship_totals;
DROP VIEW IF EXISTS vw_judge_workload;
DROP VIEW IF EXISTS vw_event_leaderboard;
DROP VIEW IF EXISTS judge_workload;
DROP VIEW IF EXISTS upcoming_events;
DROP VIEW IF EXISTS high_quality_events;
DROP VIEW IF EXISTS revenue_breakdown;
DROP VIEW IF EXISTS participant_logistics;
DROP VIEW IF EXISTS sponsor_summary;
DROP VIEW IF EXISTS event_statistics;
DROP VIEW IF EXISTS venue_utilization_stats;

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS passes;
DROP TABLE IF EXISTS judging;
DROP TABLE IF EXISTS event_judges;
DROP TABLE IF EXISTS sponsorships;
DROP TABLE IF EXISTS sponsors;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS team_members;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS participants;
DROP TABLE IF EXISTS judge_assignments;
DROP TABLE IF EXISTS judges;
DROP TABLE IF EXISTS user_accommodations;
DROP TABLE IF EXISTS accommodations;
DROP TABLE IF EXISTS event_rounds;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS venues;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ═══════════════════════════════════════════════════════════════════
-- TABLES
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE users (
  user_id       INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120)  NOT NULL,
  email         VARCHAR(160)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role          ENUM('admin','organizer','judge','sponsor','participant') NOT NULL,
  status        ENUM('active','inactive','suspended') NOT NULL DEFAULT 'active',
  phone         VARCHAR(50)   NULL,
  organization  VARCHAR(160)  NULL,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email  (email),
  INDEX idx_users_role   (role),
  INDEX idx_users_status (status)
) ENGINE=InnoDB;

CREATE TABLE venues (
  venue_id    INT AUTO_INCREMENT PRIMARY KEY,
  venue_name  VARCHAR(120) NOT NULL,
  capacity    INT          NOT NULL CHECK (capacity > 0),
  facilities  TEXT         NULL,
  location    VARCHAR(180) NOT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_venues_name (venue_name)
) ENGINE=InnoDB;

CREATE TABLE events (
  event_id               INT AUTO_INCREMENT PRIMARY KEY,
  event_name             VARCHAR(160) NOT NULL,
  description            TEXT         NULL,
  category               ENUM('Tech Events','Business Competitions','Gaming Tournaments','General Events') NOT NULL,
  event_date             DATE         NOT NULL,
  start_time             TIME         NULL,
  end_time               TIME         NULL,
  max_participants       INT          NOT NULL CHECK (max_participants > 0),
  registered_participants INT          NOT NULL DEFAULT 0,
  registration_fee       DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (registration_fee >= 0),
  prize_pool             DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK (prize_pool >= 0),
  sponsorship_total      DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK (sponsorship_total >= 0),
  total_prize_pool       DECIMAL(12,2) AS (prize_pool + sponsorship_total) STORED,
  event_status           ENUM('draft','open','full','ongoing','completed','cancelled') NOT NULL DEFAULT 'draft',
  organizer_id           INT          NOT NULL,
  venue_id               INT          NULL,
  created_at             TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_events_organizer FOREIGN KEY (organizer_id) REFERENCES users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_events_venue     FOREIGN KEY (venue_id)     REFERENCES venues(venue_id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_events_category    (category),
  INDEX idx_events_status      (event_status),
  INDEX idx_events_date        (event_date),
  INDEX idx_events_organizer   (organizer_id),
  INDEX idx_events_venue_date  (venue_id, event_date)
) ENGINE=InnoDB;

CREATE TABLE event_rounds (
  round_id    INT AUTO_INCREMENT PRIMARY KEY,
  event_id    INT  NOT NULL,
  round_type  ENUM('Prelims','Semi-Finals','Finals','Custom') NOT NULL DEFAULT 'Custom',
  round_date  DATETIME NOT NULL,
  start_time  TIME     NULL,
  end_time    TIME     NULL,
  venue_id    INT      NULL,
  status      ENUM('scheduled','ongoing','completed') NOT NULL DEFAULT 'scheduled',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_event_rounds_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_event_rounds_venue FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_event_rounds_event_id  (event_id),
  INDEX idx_event_rounds_round_date (round_date)
) ENGINE=InnoDB;

CREATE TABLE participants (
  participant_id   INT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT NOT NULL,
  event_id         INT NOT NULL,
  participant_type ENUM('individual','team') NOT NULL DEFAULT 'individual',
  roll_number      VARCHAR(60) NULL,
  registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_participant_user_event UNIQUE (user_id, event_id),
  CONSTRAINT fk_participants_user  FOREIGN KEY (user_id)  REFERENCES users(user_id)   ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_participants_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_participants_user_id  (user_id),
  INDEX idx_participants_event_id (event_id)
) ENGINE=InnoDB;

CREATE TABLE judges (
  judge_id             INT AUTO_INCREMENT PRIMARY KEY,
  name                 VARCHAR(120) NOT NULL,
  email                VARCHAR(160) NOT NULL UNIQUE,
  contact              VARCHAR(80)  NULL,
  assigned_events_count INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE judge_assignments (
  assignment_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id      INT NOT NULL,
  judge_id      INT NOT NULL,
  assigned_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  active        BOOLEAN   NOT NULL DEFAULT TRUE,
  assigned_by   INT       NULL,
  CONSTRAINT uq_judge_assignment UNIQUE (event_id, judge_id),
  CONSTRAINT fk_judge_assignments_event       FOREIGN KEY (event_id)    REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_judge_assignments_judge       FOREIGN KEY (judge_id)    REFERENCES users(user_id)   ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_judge_assignments_assigned_by FOREIGN KEY (assigned_by) REFERENCES users(user_id)   ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_judge_assignments_judge_id (judge_id),
  INDEX idx_judge_assignments_event_id (event_id)
) ENGINE=InnoDB;

CREATE TABLE event_judges (
  event_judge_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id       INT NOT NULL,
  judge_id       INT NOT NULL,
  assigned_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_event_judges_event_judge UNIQUE (event_id, judge_id),
  CONSTRAINT fk_event_judges_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_event_judges_judge FOREIGN KEY (judge_id) REFERENCES judges(judge_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE judging (
  judging_id     INT AUTO_INCREMENT PRIMARY KEY,
  event_id       INT          NOT NULL,
  judge_id       INT          NOT NULL,
  participant_id INT          NOT NULL,
  score          DECIMAL(4,2) NOT NULL CHECK (score BETWEEN 0 AND 10),
  comments       TEXT         NULL,
  judged_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_judging_once     UNIQUE (event_id, judge_id, participant_id),
  CONSTRAINT fk_judging_event       FOREIGN KEY (event_id)       REFERENCES events(event_id)           ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_judging_judge       FOREIGN KEY (judge_id)       REFERENCES judges(judge_id)           ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_judging_participant FOREIGN KEY (participant_id) REFERENCES participants(participant_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_judging_event_id (event_id)
) ENGINE=InnoDB;

CREATE TABLE teams (
  team_id    INT AUTO_INCREMENT PRIMARY KEY,
  team_name  VARCHAR(120) NOT NULL,
  event_id   INT          NOT NULL,
  created_by INT          NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_teams_event      FOREIGN KEY (event_id)   REFERENCES events(event_id) ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT fk_teams_created_by FOREIGN KEY (created_by) REFERENCES users(user_id)  ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_teams_event_id (event_id)
) ENGINE=InnoDB;

CREATE TABLE team_members (
  team_id   INT       NOT NULL,
  user_id   INT       NOT NULL,
  role      VARCHAR(60) NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (team_id, user_id),
  CONSTRAINT fk_team_members_team FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_team_members_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- payments before sponsors so sponsors FK can reference it later
CREATE TABLE payments (
  payment_id   INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT           NOT NULL,
  event_id     INT           NULL,
  sponsor_id   INT           NULL,
  amount       DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  payment_type ENUM('registration','accommodation','sponsorship') NOT NULL,
  status       ENUM('pending','completed','failed') NOT NULL DEFAULT 'pending',
  payment_date TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_user  FOREIGN KEY (user_id)  REFERENCES users(user_id)   ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT fk_payments_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_payments_user_id   (user_id),
  INDEX idx_payments_event_id  (event_id),
  INDEX idx_payments_status    (status),
  INDEX idx_payments_type      (payment_type)
) ENGINE=InnoDB;

CREATE TABLE sponsors (
  sponsor_id        INT AUTO_INCREMENT PRIMARY KEY,
  user_id           INT           NULL,
  company_name      VARCHAR(160)  NOT NULL,
  contact_person    VARCHAR(120)  NULL,
  email             VARCHAR(160)  NOT NULL,
  phone             VARCHAR(80)   NULL,
  sponsorship_level ENUM('Title','Gold','Silver','Bronze','Partner') NOT NULL DEFAULT 'Gold',
  amount            DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_sponsors_email    UNIQUE (email),
  CONSTRAINT fk_sponsors_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_sponsors_sponsorship_level (sponsorship_level)
) ENGINE=InnoDB;

-- now add the FK from payments → sponsors
ALTER TABLE payments
  ADD CONSTRAINT fk_payments_sponsor FOREIGN KEY (sponsor_id) REFERENCES sponsors(sponsor_id) ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE sponsorships (
  sponsorship_id   INT AUTO_INCREMENT PRIMARY KEY,
  sponsor_id       INT           NOT NULL,
  user_id          INT           NULL,
  event_id         INT           NOT NULL,
  sponsorship_type ENUM('Title','Gold','Silver','Bronze','Partner') NOT NULL DEFAULT 'Gold',
  amount           DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
  status           ENUM('pending','confirmed','rejected','cancelled') NOT NULL DEFAULT 'pending',
  approved_by      INT           NULL,
  approved_at      TIMESTAMP     NULL,
  rejection_reason VARCHAR(500)  NULL,
  admin_notes      TEXT          NULL,
  created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sponsorships_sponsor     FOREIGN KEY (sponsor_id)  REFERENCES sponsors(sponsor_id) ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT fk_sponsorships_user        FOREIGN KEY (user_id)     REFERENCES users(user_id)       ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_sponsorships_event       FOREIGN KEY (event_id)    REFERENCES events(event_id)     ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT fk_sponsorships_approved_by FOREIGN KEY (approved_by) REFERENCES users(user_id)       ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_sponsorships_event_id   (event_id),
  INDEX idx_sponsorships_sponsor_id (sponsor_id),
  INDEX idx_sponsorships_status     (status),
  INDEX idx_sponsorships_created_at (created_at)
) ENGINE=InnoDB;

CREATE TABLE accommodations (
  accommodation_id INT AUTO_INCREMENT PRIMARY KEY,
  venue_name       VARCHAR(160)  NULL,
  room_type        VARCHAR(100)  NOT NULL,
  capacity         INT           NOT NULL DEFAULT 1,
  price_per_night  DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  available_rooms  INT           NOT NULL DEFAULT 0,
  created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_accommodations_room_type (room_type)
) ENGINE=InnoDB;

CREATE TABLE user_accommodations (
  user_accommodation_id INT  AUTO_INCREMENT PRIMARY KEY,
  user_id               INT  NOT NULL,
  accommodation_id      INT  NOT NULL,
  booked_at             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  check_in              DATE      NOT NULL,
  check_out             DATE      NOT NULL,
  CONSTRAINT fk_user_accommodations_user          FOREIGN KEY (user_id)          REFERENCES users(user_id)                 ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_user_accommodations_accommodation FOREIGN KEY (accommodation_id) REFERENCES accommodations(accommodation_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_user_accommodations_user_id          (user_id),
  INDEX idx_user_accommodations_accommodation_id (accommodation_id)
) ENGINE=InnoDB;

CREATE TABLE passes (
  pass_id        VARCHAR(36)  PRIMARY KEY,
  participant_id INT          NOT NULL,
  event_id       INT          NOT NULL,
  issued_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status         ENUM('issued','redeemed','cancelled') NOT NULL DEFAULT 'issued',
  qr_code        VARCHAR(255) NULL,
  CONSTRAINT uq_passes_participant_event UNIQUE (participant_id, event_id),
  CONSTRAINT fk_passes_participant FOREIGN KEY (participant_id) REFERENCES participants(participant_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_passes_event       FOREIGN KEY (event_id)       REFERENCES events(event_id)            ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_passes_event_id (event_id)
) ENGINE=InnoDB;

CREATE TABLE notifications (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT          NOT NULL,
  event_id        INT          NULL,
  type            ENUM('registration','payment','assignment','status','sponsorship','system') NOT NULL,
  title           VARCHAR(160) NOT NULL,
  message         TEXT         NOT NULL,
  is_read         BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user  FOREIGN KEY (user_id)  REFERENCES users(user_id)   ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_notifications_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_notifications_user  (user_id),
  INDEX idx_notifications_event (event_id)
) ENGINE=InnoDB;

-- ═══════════════════════════════════════════════════════════════════
-- VIEWS
-- ═══════════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW venue_utilization_stats AS
SELECT
  v.venue_id,
  v.venue_name,
  COUNT(e.event_id)                        AS events_hosted,
  COALESCE(SUM(e.max_participants), 0)     AS total_capacity_available,
  COALESCE(SUM(e.registered_participants), 0) AS total_registered
FROM venues v
LEFT JOIN events e ON e.venue_id = v.venue_id
GROUP BY v.venue_id, v.venue_name;

CREATE OR REPLACE VIEW event_statistics AS
SELECT
  e.event_id,
  e.event_name,
  COUNT(DISTINCT p.participant_id)   AS registered_count,
  ROUND(AVG(j.score), 2)             AS avg_score,
  COUNT(DISTINCT ej.judge_id)        AS judges_count
FROM events e
LEFT JOIN participants p  ON p.event_id  = e.event_id
LEFT JOIN judging      j  ON j.event_id  = e.event_id
LEFT JOIN event_judges ej ON ej.event_id = e.event_id
GROUP BY e.event_id, e.event_name;

CREATE OR REPLACE VIEW sponsor_summary AS
SELECT
  s.sponsor_id,
  s.company_name,
  s.sponsorship_level                AS tier,
  COALESCE(SUM(sp.amount), 0)        AS total_amount,
  COUNT(DISTINCT CASE WHEN sp.status = 'confirmed' THEN sp.event_id END) AS events_sponsored
FROM sponsors s
LEFT JOIN sponsorships sp ON sp.sponsor_id = s.sponsor_id
GROUP BY s.sponsor_id, s.company_name, s.sponsorship_level;

CREATE OR REPLACE VIEW participant_logistics AS
SELECT
  u.user_id,
  u.name,
  COUNT(DISTINCT p.event_id)                                                 AS events_count,
  COALESCE(SUM(CASE WHEN pay.status = 'completed' THEN pay.amount ELSE 0 END), 0) AS total_paid,
  EXISTS (SELECT 1 FROM user_accommodations ua WHERE ua.user_id = u.user_id) AS has_accommodation
FROM users u
LEFT JOIN participants p   ON p.user_id  = u.user_id
LEFT JOIN payments     pay ON pay.user_id = u.user_id AND pay.payment_type = 'registration'
WHERE u.role = 'participant'
GROUP BY u.user_id, u.name;

CREATE OR REPLACE VIEW revenue_breakdown AS
SELECT
  payment_type,
  COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) AS total_completed,
  COALESCE(SUM(CASE WHEN status = 'pending'   THEN amount ELSE 0 END), 0) AS total_pending,
  COALESCE(SUM(CASE WHEN status = 'failed'    THEN amount ELSE 0 END), 0) AS total_failed
FROM payments
GROUP BY payment_type;

CREATE OR REPLACE VIEW high_quality_events AS
SELECT
  e.event_id,
  e.event_name,
  e.category,
  ROUND(AVG(j.score), 2)       AS avg_score,
  COUNT(DISTINCT j.judge_id)   AS judge_count
FROM events e
JOIN judging j ON j.event_id = e.event_id
GROUP BY e.event_id, e.event_name, e.category
HAVING AVG(j.score) > 7.5;

CREATE OR REPLACE VIEW upcoming_events AS
SELECT
  e.event_id,
  e.event_name,
  e.category,
  e.event_date,
  v.venue_name,
  e.registered_participants,
  e.max_participants,
  e.registration_fee
FROM events e
LEFT JOIN venues v ON v.venue_id = e.venue_id
WHERE e.event_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY);

CREATE OR REPLACE VIEW judge_workload AS
SELECT
  j.judge_id,
  j.name,
  j.assigned_events_count           AS events_assigned,
  COUNT(DISTINCT jud.judging_id)    AS scores_submitted
FROM judges j
LEFT JOIN judging jud ON jud.judge_id = j.judge_id
GROUP BY j.judge_id, j.name, j.assigned_events_count;

CREATE OR REPLACE VIEW vw_event_leaderboard AS
SELECT
  j.event_id,
  p.participant_id,
  u.name                       AS participant_name,
  ROUND(AVG(j.score), 2)       AS average_score,
  COUNT(j.judging_id)          AS score_count,
  ROW_NUMBER() OVER (
    PARTITION BY j.event_id
    ORDER BY AVG(j.score) DESC, COUNT(j.judging_id) DESC
  )                            AS rank
FROM judging j
JOIN participants p ON p.participant_id = j.participant_id
JOIN users       u ON u.user_id         = p.user_id
GROUP BY j.event_id, p.participant_id, u.name;

CREATE OR REPLACE VIEW vw_judge_workload AS
SELECT
  j.judge_id,
  j.name                  AS judge_name,
  j.assigned_events_count AS assigned_events,
  MAX(ej.assigned_at)     AS last_assigned_at
FROM judges j
LEFT JOIN event_judges ej ON ej.judge_id = j.judge_id
GROUP BY j.judge_id, j.name, j.assigned_events_count;

CREATE OR REPLACE VIEW vw_sponsorship_totals AS
SELECT
  e.event_id,
  e.event_name,
  COALESCE(SUM(CASE WHEN s.status = 'confirmed' THEN s.amount ELSE 0 END), 0) AS confirmed_sponsorship_amount,
  COUNT(DISTINCT CASE WHEN s.status = 'confirmed' THEN s.sponsor_id END)       AS sponsor_count,
  COUNT(DISTINCT CASE WHEN s.status = 'pending'   THEN s.sponsorship_id END)   AS pending_count
FROM events e
LEFT JOIN sponsorships s ON s.event_id = e.event_id
GROUP BY e.event_id, e.event_name;

CREATE OR REPLACE VIEW vw_pending_sponsorships AS
SELECT
  sp.sponsorship_id,
  sp.amount,
  sp.sponsorship_type,
  sp.status,
  sp.created_at,
  sp.approved_by,
  sp.approved_at,
  sp.rejection_reason,
  sp.admin_notes,
  e.event_id,
  e.event_name,
  e.event_date,
  s.sponsor_id,
  s.company_name,
  s.sponsorship_level,
  u.user_id  AS sponsor_user_id,
  u.name     AS sponsor_user_name,
  u.email    AS sponsor_email
FROM sponsorships sp
JOIN sponsors s ON s.sponsor_id = sp.sponsor_id
JOIN events   e ON e.event_id   = sp.event_id
LEFT JOIN users u ON u.user_id  = sp.user_id
WHERE sp.status = 'pending'
ORDER BY sp.created_at ASC;

-- ═══════════════════════════════════════════════════════════════════
-- STORED PROCEDURES
-- ═══════════════════════════════════════════════════════════════════

DELIMITER //

-- Leaderboard for a specific event
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

-- Assign least-busy judge to a single event (uses judges + event_judges tables)
DROP PROCEDURE IF EXISTS sp_auto_assign_judge//
CREATE PROCEDURE sp_auto_assign_judge(IN p_event_id INT)
BEGIN
  DECLARE candidate_judge_id INT DEFAULT NULL;

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

-- Assign least-busy judge to every event that has no judge yet
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

-- Recalculate sponsorship_total for one event from confirmed sponsorships
DROP PROCEDURE IF EXISTS sp_refresh_sponsorship_total//
CREATE PROCEDURE sp_refresh_sponsorship_total(IN p_event_id INT)
BEGIN
  UPDATE events e
  JOIN (
    SELECT COALESCE(SUM(s.amount), 0) AS total
    FROM   sponsorships s
    WHERE  s.event_id = p_event_id
      AND  s.status   = 'confirmed'
  ) totals ON 1 = 1
  SET e.sponsorship_total = totals.total,
      e.updated_at        = CURRENT_TIMESTAMP
  WHERE e.event_id = p_event_id;
END//

DELIMITER ;

-- ═══════════════════════════════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════════════════════════════

DELIMITER //

-- Block venue double-booking on INSERT
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

    IF EXISTS (
      SELECT 1 FROM events
      WHERE  venue_id   = NEW.venue_id
        AND  event_date = NEW.event_date
    ) THEN
      SET v_message = CONCAT('Venue already booked for this date by: ', v_name);
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_message;
    END IF;
  END IF;
END//

-- Block venue double-booking on UPDATE
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

    IF EXISTS (
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

-- Auto-issue pass when registration payment is confirmed
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
    WHERE  user_id  = NEW.user_id
      AND  event_id = NEW.event_id
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

-- Keep sponsorship_total in sync when a sponsorship status changes
DROP TRIGGER IF EXISTS sync_sponsorship_total_on_update//
CREATE TRIGGER sync_sponsorship_total_on_update
AFTER UPDATE ON sponsorships
FOR EACH ROW
BEGIN
  UPDATE events
  SET    sponsorship_total = (
           SELECT COALESCE(SUM(amount), 0)
           FROM   sponsorships
           WHERE  event_id = NEW.event_id
             AND  status   = 'confirmed'
         )
  WHERE  event_id = NEW.event_id;
END//

DELIMITER ;


-- ═══════════════════════════════════════════════════════════════════
-- LIVE DATABASE SYNC — Run this block ONLY if your live database is
-- missing the sponsorships columns listed below.  Safe to run on
-- MySQL 8.0.30+.  If your version is older, re-run the full
-- schema.sql + seed.sql instead (fresh setup above).
-- ═══════════════════════════════════════════════════════════════════
SET @db = DATABASE();

-- Add missing sponsorships columns (no-op if they already exist)
ALTER TABLE sponsorships
  ADD COLUMN IF NOT EXISTS approved_by      INT           NULL        AFTER status,
  ADD COLUMN IF NOT EXISTS approved_at      TIMESTAMP     NULL        AFTER approved_by,
  ADD COLUMN IF NOT EXISTS rejection_reason VARCHAR(500)  NULL        AFTER approved_at,
  ADD COLUMN IF NOT EXISTS admin_notes      TEXT          NULL        AFTER rejection_reason,
  ADD COLUMN IF NOT EXISTS created_at       TIMESTAMP     NOT NULL
                                            DEFAULT CURRENT_TIMESTAMP AFTER admin_notes;

-- Add FK on approved_by if it doesn't exist yet
SET @fk_exists = (
  SELECT COUNT(*)
  FROM   information_schema.TABLE_CONSTRAINTS
  WHERE  CONSTRAINT_SCHEMA = @db
    AND  TABLE_NAME         = 'sponsorships'
    AND  CONSTRAINT_NAME    = 'fk_sponsorships_approved_by'
    AND  CONSTRAINT_TYPE    = 'FOREIGN KEY'
);
SET @add_fk = IF(@fk_exists = 0,
  'ALTER TABLE sponsorships ADD CONSTRAINT fk_sponsorships_approved_by FOREIGN KEY (approved_by) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE',
  'SELECT 1 -- FK already exists'
);
PREPARE stmt FROM @add_fk;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ensure the sponsorship status ENUM does NOT include legacy 'approved'
-- (MySQL does not support removing ENUM values with IF-guards; run this
-- only once — it is already correct in a fresh schema.sql run.)
-- ALTER TABLE sponsorships MODIFY COLUMN status ENUM('pending','confirmed','rejected','cancelled') NOT NULL DEFAULT 'pending';
