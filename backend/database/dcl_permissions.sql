USE softec_db;

-- Create roles
CREATE ROLE IF NOT EXISTS 'softec_admin';
CREATE ROLE IF NOT EXISTS 'softec_organizer';
CREATE ROLE IF NOT EXISTS 'softec_judge';
CREATE ROLE IF NOT EXISTS 'softec_participant';
CREATE ROLE IF NOT EXISTS 'softec_sponsor';

-- Grant admin privileges
GRANT ALL PRIVILEGES ON softec_db.* TO 'softec_admin';

-- Grant organizer privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON softec_db.events TO 'softec_organizer';
GRANT SELECT, INSERT, UPDATE, DELETE ON softec_db.event_rounds TO 'softec_organizer';
GRANT SELECT, INSERT, UPDATE, DELETE ON softec_db.event_judges TO 'softec_organizer';
GRANT SELECT, INSERT, UPDATE ON softec_db.judges TO 'softec_organizer';
GRANT SELECT ON softec_db.participants TO 'softec_organizer';
GRANT SELECT ON softec_db.venues TO 'softec_organizer';
GRANT SELECT ON softec_db.event_statistics TO 'softec_organizer';
GRANT SELECT ON softec_db.judge_workload TO 'softec_organizer';

-- Grant judge privileges
GRANT SELECT ON softec_db.events TO 'softec_judge';
GRANT SELECT ON softec_db.participants TO 'softec_judge';
GRANT SELECT, INSERT, UPDATE ON softec_db.judging TO 'softec_judge';
GRANT SELECT ON softec_db.event_judges TO 'softec_judge';
GRANT SELECT ON softec_db.judges TO 'softec_judge';
GRANT SELECT ON softec_db.vw_judge_workload TO 'softec_judge';
GRANT SELECT ON softec_db.vw_event_leaderboard TO 'softec_judge';

-- Grant participant privileges
GRANT SELECT ON softec_db.events TO 'softec_participant';
GRANT SELECT, INSERT, DELETE ON softec_db.participants TO 'softec_participant';
GRANT SELECT, INSERT ON softec_db.payments TO 'softec_participant';
GRANT SELECT, INSERT ON softec_db.teams TO 'softec_participant';
GRANT SELECT, INSERT, DELETE ON softec_db.team_members TO 'softec_participant';
GRANT SELECT ON softec_db.passes TO 'softec_participant';

-- Grant sponsor privileges
GRANT SELECT ON softec_db.events TO 'softec_sponsor';
GRANT SELECT, INSERT, UPDATE ON softec_db.sponsors TO 'softec_sponsor';
GRANT SELECT, INSERT ON softec_db.sponsorships TO 'softec_sponsor';
GRANT SELECT, INSERT ON softec_db.payments TO 'softec_sponsor';
GRANT SELECT ON softec_db.sponsor_summary TO 'softec_sponsor';
GRANT SELECT ON softec_db.vw_sponsorship_totals TO 'softec_sponsor';
