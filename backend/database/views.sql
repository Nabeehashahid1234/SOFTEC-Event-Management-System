USE softec_db;

CREATE OR REPLACE VIEW venue_utilization_stats AS
SELECT
  v.venue_id,
  v.venue_name,
  COUNT(e.event_id) AS events_hosted,
  COALESCE(SUM(e.registered_participants), 0) AS total_capacity_used
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
  s.sponsorship_level AS tier,
  COALESCE(SUM(sp.amount), 0) AS total_amount,
  COUNT(DISTINCT sp.event_id) AS events_sponsored
FROM sponsors s
LEFT JOIN sponsorships sp ON sp.sponsor_id = s.sponsor_id
GROUP BY s.sponsor_id, s.company_name, s.sponsorship_level;

CREATE OR REPLACE VIEW participant_logistics AS
SELECT
  u.user_id,
  u.name,
  COUNT(DISTINCT p.event_id) AS events_count,
  COALESCE(SUM(CASE WHEN pay.status = 'completed' THEN pay.amount ELSE 0 END), 0) AS total_paid,
  CASE WHEN COUNT(DISTINCT ua.accommodation_id) > 0 THEN TRUE ELSE FALSE END AS has_accommodation
FROM users u
LEFT JOIN participants p ON p.user_id = u.user_id
LEFT JOIN payments pay ON pay.user_id = u.user_id
LEFT JOIN user_accommodations ua ON ua.user_id = u.user_id
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
  e.registered_participants,
  e.max_participants,
  e.registration_fee
FROM events e
LEFT JOIN venues v ON v.venue_id = e.venue_id
WHERE e.event_date BETWEEN CURRENT_DATE() AND DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY);

CREATE OR REPLACE VIEW judge_workload AS
SELECT
  j.judge_id,
  j.name,
  COUNT(DISTINCT ej.event_id) AS events_assigned,
  COUNT(DISTINCT jud.judging_id) AS scores_submitted
FROM judges j
LEFT JOIN event_judges ej ON ej.judge_id = j.judge_id
LEFT JOIN judging jud ON jud.judge_id = j.judge_id
GROUP BY j.judge_id, j.name;
