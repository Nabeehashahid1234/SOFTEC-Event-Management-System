-- Migration: ensure assigned_events_count on judges and prize_pool on events
ALTER TABLE judges ADD COLUMN IF NOT EXISTS assigned_events_count INT NOT NULL DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS prize_pool DECIMAL(12,2) NOT NULL DEFAULT 0.00;

-- Down (manual): ALTER TABLE judges DROP COLUMN assigned_events_count; ALTER TABLE events DROP COLUMN prize_pool;
