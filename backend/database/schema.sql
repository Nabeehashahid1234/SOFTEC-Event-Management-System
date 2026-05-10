-- Drop database softec_db;
CREATE DATABASE IF NOT EXISTS softec_db;
USE softec_db;

SET FOREIGN_KEY_CHECKS = 0;
DROP VIEW IF EXISTS vw_sponsorship_totals;
DROP VIEW IF EXISTS vw_judge_workload;
DROP VIEW IF EXISTS vw_event_leaderboard;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS event_passes;
DROP TABLE IF EXISTS scores;
DROP TABLE IF EXISTS sponsorships;
DROP TABLE IF EXISTS sponsors;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS participants;
DROP TABLE IF EXISTS judge_assignments;
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
  registration_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (registration_fee >= 0),
  prize_pool DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK (prize_pool >= 0),
<<<<<<< HEAD
  sponsorship_total DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK (sponsorship_total >= 0),
  total_prize_pool DECIMAL(12,2) AS (prize_pool + sponsorship_total) STORED,
  event_status ENUM('draft','open','full','ongoing','completed','cancelled') NOT NULL DEFAULT 'draft',
  assigned_judge_id INT NULL,
  organizer_id INT NOT NULL,
  venue_id INT NULL,
=======
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_events_organizer FOREIGN KEY (organizer_id) REFERENCES users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_events_venue FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_events_assigned_judge FOREIGN KEY (assigned_judge_id) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_events_category (category),
  INDEX idx_events_status (event_status),
  INDEX idx_events_date (event_date),
  INDEX idx_events_assigned_judge (assigned_judge_id),
  INDEX idx_events_venue_date (venue_id, event_date)
) ENGINE=InnoDB;

CREATE TABLE event_rounds (
  round_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  round_type ENUM('Prelims','Semi-Finals','Finals','Custom') NOT NULL DEFAULT 'Custom',
  round_date DATETIME NOT NULL,
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
  participant_type ENUM('individual','team') NOT NULL DEFAULT 'individual',
  roll_number VARCHAR(60) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_participant_user UNIQUE (user_id),
  CONSTRAINT fk_participants_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
<<<<<<< HEAD
  INDEX idx_participants_user_id (user_id)
=======
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
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
) ENGINE=InnoDB;

CREATE TABLE teams (
  team_id INT AUTO_INCREMENT PRIMARY KEY,
  team_name VARCHAR(120) NOT NULL,
  event_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_teams_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
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
  participant_id INT NOT NULL,
  status ENUM('pending_payment','confirmed','cancelled') NOT NULL DEFAULT 'pending_payment',
  registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP NULL,
  seat_number VARCHAR(60) NULL,
  registration_reference VARCHAR(100) NOT NULL UNIQUE,
  CONSTRAINT uq_registration_event_participant UNIQUE (event_id, participant_id),
  CONSTRAINT fk_registrations_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_registrations_participant FOREIGN KEY (participant_id) REFERENCES participants(participant_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_registrations_event_id (event_id),
  INDEX idx_registrations_participant_id (participant_id),
  INDEX idx_registrations_status (status)
) ENGINE=InnoDB;

CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  registration_id INT NOT NULL,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
  payment_type ENUM('registration','sponsorship','refund') NOT NULL,
  status ENUM('pending','completed','failed') NOT NULL DEFAULT 'pending',
  provider_reference VARCHAR(160) NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_registration FOREIGN KEY (registration_id) REFERENCES registrations(registration_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_payments_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_payments_user_status (user_id, status),
  INDEX idx_payments_event_status (event_id, status)
) ENGINE=InnoDB;

CREATE TABLE sponsors (
  sponsor_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  company_name VARCHAR(160) NOT NULL,
  contact_person VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  phone VARCHAR(80) NULL,
  tier ENUM('Title','Gold','Silver','Partner') NOT NULL DEFAULT 'Gold',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_sponsors_email UNIQUE (email),
  CONSTRAINT fk_sponsors_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_sponsors_tier (tier)
) ENGINE=InnoDB;

CREATE TABLE sponsorships (
  sponsorship_id INT AUTO_INCREMENT PRIMARY KEY,
  sponsor_id INT NOT NULL,
  event_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
  tier ENUM('Title','Gold','Silver','Partner') NOT NULL DEFAULT 'Gold',
  status ENUM('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  sponsored_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sponsorships_sponsor FOREIGN KEY (sponsor_id) REFERENCES sponsors(sponsor_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_sponsorships_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_sponsorships_event_id (event_id),
  INDEX idx_sponsorships_sponsor_id (sponsor_id),
  INDEX idx_sponsorships_status (status)
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

CREATE VIEW vw_event_leaderboard AS
SELECT
  s.event_id,
  p.participant_id,
  u.name AS participant_name,
  ROUND(AVG(s.score), 2) AS average_score,
  COUNT(s.score_id) AS score_count,
  ROW_NUMBER() OVER (PARTITION BY s.event_id ORDER BY AVG(s.score) DESC, COUNT(s.score_id) DESC) AS rank
FROM scores s
JOIN participants p ON p.participant_id = s.participant_id
JOIN users u ON u.user_id = p.user_id
GROUP BY s.event_id, p.participant_id, u.name;

CREATE VIEW vw_judge_workload AS
SELECT
  u.user_id AS judge_id,
  u.name AS judge_name,
  COUNT(a.assignment_id) AS assigned_events,
  MAX(a.assigned_at) AS last_assigned_at
FROM judge_assignments a
JOIN users u ON u.user_id = a.judge_id
WHERE u.role = 'judge'
GROUP BY u.user_id, u.name;

<<<<<<< HEAD
CREATE VIEW vw_sponsorship_totals AS
SELECT
  e.event_id,
  e.event_name,
  COALESCE(SUM(s.amount), 0) AS confirmed_sponsorship_amount,
  COUNT(DISTINCT s.sponsor_id) AS sponsor_count
FROM events e
LEFT JOIN sponsorships s ON s.event_id = e.event_id AND s.status = 'confirmed'
GROUP BY e.event_id, e.event_name;
=======
CREATE TABLE passes (
  pass_id VARCHAR(36) PRIMARY KEY,
  participant_id INT NOT NULL,
  event_id INT NOT NULL,
  issued_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('issued','redeemed','cancelled') NOT NULL DEFAULT 'issued',
  qr_code VARCHAR(255) NULL,
  CONSTRAINT fk_passes_participant FOREIGN KEY (participant_id) REFERENCES participants(participant_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_passes_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_passes_event_id (event_id)
) ENGINE=InnoDB;


select * from users;
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
