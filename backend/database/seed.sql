-- SOFTEC Event Management System — Demo Seed Data
-- Compatible with the current schema.sql schema.
-- Password for ALL users: "password123"
USE softec_db;

SET @dev_hash = '$2a$10$CwTycUXWue0Thq9StjUM0uJ8o6wLYuGkU2m0rQzS9Wy2R3sjJq3Rq';

-- ─────────────────────────────────────────────────────────────────────────────
-- USERS
-- IDs  1      = admin
--      2–6    = organizers
--      7–56   = participants
--      57–64  = judges (users)
--      65–70  = sponsors (users)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO users (user_id, name, email, password_hash, role, status, organization, phone) VALUES
(1,  'Aisha Khan',          'aisha@softec.org',              @dev_hash, 'admin',       'active', 'SOFTEC HQ',          '0300-0000001'),
(2,  'Sana Riaz',           'sana@softec.org',               @dev_hash, 'organizer',   'active', 'Tech Events Inc',    '0300-0000002'),
(3,  'Hamza Qureshi',       'hamza.organizer@softec.org',    @dev_hash, 'organizer',   'active', 'Event Corp',         '0300-0000003'),
(4,  'Minaal Sheikh',       'minaal.organizer@softec.org',   @dev_hash, 'organizer',   'active', 'Event Mgmt',         '0300-0000004'),
(5,  'Taha Javed',          'taha.organizer@softec.org',     @dev_hash, 'organizer',   'active', 'Tech Academy',       '0300-0000005'),
(6,  'Rabia Noor',          'rabia.organizer@softec.org',    @dev_hash, 'organizer',   'active', 'Digital Studios',    '0300-0000006'),
-- Participants
(7,  'Bilal Ahmed',         'bilal@nu.edu.pk',               @dev_hash, 'participant', 'active', NULL, '0300-0000007'),
(8,  'Hira Iqbal',          'hira@nu.edu.pk',                @dev_hash, 'participant', 'active', NULL, '0300-0000008'),
(9,  'Omar Sheikh',         'omar@nu.edu.pk',                @dev_hash, 'participant', 'active', NULL, '0300-0000009'),
(10, 'Zara Malik',          'zara@nu.edu.pk',                @dev_hash, 'participant', 'active', NULL, '0300-0000010'),
(11, 'Hassan Tariq',        'hassan@nu.edu.pk',              @dev_hash, 'participant', 'active', NULL, '0300-0000011'),
(12, 'Mariam Sheikh',       'mariam@nu.edu.pk',              @dev_hash, 'participant', 'active', NULL, '0300-0000012'),
(13, 'Ali Raza',            'ali.raza@nu.edu.pk',            @dev_hash, 'participant', 'active', NULL, '0300-0000013'),
(14, 'Fatima Noor',         'fatima.noor@nu.edu.pk',         @dev_hash, 'participant', 'active', NULL, '0300-0000014'),
(15, 'Usman Ali',           'usman.ali@nu.edu.pk',           @dev_hash, 'participant', 'active', NULL, '0300-0000015'),
(16, 'Noor Fatima',         'noor.fatima@nu.edu.pk',         @dev_hash, 'participant', 'active', NULL, '0300-0000016'),
(17, 'Saad Khan',           'saad.khan@nu.edu.pk',           @dev_hash, 'participant', 'active', NULL, '0300-0000017'),
(18, 'Areeba Tariq',        'areeba.tariq@nu.edu.pk',        @dev_hash, 'participant', 'active', NULL, '0300-0000018'),
(19, 'Daniyal Akram',       'daniyal.akram@nu.edu.pk',       @dev_hash, 'participant', 'active', NULL, '0300-0000019'),
(20, 'Mahnoor Aziz',        'mahnoor.aziz@nu.edu.pk',        @dev_hash, 'participant', 'active', NULL, '0300-0000020'),
(21, 'Ahmad Farooq',        'ahmad.farooq@nu.edu.pk',        @dev_hash, 'participant', 'active', NULL, '0300-0000021'),
(22, 'Laiba Hassan',        'laiba.hassan@nu.edu.pk',        @dev_hash, 'participant', 'active', NULL, '0300-0000022'),
(23, 'Rayyan Siddiqui',     'rayyan.siddiqui@nu.edu.pk',     @dev_hash, 'participant', 'active', NULL, '0300-0000023'),
(24, 'Eman Zahid',          'eman.zahid@nu.edu.pk',          @dev_hash, 'participant', 'active', NULL, '0300-0000024'),
(25, 'Kashif Ilyas',        'kashif.ilyas@nu.edu.pk',        @dev_hash, 'participant', 'active', NULL, '0300-0000025'),
(26, 'Anaya Butt',          'anaya.butt@nu.edu.pk',          @dev_hash, 'participant', 'active', NULL, '0300-0000026'),
(27, 'Mustafa Baig',        'mustafa.baig@nu.edu.pk',        @dev_hash, 'participant', 'active', NULL, '0300-0000027'),
(28, 'Iqra Saleem',         'iqra.saleem@nu.edu.pk',         @dev_hash, 'participant', 'active', NULL, '0300-0000028'),
(29, 'Shayan Mir',          'shayan.mir@nu.edu.pk',          @dev_hash, 'participant', 'active', NULL, '0300-0000029'),
(30, 'Amina Yousaf',        'amina.yousaf@nu.edu.pk',        @dev_hash, 'participant', 'active', NULL, '0300-0000030'),
(31, 'Fahad Nadeem',        'fahad.nadeem@nu.edu.pk',        @dev_hash, 'participant', 'active', NULL, '0300-0000031'),
(32, 'Kinza Aslam',         'kinza.aslam@nu.edu.pk',         @dev_hash, 'participant', 'active', NULL, '0300-0000032'),
(33, 'Huzaifa Shah',        'huzaifa.shah@nu.edu.pk',        @dev_hash, 'participant', 'active', NULL, '0300-0000033'),
(34, 'Sadia Malik',         'sadia.malik@nu.edu.pk',         @dev_hash, 'participant', 'active', NULL, '0300-0000034'),
(35, 'Rafay Akhtar',        'rafay.akhtar@nu.edu.pk',        @dev_hash, 'participant', 'active', NULL, '0300-0000035'),
(36, 'Nimra Jamil',         'nimra.jamil@nu.edu.pk',         @dev_hash, 'participant', 'active', NULL, '0300-0000036'),
(37, 'Arham Gill',          'arham.gill@nu.edu.pk',          @dev_hash, 'participant', 'active', NULL, '0300-0000037'),
(38, 'Maham Rauf',          'maham.rauf@nu.edu.pk',          @dev_hash, 'participant', 'active', NULL, '0300-0000038'),
(39, 'Waleed Asif',         'waleed.asif@nu.edu.pk',         @dev_hash, 'participant', 'active', NULL, '0300-0000039'),
(40, 'Hania Tariq',         'hania.tariq@nu.edu.pk',         @dev_hash, 'participant', 'active', NULL, '0300-0000040'),
(41, 'Talha Rehman',        'talha.rehman@nu.edu.pk',        @dev_hash, 'participant', 'active', NULL, '0300-0000041'),
(42, 'Saira Latif',         'saira.latif@nu.edu.pk',         @dev_hash, 'participant', 'active', NULL, '0300-0000042'),
(43, 'Muneeb Anwar',        'muneeb.anwar@nu.edu.pk',        @dev_hash, 'participant', 'active', NULL, '0300-0000043'),
(44, 'Alina Qadir',         'alina.qadir@nu.edu.pk',         @dev_hash, 'participant', 'active', NULL, '0300-0000044'),
(45, 'Dawood Sami',         'dawood.sami@nu.edu.pk',         @dev_hash, 'participant', 'active', NULL, '0300-0000045'),
(46, 'Mehak Iqbal',         'mehak.iqbal@nu.edu.pk',         @dev_hash, 'participant', 'active', NULL, '0300-0000046'),
(47, 'Sameer Zafar',        'sameer.zafar@nu.edu.pk',        @dev_hash, 'participant', 'active', NULL, '0300-0000047'),
(48, 'Rida Kamal',          'rida.kamal@nu.edu.pk',          @dev_hash, 'participant', 'active', NULL, '0300-0000048'),
(49, 'Haroon Niaz',         'haroon.niaz@nu.edu.pk',         @dev_hash, 'participant', 'active', NULL, '0300-0000049'),
(50, 'Sehrish Khan',        'sehrish.khan@nu.edu.pk',        @dev_hash, 'participant', 'active', NULL, '0300-0000050'),
(51, 'Yasir Mehmood',       'yasir.mehmood@nu.edu.pk',       @dev_hash, 'participant', 'active', NULL, '0300-0000051'),
(52, 'Saba Imran',          'saba.imran@nu.edu.pk',          @dev_hash, 'participant', 'active', NULL, '0300-0000052'),
(53, 'Adeel Shahid',        'adeel.shahid@nu.edu.pk',        @dev_hash, 'participant', 'active', NULL, '0300-0000053'),
(54, 'Misha Naveed',        'misha.naveed@nu.edu.pk',        @dev_hash, 'participant', 'active', NULL, '0300-0000054'),
(55, 'Ibrahim Qasim',       'ibrahim.qasim@nu.edu.pk',       @dev_hash, 'participant', 'active', NULL, '0300-0000055'),
(56, 'Nashit Raza',         'nashit.raza@nu.edu.pk',         @dev_hash, 'participant', 'active', NULL, '0300-0000056'),
-- Judges (linked by email to judges table)
(57, 'Dr. Faraz Mahmood',   'faraz@nu.edu.pk',               @dev_hash, 'judge',       'active', 'FAST-NUCES', '0300-1000001'),
(58, 'Prof. Naila Hashmi',  'naila@nu.edu.pk',               @dev_hash, 'judge',       'active', 'FAST-NUCES', '0300-1000002'),
(59, 'Dr. Salman Wasti',    'salman.wasti@nu.edu.pk',        @dev_hash, 'judge',       'active', 'FAST-NUCES', '0300-1000003'),
(60, 'Abeer Kazmi',         'abeer.kazmi@industry.pk',       @dev_hash, 'judge',       'active', 'Industry',   '0300-1000004'),
(61, 'Dr. Mahwish Arif',    'mahwish.arif@nu.edu.pk',        @dev_hash, 'judge',       'active', 'FAST-NUCES', '0300-1000005'),
(62, 'Rohail Ansari',       'rohail.ansari@industry.pk',     @dev_hash, 'judge',       'active', 'Industry',   '0300-1000006'),
(63, 'Dr. Anum Faisal',     'anum.faisal@nu.edu.pk',         @dev_hash, 'judge',       'active', 'FAST-NUCES', '0300-1000007'),
(64, 'Sarmad Aziz',         'sarmad.aziz@industry.pk',       @dev_hash, 'judge',       'active', 'Industry',   '0300-1000008'),
-- Sponsors (user accounts linked to sponsors table)
(65, 'Systems Limited',     'patrons@systemsltd.com',        @dev_hash, 'sponsor',     'active', 'Systems Limited',       '042-111-000-001'),
(66, '10Pearls',            'give@10pearls.com',             @dev_hash, 'sponsor',     'active', '10Pearls',              '042-111-000-002'),
(67, 'Afiniti',             'marketing@afiniti.com',         @dev_hash, 'sponsor',     'active', 'Afiniti',               '042-111-000-003'),
(68, 'Devsinc',             'events@devsinc.com',            @dev_hash, 'sponsor',     'active', 'Devsinc',               '042-111-000-004'),
(69, 'NETSOL Technologies', 'community@netsoltech.com',      @dev_hash, 'sponsor',     'active', 'NETSOL Technologies',   '042-111-000-005'),
(70, 'Arbisoft',            'campus@arbisoft.com',           @dev_hash, 'sponsor',     'active', 'Arbisoft',              '042-111-000-006');

-- ─────────────────────────────────────────────────────────────────────────────
-- VENUES
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO venues (venue_id, venue_name, capacity, facilities, location) VALUES
(1, 'CS Auditorium',       400, 'Projector, stage, sound system, Wi-Fi', 'FAST Lahore Main Campus'),
(2, 'EE Hall A',           200, 'Projector, seating, podium',            'Electrical Engineering Block'),
(3, 'New Building Lab 1',  80,  'High-end PCs, wired internet',          'New Academic Block'),
(4, 'Sports Complex',      300, 'Gaming arena, booths, seating',         'Sports Complex');

-- ─────────────────────────────────────────────────────────────────────────────
-- JUDGES (standalone table — linked to users by email for judging.routes.js)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO judges (judge_id, name, email, contact, assigned_events_count) VALUES
(1, 'Dr. Faraz Mahmood',  'faraz@nu.edu.pk',            '0300-1000001', 0),
(2, 'Prof. Naila Hashmi', 'naila@nu.edu.pk',            '0300-1000002', 0),
(3, 'Dr. Salman Wasti',   'salman.wasti@nu.edu.pk',     '0300-1000003', 0),
(4, 'Abeer Kazmi',        'abeer.kazmi@industry.pk',    '0300-1000004', 0),
(5, 'Dr. Mahwish Arif',   'mahwish.arif@nu.edu.pk',     '0300-1000005', 0),
(6, 'Rohail Ansari',      'rohail.ansari@industry.pk',  '0300-1000006', 0),
(7, 'Dr. Anum Faisal',    'anum.faisal@nu.edu.pk',      '0300-1000007', 0),
(8, 'Sarmad Aziz',        'sarmad.aziz@industry.pk',    '0300-1000008', 0);

-- ─────────────────────────────────────────────────────────────────────────────
-- EVENTS  (category MUST match ENUM: 'Tech Events' | 'Business Competitions' |
--                                    'Gaming Tournaments' | 'General Events')
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO events (event_id, event_name, description, category, event_date,
                    max_participants, registered_participants, venue_id,
                    organizer_id, registration_fee, prize_pool, event_status) VALUES
(1,  'Speed Programming',
     'ICPC-style algorithm sprint — solve as many problems as you can in three hours.',
     'Tech Events', '2026-06-01', 80,  0, 3, 2, 1500.00, 50000.00,  'open'),
(2,  'SOFTEC Hackathon',
     'Thirty-six hour product-build challenge from idea to working demo.',
     'Tech Events', '2026-06-02', 200, 0, 1, 2, 4000.00, 150000.00, 'open'),
(3,  'AI Model Showdown',
     'Applied machine-learning competition with live inference demos.',
     'Tech Events', '2026-06-03', 100, 0, 2, 3, 2500.00, 100000.00, 'open'),
(4,  'Cyber Security CTF',
     'Blue-team and red-team security challenges across six attack categories.',
     'Tech Events', '2026-06-04', 120, 0, 3, 3, 2000.00, 80000.00,  'open'),
(5,  'Web Engineering Sprint',
     'End-to-end full-stack build in a single day.',
     'Tech Events', '2026-06-05', 80,  0, 2, 4, 1800.00, 60000.00,  'open'),
(6,  'Business Plan Showdown',
     'Pitch a venture idea to a panel of investors and faculty.',
     'Business Competitions', '2026-06-06', 60,  0, 1, 4, 2500.00, 75000.00,  'open'),
(7,  'Marketing Mavericks',
     'Live 90-minute campaign strategy challenge with real client brief.',
     'Business Competitions', '2026-06-07', 70,  0, 2, 5, 2000.00, 50000.00,  'open'),
(8,  'Startup Expo',
     'Prototype exhibition and investor walk-through.',
     'Business Competitions', '2026-06-08', 100, 0, 1, 5, 3000.00, 100000.00, 'open'),
(9,  'Case Study Challenge',
     'Solve a strategic business case in two hours.',
     'Business Competitions', '2026-06-09', 80,  0, 2, 6, 1800.00, 50000.00,  'open'),
(10, 'Finance Guru',
     'Corporate finance and valuation contest.',
     'Business Competitions', '2026-06-10', 70,  0, 1, 6, 1200.00, 40000.00,  'open'),
(11, 'Valorant Championship',
     'Team FPS tournament — five-versus-five, single elimination.',
     'Gaming Tournaments', '2026-06-11', 80,  0, 4, 2, 3000.00, 100000.00, 'open'),
(12, 'Tekken Solo Tournament',
     'Solo fighting-game bracket, double elimination.',
     'Gaming Tournaments', '2026-06-12', 64,  0, 4, 3, 1000.00, 30000.00,  'open'),
(13, 'FIFA Cup',
     'Console football tournament.',
     'Gaming Tournaments', '2026-06-13', 64,  0, 4, 4, 1000.00, 30000.00,  'open'),
(14, 'DOTA 2 Clash',
     'Five-player MOBA tournament.',
     'Gaming Tournaments', '2026-06-14', 100, 0, 4, 5, 3500.00, 120000.00, 'open'),
(15, 'PUBG Mobile Arena',
     'Squad mobile-esports event.',
     'Gaming Tournaments', '2026-06-15', 120, 0, 4, 6, 2500.00, 100000.00, 'open'),
(16, 'Photography Salon',
     'Juried photography exhibition — print and digital categories.',
     'General Events', '2026-06-16', 300, 0, 1, 2, 800.00,  25000.00, 'open'),
(17, 'AI Ethics Symposium',
     'Panel discussion and moderated debate on responsible AI.',
     'General Events', '2026-06-17', 200, 0, 2, 3, 500.00,  0.00,     'open'),
(18, 'Tech Talk Series',
     'Industry practitioners share real-world lessons — open to all.',
     'General Events', '2026-06-18', 250, 0, 1, 4, 0.00,   0.00,     'open'),
(19, 'Closing Concert',
     'SOFTEC closing ceremony and live concert.',
     'General Events', '2026-06-19', 300, 0, 4, 5, 1500.00, 0.00,     'open'),
(20, 'Robotics Showcase',
     'Student robotics demonstration and live challenges.',
     'General Events', '2026-06-20', 150, 0, 2, 6, 1000.00, 40000.00, 'open');

-- ─────────────────────────────────────────────────────────────────────────────
-- EVENT → JUDGE ASSIGNMENTS (judge_id references judges.judge_id)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO event_judges (event_id, judge_id) VALUES
(1,1),(1,3),
(2,1),(2,4),
(3,5),(3,7),
(4,6),(4,8),
(5,2),(5,4),
(6,2),(6,4),
(7,2),(7,7),
(8,4),(8,8),
(9,7),(9,3),
(10,2),(10,6),
(11,1),(11,5),
(12,3),(12,6),
(13,4),(13,7),
(14,5),(14,8),
(15,6),(15,3),
(16,8),(16,2),
(17,5),(17,7),
(18,1),
(19,3),
(20,7),(20,4);

-- ─────────────────────────────────────────────────────────────────────────────
-- SPONSORS (company profiles linked to sponsor user accounts)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO sponsors (sponsor_id, company_name, contact_person, email, phone,
                      sponsorship_level, amount, user_id) VALUES
(1, 'Systems Limited',     'Nadia Qureshi', 'patrons@systemsltd.com', '042-111-000-001', 'Title',  2500000.00, 65),
(2, '10Pearls',            'Asim Malik',    'give@10pearls.com',      '042-111-000-002', 'Gold',   1500000.00, 66),
(3, 'Afiniti',             'Sara Raza',     'marketing@afiniti.com',  '042-111-000-003', 'Silver', 1000000.00, 67),
(4, 'Devsinc',             'Bilal Tariq',   'events@devsinc.com',     '042-111-000-004', 'Silver',  750000.00, 68),
(5, 'NETSOL Technologies', 'Hania Asif',    'community@netsoltech.com','042-111-000-005','Silver',  500000.00, 69),
(6, 'Arbisoft',            'Hamid Khan',    'campus@arbisoft.com',    '042-111-000-006', 'Silver',  450000.00, 70);

-- ─────────────────────────────────────────────────────────────────────────────
-- SPONSORSHIPS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO sponsorships (sponsor_id, user_id, event_id, sponsorship_type, amount, status, approved_by, approved_at, rejection_reason, admin_notes) VALUES
(1, 65, 2,  'Title',  1200000.00, 'approved', 1, '2026-05-04 09:00:00', NULL, 'Flagship sponsorship approved.'),
(1, 65, 1,  'Gold',    500000.00, 'approved', 1, '2026-05-04 09:05:00', NULL, 'Approved for programme support.'),
(2, 66, 3,  'Gold',    450000.00, 'approved', 1, '2026-05-04 09:10:00', NULL, 'Approved after finance review.'),
(2, 66, 5,  'Silver',  250000.00, 'approved', 1, '2026-05-04 09:15:00', NULL, 'Approved after committee review.'),
(3, 67, 6,  'Gold',    400000.00, 'approved', 1, '2026-05-04 09:20:00', NULL, 'Approved for main stage branding.'),
(3, 67, 7,  'Silver',  200000.00, 'pending', NULL, NULL, NULL, NULL),
(4, 68, 11, 'Gold',    350000.00, 'approved', 1, '2026-05-04 09:25:00', NULL, 'Approved for esports event.'),
(4, 68, 12, 'Silver',  150000.00, 'approved', 1, '2026-05-04 09:30:00', NULL, 'Approved for tournament support.'),
(5, 69, 16, 'Silver',  125000.00, 'rejected', 1, '2026-05-04 09:35:00', 'Requested amount exceeds sponsor tier policy.', 'Rejection logged after admin review.'),
(6, 70, 20, 'Silver',  100000.00, 'approved', 1, '2026-05-04 09:40:00', NULL, 'Approved for showcase sponsorship.');

-- ─────────────────────────────────────────────────────────────────────────────
-- PARTICIPANTS
-- Covers events 1, 2, 3, 6, 7, 11, 12, 16 with realistic numbers.
-- participant_id auto-increments; referenced later by judging + passes.
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO participants (participant_id, user_id, event_id) VALUES
-- Event 1 · Speed Programming
(1,  7,  1),(2,  8,  1),(3,  9,  1),(4,  10, 1),(5,  11, 1),
(6,  12, 1),(7,  13, 1),(8,  14, 1),(9,  15, 1),(10, 16, 1),
(11, 17, 1),(12, 18, 1),(13, 19, 1),(14, 20, 1),(15, 21, 1),
-- Event 2 · SOFTEC Hackathon
(16, 7,  2),(17, 8,  2),(18, 9,  2),(19, 10, 2),(20, 11, 2),
(21, 13, 2),(22, 14, 2),(23, 22, 2),(24, 23, 2),(25, 24, 2),
-- Event 3 · AI Model Showdown
(26, 10, 3),(27, 15, 3),(28, 16, 3),(29, 17, 3),
-- Event 6 · Business Plan Showdown
(30, 17, 6),(31, 18, 6),(32, 19, 6),(33, 20, 6),
-- Event 7 · Marketing Mavericks
(34, 21, 7),(35, 22, 7),
-- Event 11 · Valorant Championship
(36, 19, 11),(37, 20, 11),(38, 21, 11),(39, 22, 11),
-- Event 12 · Tekken Solo
(40, 23, 12),(41, 24, 12),(42, 25, 12),
-- Event 16 · Photography Salon
(43, 20, 16),(44, 26, 16),(45, 27, 16);

-- ─────────────────────────────────────────────────────────────────────────────
-- PAYMENTS (registration payments; sponsorship payments already handled above
--           via sponsorships table — we just create their payment records here)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO payments (payment_id, user_id, event_id, amount, payment_type, status, payment_date) VALUES
-- Event 1 registrations (all completed)
(1,  7,  1, 1500.00, 'registration', 'completed', '2026-05-01 10:00:00'),
(2,  8,  1, 1500.00, 'registration', 'completed', '2026-05-01 11:00:00'),
(3,  9,  1, 1500.00, 'registration', 'completed', '2026-05-02 10:00:00'),
(4,  10, 1, 1500.00, 'registration', 'completed', '2026-05-02 11:00:00'),
(5,  11, 1, 1500.00, 'registration', 'completed', '2026-05-03 10:00:00'),
(6,  12, 1, 1500.00, 'registration', 'completed', '2026-05-03 11:00:00'),
(7,  13, 1, 1500.00, 'registration', 'completed', '2026-05-04 10:00:00'),
(8,  14, 1, 1500.00, 'registration', 'completed', '2026-05-04 11:00:00'),
(9,  15, 1, 1500.00, 'registration', 'completed', '2026-05-05 10:00:00'),
(10, 16, 1, 1500.00, 'registration', 'completed', '2026-05-05 11:00:00'),
(11, 17, 1, 1500.00, 'registration', 'completed', '2026-05-06 10:00:00'),
(12, 18, 1, 1500.00, 'registration', 'completed', '2026-05-06 11:00:00'),
(13, 19, 1, 1500.00, 'registration', 'completed', '2026-05-07 10:00:00'),
(14, 20, 1, 1500.00, 'registration', 'completed', '2026-05-07 11:00:00'),
(15, 21, 1, 1500.00, 'registration', 'completed', '2026-05-08 10:00:00'),
-- Event 2 registrations (mix of completed + pending)
(16, 7,  2, 4000.00, 'registration', 'completed', '2026-05-08 11:00:00'),
(17, 8,  2, 4000.00, 'registration', 'completed', '2026-05-09 10:00:00'),
(18, 9,  2, 4000.00, 'registration', 'completed', '2026-05-09 11:00:00'),
(19, 10, 2, 4000.00, 'registration', 'completed', '2026-05-10 10:00:00'),
(20, 11, 2, 4000.00, 'registration', 'completed', '2026-05-10 11:00:00'),
(21, 13, 2, 4000.00, 'registration', 'completed', '2026-05-11 10:00:00'),
(22, 14, 2, 4000.00, 'registration', 'completed', '2026-05-11 11:00:00'),
(23, 22, 2, 4000.00, 'registration', 'pending',   '2026-05-12 10:00:00'),
(24, 23, 2, 4000.00, 'registration', 'pending',   '2026-05-12 11:00:00'),
(25, 24, 2, 4000.00, 'registration', 'pending',   '2026-05-13 10:00:00'),
-- Event 3 registrations
(26, 10, 3, 2500.00, 'registration', 'completed', '2026-05-13 11:00:00'),
(27, 15, 3, 2500.00, 'registration', 'completed', '2026-05-14 10:00:00'),
(28, 16, 3, 2500.00, 'registration', 'completed', '2026-05-14 11:00:00'),
(29, 17, 3, 2500.00, 'registration', 'pending',   '2026-05-15 10:00:00'),
-- Event 6 registrations
(30, 17, 6, 2500.00, 'registration', 'completed', '2026-05-15 11:00:00'),
(31, 18, 6, 2500.00, 'registration', 'completed', '2026-05-16 10:00:00'),
(32, 19, 6, 2500.00, 'registration', 'pending',   '2026-05-16 11:00:00'),
(33, 20, 6, 2500.00, 'registration', 'pending',   '2026-05-17 10:00:00'),
-- Event 7 registrations
(34, 21, 7, 2000.00, 'registration', 'completed', '2026-05-17 11:00:00'),
(35, 22, 7, 2000.00, 'registration', 'pending',   '2026-05-18 10:00:00'),
-- Event 11 registrations
(36, 19, 11, 3000.00, 'registration', 'completed', '2026-05-18 11:00:00'),
(37, 20, 11, 3000.00, 'registration', 'completed', '2026-05-19 10:00:00'),
(38, 21, 11, 3000.00, 'registration', 'pending',   '2026-05-19 11:00:00'),
(39, 22, 11, 3000.00, 'registration', 'pending',   '2026-05-20 10:00:00'),
-- Event 12 registrations
(40, 23, 12, 1000.00, 'registration', 'completed', '2026-05-20 11:00:00'),
(41, 24, 12, 1000.00, 'registration', 'completed', '2026-05-21 10:00:00'),
(42, 25, 12, 1000.00, 'registration', 'pending',   '2026-05-21 11:00:00'),
-- Event 16 registrations
(43, 20, 16,  800.00, 'registration', 'completed', '2026-05-22 10:00:00'),
(44, 26, 16,  800.00, 'registration', 'completed', '2026-05-22 11:00:00'),
(45, 27, 16,  800.00, 'registration', 'completed', '2026-05-23 10:00:00'),
-- Sponsorship payments
(50, 65, 2,  1200000.00, 'sponsorship', 'completed', '2026-05-01 09:00:00'),
(51, 65, 1,   500000.00, 'sponsorship', 'completed', '2026-05-01 09:30:00'),
(52, 66, 3,   450000.00, 'sponsorship', 'completed', '2026-05-02 09:00:00'),
(53, 66, 5,   250000.00, 'sponsorship', 'completed', '2026-05-02 09:30:00'),
(54, 67, 6,   400000.00, 'sponsorship', 'completed', '2026-05-03 09:00:00'),
(55, 67, 7,   200000.00, 'sponsorship', 'pending',   '2026-05-03 09:30:00'),
(56, 68, 11,  350000.00, 'sponsorship', 'completed', '2026-05-04 09:00:00'),
(57, 68, 12,  150000.00, 'sponsorship', 'completed', '2026-05-04 09:30:00'),
(58, 69, 16,  125000.00, 'sponsorship', 'failed',    '2026-05-05 09:00:00'),
(59, 70, 20,  100000.00, 'sponsorship', 'completed', '2026-05-05 09:30:00'),
-- Accommodation payments
(60, 7,  NULL, 4500.00, 'accommodation', 'completed', '2026-05-10 12:00:00'),
(61, 8,  NULL, 4500.00, 'accommodation', 'completed', '2026-05-10 13:00:00');

-- ─────────────────────────────────────────────────────────────────────────────
-- PASSES (one pass per completed-payment participant; UUID() for pass_id)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO passes (pass_id, participant_id, event_id, qr_code, status) VALUES
('a1b2c3d4-0001-0001-0001-000000000001', 1,  1, 'SOFTEC-E1-P1',  'issued'),
('a1b2c3d4-0002-0002-0002-000000000002', 2,  1, 'SOFTEC-E1-P2',  'issued'),
('a1b2c3d4-0003-0003-0003-000000000003', 3,  1, 'SOFTEC-E1-P3',  'issued'),
('a1b2c3d4-0004-0004-0004-000000000004', 4,  1, 'SOFTEC-E1-P4',  'issued'),
('a1b2c3d4-0005-0005-0005-000000000005', 5,  1, 'SOFTEC-E1-P5',  'issued'),
('a1b2c3d4-0006-0006-0006-000000000006', 6,  1, 'SOFTEC-E1-P6',  'issued'),
('a1b2c3d4-0007-0007-0007-000000000007', 7,  1, 'SOFTEC-E1-P7',  'issued'),
('a1b2c3d4-0008-0008-0008-000000000008', 8,  1, 'SOFTEC-E1-P8',  'issued'),
('a1b2c3d4-0009-0009-0009-000000000009', 9,  1, 'SOFTEC-E1-P9',  'issued'),
('a1b2c3d4-0010-0010-0010-000000000010', 10, 1, 'SOFTEC-E1-P10', 'issued'),
('a1b2c3d4-0011-0011-0011-000000000011', 11, 1, 'SOFTEC-E1-P11', 'issued'),
('a1b2c3d4-0012-0012-0012-000000000012', 12, 1, 'SOFTEC-E1-P12', 'issued'),
('a1b2c3d4-0013-0013-0013-000000000013', 13, 1, 'SOFTEC-E1-P13', 'issued'),
('a1b2c3d4-0014-0014-0014-000000000014', 14, 1, 'SOFTEC-E1-P14', 'issued'),
('a1b2c3d4-0015-0015-0015-000000000015', 15, 1, 'SOFTEC-E1-P15', 'issued'),
('a1b2c3d4-0016-0016-0016-000000000016', 16, 2, 'SOFTEC-E2-P1',  'issued'),
('a1b2c3d4-0017-0017-0017-000000000017', 17, 2, 'SOFTEC-E2-P2',  'issued'),
('a1b2c3d4-0018-0018-0018-000000000018', 18, 2, 'SOFTEC-E2-P3',  'issued'),
('a1b2c3d4-0019-0019-0019-000000000019', 19, 2, 'SOFTEC-E2-P4',  'issued'),
('a1b2c3d4-0020-0020-0020-000000000020', 20, 2, 'SOFTEC-E2-P5',  'issued'),
('a1b2c3d4-0021-0021-0021-000000000021', 21, 2, 'SOFTEC-E2-P6',  'issued'),
('a1b2c3d4-0022-0022-0022-000000000022', 22, 2, 'SOFTEC-E2-P7',  'issued'),
('a1b2c3d4-0026-0026-0026-000000000026', 26, 3, 'SOFTEC-E3-P1',  'issued'),
('a1b2c3d4-0027-0027-0027-000000000027', 27, 3, 'SOFTEC-E3-P2',  'issued'),
('a1b2c3d4-0028-0028-0028-000000000028', 28, 3, 'SOFTEC-E3-P3',  'issued'),
('a1b2c3d4-0030-0030-0030-000000000030', 30, 6, 'SOFTEC-E6-P1',  'issued'),
('a1b2c3d4-0031-0031-0031-000000000031', 31, 6, 'SOFTEC-E6-P2',  'issued'),
('a1b2c3d4-0034-0034-0034-000000000034', 34, 7, 'SOFTEC-E7-P1',  'issued'),
('a1b2c3d4-0036-0036-0036-000000000036', 36, 11,'SOFTEC-E11-P1', 'issued'),
('a1b2c3d4-0037-0037-0037-000000000037', 37, 11,'SOFTEC-E11-P2', 'issued'),
('a1b2c3d4-0040-0040-0040-000000000040', 40, 12,'SOFTEC-E12-P1', 'issued'),
('a1b2c3d4-0041-0041-0041-000000000041', 41, 12,'SOFTEC-E12-P2', 'issued'),
('a1b2c3d4-0043-0043-0043-000000000043', 43, 16,'SOFTEC-E16-P1', 'issued'),
('a1b2c3d4-0044-0044-0044-000000000044', 44, 16,'SOFTEC-E16-P2', 'issued'),
('a1b2c3d4-0045-0045-0045-000000000045', 45, 16,'SOFTEC-E16-P3', 'issued');

-- ─────────────────────────────────────────────────────────────────────────────
-- JUDGING SCORES  (judge_id references judges.judge_id; score 0–10 decimal)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO judging (event_id, judge_id, participant_id, score, comments) VALUES
-- Event 1 · Speed Programming — judges 1 & 3
(1, 1,  1,  9.30, 'Excellent algorithmic thinking and clean solutions.'),
(1, 3,  1,  9.10, 'Fast execution, minimal bugs.'),
(1, 1,  2,  7.80, 'Good attempt; missed two edge cases.'),
(1, 3,  2,  7.50, 'Solid fundamentals, speed needs work.'),
(1, 1,  3,  8.70, 'Strong performance under pressure.'),
(1, 3,  3,  8.90, 'Good optimisation strategies.'),
(1, 1,  4,  8.40, 'Solid overall attempt.'),
(1, 3,  4,  8.10, 'Minor edge-case issues.'),
(1, 1,  5,  9.60, 'Outstanding result — fastest in the room.'),
(1, 3,  5,  9.40, 'Very polished code quality.'),
(1, 1,  6,  8.80, 'Consistent scoring across all problems.'),
(1, 3,  6,  8.50, 'Good structured approach.'),
-- Event 2 · SOFTEC Hackathon — judges 1 & 4
(2, 1,  16, 9.00, 'Compelling prototype with real-world application.'),
(2, 4,  16, 9.20, 'Strong product direction and market fit.'),
(2, 1,  17, 8.30, 'Creative idea; UX needs refinement.'),
(2, 4,  17, 8.00, 'Good technical execution.'),
(2, 1,  18, 8.70, 'Impressive scope for 36 hours.'),
(2, 4,  18, 8.50, 'Well-architected backend.'),
-- Event 6 · Business Plan Showdown — judges 2 & 4
(6, 2,  30, 8.60, 'Strong pitch and compelling market sizing.'),
(6, 4,  30, 8.40, 'Good financials, needs more validation.'),
(6, 2,  31, 7.90, 'Solid idea with realistic execution plan.'),
(6, 4,  31, 7.70, 'Presentation was clear and confident.'),
-- Event 3 · AI Model Showdown — judges 5 & 7
(3, 5,  26, 8.90, 'Impressive model accuracy and live demo.'),
(3, 7,  26, 9.10, 'Very well prepared inference pipeline.'),
(3, 5,  27, 8.20, 'Good model architecture choice.'),
(3, 7,  27, 8.00, 'Needs more robustness testing.');

-- ─────────────────────────────────────────────────────────────────────────────
-- TEAMS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO teams (team_id, team_name, event_id, created_by) VALUES
(1, 'ByteForce',      2, 7),
(2, 'Solo Stack',     1, 11),
(3, 'Pitch Perfect',  6, 17);

INSERT INTO team_members (team_id, user_id, role) VALUES
(1, 7,  'captain'),
(1, 13, 'member'),
(1, 14, 'member'),
(2, 11, 'captain'),
(3, 17, 'captain'),
(3, 18, 'member');

-- ─────────────────────────────────────────────────────────────────────────────
-- EVENT ROUNDS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO event_rounds (event_id, round_type, round_date, venue_id, status) VALUES
(1,  'Prelims',    '2026-05-28 10:00:00', 3, 'scheduled'),
(1,  'Finals',     '2026-06-01 09:00:00', 3, 'scheduled'),
(2,  'Prelims',    '2026-06-02 18:00:00', 1, 'scheduled'),
(2,  'Semi-Finals','2026-06-03 12:00:00', 1, 'scheduled'),
(2,  'Finals',     '2026-06-04 09:00:00', 1, 'scheduled'),
(6,  'Prelims',    '2026-06-05 10:00:00', 1, 'scheduled'),
(6,  'Finals',     '2026-06-06 14:00:00', 1, 'scheduled'),
(11, 'Prelims',    '2026-06-10 14:00:00', 4, 'scheduled'),
(11, 'Finals',     '2026-06-11 10:00:00', 4, 'scheduled');

-- ─────────────────────────────────────────────────────────────────────────────
-- ACCOMMODATIONS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO accommodations (accommodation_id, room_type, capacity, price_per_night, available_rooms) VALUES
(1, 'Single', 1, 4500.00, 6),
(2, 'Double', 2, 2500.00, 24),
(3, 'Triple', 3, 2000.00, 15),
(4, 'Quad',   4, 1500.00, 12);

INSERT INTO user_accommodations (user_id, accommodation_id, booked_at, check_in, check_out) VALUES
(7, 2, '2026-05-10 12:00:00', '2026-06-01', '2026-06-04'),
(8, 2, '2026-05-10 13:00:00', '2026-06-01', '2026-06-04');

-- ─────────────────────────────────────────────────────────────────────────────
-- DERIVED COUNTS — keep event.registered_participants in sync
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE events e
SET registered_participants = (
  SELECT COUNT(*) FROM participants p WHERE p.event_id = e.event_id
);

-- Keep sponsorship_total in sync with approved sponsorships
UPDATE events e
SET sponsorship_total = (
  SELECT COALESCE(SUM(s.amount), 0)
  FROM sponsorships s
  WHERE s.event_id = e.event_id
    AND s.status   = 'approved'
);

-- Keep judge assigned_events_count in sync
UPDATE judges j
SET assigned_events_count = (
  SELECT COUNT(*) FROM event_judges ej WHERE ej.judge_id = j.judge_id
);
