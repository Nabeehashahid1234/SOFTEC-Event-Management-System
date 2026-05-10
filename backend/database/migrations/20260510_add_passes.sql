-- Migration: Add passes table for generated tickets/passes
-- Up: create passes table
CREATE TABLE IF NOT EXISTS passes (
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

-- Down: drop passes table
-- DROP TABLE IF EXISTS passes;
