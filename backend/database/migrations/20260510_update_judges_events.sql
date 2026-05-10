-- Migration: ensure assigned_events_count on judges and prize_pool on events.
-- Use information_schema guards for MySQL versions without ADD COLUMN IF NOT EXISTS.
SET @exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'judges' AND COLUMN_NAME = 'assigned_events_count');
SET @ddl := IF(@exists = 0, 'ALTER TABLE judges ADD COLUMN assigned_events_count INT NOT NULL DEFAULT 0', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'events' AND COLUMN_NAME = 'prize_pool');
SET @ddl := IF(@exists = 0, 'ALTER TABLE events ADD COLUMN prize_pool DECIMAL(12,2) NOT NULL DEFAULT 0.00', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Down (manual): ALTER TABLE judges DROP COLUMN assigned_events_count; ALTER TABLE events DROP COLUMN prize_pool;
