-- Drop database softec_db;
CREATE DATABASE IF NOT EXISTS softec_db;
USE softec_db;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS reminders;
DROP TABLE IF EXISTS user_accommodations;
DROP TABLE IF EXISTS accommodations;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS sponsorships;
DROP TABLE IF EXISTS sponsors;
DROP TABLE IF EXISTS event_rounds;
DROP TABLE IF EXISTS team_members;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS event_judges;
DROP TABLE IF EXISTS judging;
DROP TABLE IF EXISTS judges;
DROP TABLE IF EXISTS participants;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS venues;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','participant','organizer','judge','sponsor') NOT NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_payment_date DATE NULL,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB;

CREATE TABLE venues (
  venue_id INT AUTO_INCREMENT PRIMARY KEY,
  venue_name VARCHAR(120) NOT NULL,
  capacity INT NOT NULL CHECK (capacity > 0),
  facilities TEXT,
  location VARCHAR(180) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(160) NOT NULL,
  description TEXT,
  category ENUM('Tech Events','Business Competitions','Gaming Tournaments','General Events') NOT NULL,
  event_date DATE NOT NULL,
  max_participants INT NOT NULL CHECK (max_participants > 0),
  registered_participants INT NOT NULL DEFAULT 0 CHECK (registered_participants >= 0),
  venue_id INT NULL,
  organizer_id INT NULL,
  registration_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (registration_fee >= 0),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_events_venue_date UNIQUE (venue_id, event_date),
  CONSTRAINT fk_events_venue FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_events_organizer FOREIGN KEY (organizer_id) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_events_category (category),
  INDEX idx_events_event_date (event_date)
) ENGINE=InnoDB;

CREATE TABLE participants (
  participant_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_participants_user_event UNIQUE (user_id, event_id),
  CONSTRAINT fk_participants_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_participants_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_participants_user_id (user_id),
  INDEX idx_participants_event_id (event_id)
) ENGINE=InnoDB;

CREATE TABLE judges (
  judge_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  contact VARCHAR(80)
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
  CONSTRAINT fk_teams_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE team_members (
  team_id INT NOT NULL,
  user_id INT NOT NULL,
  role VARCHAR(60) NOT NULL DEFAULT 'member',
  PRIMARY KEY (team_id, user_id),
  CONSTRAINT fk_team_members_team FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_team_members_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE event_rounds (
  round_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  round_type ENUM('Prelims','Semi-Finals','Finals') NOT NULL,
  round_date DATETIME NOT NULL,
  venue_id INT NULL,
  status ENUM('scheduled','in_progress','completed') NOT NULL DEFAULT 'scheduled',
  CONSTRAINT fk_event_rounds_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_event_rounds_venue FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE sponsors (
  sponsor_id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(160) NOT NULL,
  contact_person VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  phone VARCHAR(50),
  sponsorship_level ENUM('Gold','Silver','Bronze') NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  user_id INT NULL,
  CONSTRAINT uq_sponsors_email UNIQUE (email),
  CONSTRAINT fk_sponsors_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE sponsorships (
  sponsorship_id INT AUTO_INCREMENT PRIMARY KEY,
  sponsor_id INT NOT NULL,
  user_id INT NULL,
  event_id INT NULL,
  sponsorship_type ENUM('Gold','Silver','Title') NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  status ENUM('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  CONSTRAINT fk_sponsorships_sponsor FOREIGN KEY (sponsor_id) REFERENCES sponsors(sponsor_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_sponsorships_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_sponsorships_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  payment_type ENUM('registration','accommodation','sponsorship') NOT NULL,
  status ENUM('pending','completed','failed') NOT NULL DEFAULT 'pending',
  payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_payments_user_event_type UNIQUE (user_id, event_id, payment_type),
  CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_payments_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_payments_user_status (user_id, status)
) ENGINE=InnoDB;

CREATE TABLE accommodations (
  accommodation_id INT AUTO_INCREMENT PRIMARY KEY,
  room_type ENUM('Single','Double','Triple','Quad') NOT NULL,
  capacity INT NOT NULL CHECK (capacity > 0),
  price_per_night DECIMAL(10,2) NOT NULL CHECK (price_per_night >= 0),
  available_rooms INT NOT NULL DEFAULT 0 CHECK (available_rooms >= 0)
) ENGINE=InnoDB;

CREATE TABLE user_accommodations (
  user_id INT NOT NULL,
  accommodation_id INT NOT NULL,
  booked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  PRIMARY KEY (user_id, accommodation_id, booked_at),
  CONSTRAINT chk_user_accommodations_dates CHECK (check_out > check_in),
  CONSTRAINT fk_user_accommodations_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_user_accommodations_accommodation FOREIGN KEY (accommodation_id) REFERENCES accommodations(accommodation_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE reminders (
  reminder_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  reminder_date DATE NOT NULL,
  message TEXT NOT NULL,
  sent BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT uq_reminders_user_event_date UNIQUE (user_id, event_id, reminder_date),
  CONSTRAINT fk_reminders_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_reminders_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE role_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role VARCHAR(40) NOT NULL UNIQUE,
  permissions JSON NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  audit_metadata JSON NULL
) ENGINE=InnoDB;


select * from users;
