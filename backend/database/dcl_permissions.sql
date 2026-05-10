USE softec_db;

CREATE ROLE IF NOT EXISTS 'softec_admin', 'softec_organizer', 'softec_judge', 'softec_participant', 'softec_sponsor';

GRANT ALL PRIVILEGES ON softec_db.* TO 'softec_admin';

GRANT SELECT, INSERT, UPDATE, DELETE ON softec_db.events TO 'softec_organizer';
GRANT SELECT, INSERT, UPDATE, DELETE ON softec_db.event_rounds TO 'softec_organizer';
GRANT SELECT, INSERT, UPDATE, DELETE ON softec_db.event_judges TO 'softec_organizer';
GRANT SELECT ON softec_db.participants TO 'softec_organizer';
GRANT SELECT ON softec_db.venues TO 'softec_organizer';
GRANT SELECT ON softec_db.event_statistics TO 'softec_organizer';

GRANT SELECT ON softec_db.events TO 'softec_judge';
GRANT SELECT ON softec_db.participants TO 'softec_judge';
GRANT SELECT, INSERT, UPDATE ON softec_db.judging TO 'softec_judge';
GRANT SELECT ON softec_db.event_judges TO 'softec_judge';
GRANT SELECT ON softec_db.judge_workload TO 'softec_judge';

GRANT SELECT ON softec_db.events TO 'softec_participant';
GRANT SELECT, INSERT, DELETE ON softec_db.participants TO 'softec_participant';
GRANT SELECT, INSERT ON softec_db.payments TO 'softec_participant';
GRANT SELECT, INSERT ON softec_db.teams TO 'softec_participant';
GRANT SELECT, INSERT, DELETE ON softec_db.team_members TO 'softec_participant';
GRANT SELECT ON softec_db.accommodations TO 'softec_participant';
GRANT SELECT, INSERT ON softec_db.user_accommodations TO 'softec_participant';

GRANT SELECT ON softec_db.events TO 'softec_sponsor';
GRANT SELECT, INSERT, UPDATE ON softec_db.sponsors TO 'softec_sponsor';
GRANT SELECT, INSERT ON softec_db.sponsorships TO 'softec_sponsor';
GRANT SELECT, INSERT ON softec_db.payments TO 'softec_sponsor';
GRANT SELECT ON softec_db.sponsor_summary TO 'softec_sponsor';

INSERT INTO role_permissions (role, permissions) VALUES
('admin', JSON_ARRAY('users:read','users:write','events:read','events:write','reports:read','payments:write','all')),
('organizer', JSON_ARRAY('events:read','events:write','rounds:write','judges:assign','participants:read','dashboard:organizer')),
('judge', JSON_ARRAY('events:read','judging:read','judging:write','leaderboards:read','dashboard:judge')),
('participant', JSON_ARRAY('events:read','participants:register','payments:create','teams:write','accommodations:book','dashboard:participant')),
('sponsor', JSON_ARRAY('events:read','sponsors:write','sponsorships:write','payments:create','dashboard:sponsor'))
ON DUPLICATE KEY UPDATE permissions = VALUES(permissions);

DELIMITER //

CREATE TRIGGER before_role_permissions_update
BEFORE UPDATE ON role_permissions
FOR EACH ROW
BEGIN
  SET NEW.audit_metadata = JSON_OBJECT(
    'old_permissions', OLD.permissions,
    'updated_at', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'),
    'source', 'dcl_permissions_trigger'
  );
END//

DELIMITER ;
