-- ═══════════════════════════════════════════════════════════════════
-- SOFTEC '26 — Demo Seed Data
-- Run AFTER schema.sql in MySQL Workbench.
-- All passwords are: Password123
-- Admin secret key: admin_secret
-- ═══════════════════════════════════════════════════════════════════
USE softec_db;
SET FOREIGN_KEY_CHECKS = 0;

-- ─── Users ──────────────────────────────────────────────────────────
-- password_hash is bcrypt of "Password123"
INSERT INTO users (user_id, name, email, password_hash, role, status) VALUES
-- Admin
(1,  'Admin User',         'admin@softec.pk',          '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin',       'active'),
-- Organizers
(2,  'Fatima Malik',       'fatima.malik@softec.pk',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'organizer',   'active'),
(3,  'Hamza Khan',         'hamza.khan@softec.pk',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'organizer',   'active'),
(4,  'Sara Ahmed',         'sara.ahmed@softec.pk',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'organizer',   'active'),
(5,  'Ali Raza',           'ali.raza@softec.pk',       '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'organizer',   'active'),
(6,  'Nadia Hussain',      'nadia.hussain@softec.pk',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'organizer',   'active'),
-- Judges (user accounts; linked to judges table by email)
(7,  'Dr. Tariq Mehmood',  'tariq.m@fast.edu.pk',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'judge',       'active'),
(8,  'Prof. Zara Baig',    'zara.baig@fast.edu.pk',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'judge',       'active'),
(9,  'Dr. Usman Qureshi',  'usman.q@fast.edu.pk',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'judge',       'active'),
(10, 'Sana Maqsood',       'sana.m@techfirm.pk',       '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'judge',       'active'),
(11, 'Bilal Chaudhry',     'bilal.c@industry.pk',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'judge',       'active'),
(12, 'Dr. Imran Shah',     'imran.shah@fast.edu.pk',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'judge',       'active'),
(13, 'Ayesha Siddiqui',    'ayesha.s@softec.pk',       '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'judge',       'active'),
(14, 'Omar Farooq',        'omar.f@research.pk',       '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'judge',       'active'),
-- Sponsors (user accounts)
(15, 'TechCorp Pakistan',  'sponsor@techcorp.pk',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'sponsor',     'active'),
(16, 'InnovatePK',         'sponsor@innovatepk.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'sponsor',     'active'),
(17, 'CodeBase Labs',      'sponsor@codebase.pk',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'sponsor',     'active'),
(18, 'Digital Frontier',   'sponsor@digitalfrontier.pk','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'sponsor',    'active'),
(19, 'NexGen Solutions',   'sponsor@nexgen.pk',        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'sponsor',     'active'),
(20, 'PakSoft Inc',        'sponsor@paksoft.pk',       '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'sponsor',     'active'),
-- Participants (21–60)
(21, 'Ahmed Bilal',        'ahmed.bilal@std.fast.edu.pk',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(22, 'Zainab Tariq',       'zainab.tariq@std.fast.edu.pk',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(23, 'Hassan Iqbal',       'hassan.iqbal@std.fast.edu.pk',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(24, 'Mahnoor Akhtar',     'mahnoor.akhtar@std.fast.edu.pk', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(25, 'Umar Shahid',        'umar.shahid@std.fast.edu.pk',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(26, 'Sadia Nawaz',        'sadia.nawaz@std.fast.edu.pk',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(27, 'Faisal Jamil',       'faisal.jamil@std.fast.edu.pk',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(28, 'Amna Sheikh',        'amna.sheikh@std.fast.edu.pk',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(29, 'Rizwan Malik',       'rizwan.malik@std.fast.edu.pk',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(30, 'Hira Yousaf',        'hira.yousaf@std.fast.edu.pk',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(31, 'Kamran Baig',        'kamran.baig@std.fast.edu.pk',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(32, 'Iqra Aslam',         'iqra.aslam@std.fast.edu.pk',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(33, 'Bilal Mirza',        'bilal.mirza@std.fast.edu.pk',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(34, 'Noor Fatima',        'noor.fatima@std.fast.edu.pk',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(35, 'Saad Rehman',        'saad.rehman@std.fast.edu.pk',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(36, 'Ayesha Rao',         'ayesha.rao@std.fast.edu.pk',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(37, 'Junaid Ali',         'junaid.ali@std.fast.edu.pk',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(38, 'Rida Zafar',         'rida.zafar@std.fast.edu.pk',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(39, 'Talha Naeem',        'talha.naeem@std.fast.edu.pk',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(40, 'Maryam Butt',        'maryam.butt@std.fast.edu.pk',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(41, 'Asad Latif',         'asad.latif@std.fast.edu.pk',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(42, 'Tooba Anwar',        'tooba.anwar@std.fast.edu.pk',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(43, 'Hamid Javed',        'hamid.javed@std.fast.edu.pk',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(44, 'Nimra Rashid',       'nimra.rashid@std.fast.edu.pk',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(45, 'Shahid Pervaiz',     'shahid.p@std.fast.edu.pk',       '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(46, 'Lubna Ghani',        'lubna.ghani@std.fast.edu.pk',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(47, 'Waqar Hayat',        'waqar.hayat@std.fast.edu.pk',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(48, 'Shazia Arif',        'shazia.arif@std.fast.edu.pk',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(49, 'Naveed Ullah',       'naveed.ullah@std.fast.edu.pk',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(50, 'Sana Liaquat',       'sana.liaquat@std.fast.edu.pk',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(51, 'Farhan Yousuf',      'farhan.y@std.fast.edu.pk',       '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(52, 'Asma Noor',          'asma.noor@std.fast.edu.pk',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(53, 'Danyal Waseem',      'danyal.w@std.fast.edu.pk',       '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(54, 'Komal Zulfiqar',     'komal.z@std.fast.edu.pk',        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(55, 'Nauman Saleem',      'nauman.s@std.fast.edu.pk',       '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(56, 'Fareeha Toor',       'fareeha.t@std.fast.edu.pk',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(57, 'Zubair Baig',        'zubair.baig@std.fast.edu.pk',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(58, 'Maria Qasim',        'maria.qasim@std.fast.edu.pk',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(59, 'Hamza Riaz',         'hamza.riaz@std.fast.edu.pk',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active'),
(60, 'Huma Khalid',        'huma.khalid@std.fast.edu.pk',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'participant', 'active');

-- ─── Venues ─────────────────────────────────────────────────────────
INSERT INTO venues (venue_id, venue_name, capacity, location, facilities) VALUES
(1, 'FAST Auditorium',       800, 'FAST-NUCES, Lahore', 'Stage, AV equipment, air conditioning'),
(2, 'CS Department Hall',    200, 'FAST-NUCES, Lahore', 'Projectors, whiteboard, seating'),
(3, 'Engineering Block Lab', 120, 'FAST-NUCES, Lahore', 'Computers, high-speed internet, AC'),
(4, 'Sports Complex',        500, 'FAST-NUCES, Lahore', 'Gaming stations, streaming setup, snack bar');

-- ─── Events ─────────────────────────────────────────────────────────
INSERT INTO events (event_id, event_name, description, category, event_date, max_participants, registration_fee, prize_pool, event_status, organizer_id, venue_id) VALUES
(1,  'Speed Programming',       'Solve algorithmic problems faster than anyone else.',                      'Tech Events',          '2026-06-15', 100,  500.00,  150000.00, 'open',      2, 3),
(2,  'AI Project Showcase',     'Present your machine learning projects to industry judges.',               'Tech Events',          '2026-06-16', 60,   1000.00, 300000.00, 'open',      2, 2),
(3,  'Business Plan Competition','Pitch your startup idea to investors and win seed funding.',              'Business Competitions', '2026-06-15', 80,   750.00,  250000.00, 'open',      3, 2),
(4,  'Case Study Challenge',    'Analyse a real company case and present your solution.',                   'Business Competitions', '2026-06-17', 60,   500.00,  120000.00, 'open',      3, 2),
(5,  'Game Development Jam',    '48-hour hackathon to build and demo your game.',                           'Gaming Tournaments',    '2026-06-14', 80,   600.00,  200000.00, 'open',      4, 4),
(6,  'VALORANT Championship',   'Campus VALORANT 5v5 tournament. Represent your university.',              'Gaming Tournaments',    '2026-06-16', 50,   300.00,  100000.00, 'open',      4, 4),
(7,  'Data Science Olympiad',   'Compete in data wrangling, visualisation, and modelling challenges.',     'Tech Events',          '2026-06-15', 80,   600.00,  180000.00, 'open',      5, 3),
(8,  'Cybersecurity CTF',       'Capture-the-flag competition for ethical hackers.',                       'Tech Events',          '2026-06-17', 60,   500.00,  160000.00, 'open',      5, 3),
(9,  'Robotics Challenge',      'Design, build, and control a robot to complete a course.',                'Tech Events',          '2026-06-14', 40,   1500.00, 350000.00, 'open',      6, 1),
(10, 'Debate Tournament',       'SOFTEC inter-university parliamentary debate league.',                    'General Events',       '2026-06-16', 60,   200.00,  80000.00,  'open',      6, 1),
(11, 'FIFA Weekend',            '1v1 FIFA tournament across two days.',                                    'Gaming Tournaments',   '2026-06-14', 64,   250.00,  75000.00,  'open',      2, 4),
(12, 'E-Sports Arena',          'Multi-game esports event — PUBG, CS2, and more.',                        'Gaming Tournaments',   '2026-06-15', 120,  400.00,  200000.00, 'open',      3, 4),
(13, 'Startup Pitch Night',     'Pitch in 5 minutes. Win in 10. Investor panel.',                         'Business Competitions', '2026-06-18', 30,   1000.00, 300000.00, 'open',      4, 2),
(14, 'UX/UI Design Sprint',     '12-hour design sprint to solve a real product problem.',                  'Tech Events',          '2026-06-13', 50,   500.00,  120000.00, 'open',      5, 2),
(15, 'Open Source Hackathon',   'Contribute to open source. Best PRs win.',                               'Tech Events',          '2026-06-14', 100,  0.00,    100000.00, 'open',      6, 3),
(16, 'Photography Exhibition',  'Showcase your best tech-themed photographs.',                             'General Events',       '2026-06-13', 40,   300.00,  50000.00,  'open',      2, 1),
(17, 'Tech Quiz',               'Test your knowledge of programming, networks, and CS theory.',            'Tech Events',          '2026-06-18', 80,   200.00,  60000.00,  'open',      3, 1),
(18, 'Entrepreneurship Summit', 'Talks, workshops, and networking with industry leaders.',                 'Business Competitions', '2026-06-17', 200,  0.00,    0.00,      'open',      4, 1),
(19, 'Board Game Olympics',     'Compete in chess, Scrabble, and strategy board games.',                   'General Events',       '2026-06-15', 60,   150.00,  40000.00,  'open',      5, 2),
(20, 'Closing Ceremony',        'Awards night, prize distribution, and live performances.',                'General Events',       '2026-06-18', 800,  0.00,    0.00,      'open',      6, 1);

-- ─── Judges (standalone table) ──────────────────────────────────────
INSERT INTO judges (judge_id, name, email, contact) VALUES
(1, 'Dr. Tariq Mehmood',  'tariq.m@fast.edu.pk',   '0300-1234567'),
(2, 'Prof. Zara Baig',    'zara.baig@fast.edu.pk',  '0301-2345678'),
(3, 'Dr. Usman Qureshi',  'usman.q@fast.edu.pk',    '0302-3456789'),
(4, 'Sana Maqsood',       'sana.m@techfirm.pk',     '0303-4567890'),
(5, 'Bilal Chaudhry',     'bilal.c@industry.pk',    '0304-5678901'),
(6, 'Dr. Imran Shah',     'imran.shah@fast.edu.pk', '0305-6789012'),
(7, 'Ayesha Siddiqui',    'ayesha.s@softec.pk',     '0306-7890123'),
(8, 'Omar Farooq',        'omar.f@research.pk',     '0307-8901234');

-- ─── Event–Judge assignments ─────────────────────────────────────────
INSERT INTO event_judges (event_id, judge_id) VALUES
(1,  1), (1,  2),
(2,  3), (2,  4),
(3,  5), (3,  6),
(4,  7), (4,  8),
(5,  1), (5,  3),
(6,  2), (6,  4),
(7,  5), (7,  7),
(8,  6), (8,  8),
(9,  1), (9,  2),
(10, 3), (10, 6),
(11, 4), (11, 7),
(12, 5), (12, 8),
(13, 1), (13, 6),
(14, 2), (14, 7),
(15, 3), (15, 8),
(16, 4),
(17, 5),
(18, 6),
(19, 7),
(20, 8);

-- ─── Sponsors ────────────────────────────────────────────────────────
INSERT INTO sponsors (sponsor_id, user_id, company_name, contact_person, email, phone, sponsorship_level, amount) VALUES
(1, 15, 'TechCorp Pakistan',  'Ali Imtiaz',    'sponsor@techcorp.pk',       '042-35761234', 'Title',  1200000.00),
(2, 16, 'InnovatePK',         'Sara Haider',   'sponsor@innovatepk.com',    '042-35891234', 'Gold',    600000.00),
(3, 17, 'CodeBase Labs',      'Raza Ahmed',    'sponsor@codebase.pk',       '042-35691234', 'Gold',    400000.00),
(4, 18, 'Digital Frontier',   'Hina Malik',    'sponsor@digitalfrontier.pk','042-35201234', 'Silver',  350000.00),
(5, 19, 'NexGen Solutions',   'Imran Siddiqui','sponsor@nexgen.pk',         '042-35801234', 'Silver',  200000.00),
(6, 20, 'PakSoft Inc',        'Faisal Aziz',   'sponsor@paksoft.pk',        '042-35701234', 'Bronze',  100000.00);

-- ─── Sponsorships ────────────────────────────────────────────────────
INSERT INTO sponsorships (sponsorship_id, sponsor_id, user_id, event_id, sponsorship_type, amount, status, approved_by, approved_at, admin_notes) VALUES
(1, 1, 15, 2,  'Title',  1200000.00, 'confirmed', 1, '2026-05-04 09:00:00', 'Flagship sponsorship confirmed.'),
(2, 1, 15, 1,  'Gold',    500000.00, 'confirmed', 1, '2026-05-04 09:05:00', 'Confirmed for programme support.'),
(3, 2, 16, 3,  'Gold',    450000.00, 'confirmed', 1, '2026-05-04 09:10:00', 'Confirmed after finance review.'),
(4, 2, 16, 5,  'Silver',  250000.00, 'confirmed', 1, '2026-05-04 09:15:00', 'Confirmed after committee review.'),
(5, 3, 17, 6,  'Gold',    400000.00, 'confirmed', 1, '2026-05-04 09:20:00', 'Confirmed for main stage branding.'),
(6, 4, 18, 9,  'Silver',  200000.00, 'pending',   NULL, NULL, NULL),
(7, 4, 18, 11, 'Gold',    350000.00, 'confirmed', 1, '2026-05-04 09:25:00', 'Confirmed for esports event.'),
(8, 4, 18, 12, 'Silver',  150000.00, 'confirmed', 1, '2026-05-04 09:30:00', 'Confirmed for tournament support.'),
(9, 5, 19, 7,  'Silver',  180000.00, 'pending',   NULL, NULL, NULL),
(10,6, 20, 20, 'Bronze',  100000.00, 'confirmed', 1, '2026-05-04 09:40:00', 'Confirmed for showcase sponsorship.');

-- ─── Participants ────────────────────────────────────────────────────
INSERT INTO participants (participant_id, user_id, event_id) VALUES
-- Event 1: Speed Programming (20 participants)
(1,  21, 1), (2,  22, 1), (3,  23, 1), (4,  24, 1), (5,  25, 1),
(6,  26, 1), (7,  27, 1), (8,  28, 1), (9,  29, 1), (10, 30, 1),
(11, 31, 1), (12, 32, 1), (13, 33, 1), (14, 34, 1), (15, 35, 1),
(16, 36, 1), (17, 37, 1), (18, 38, 1), (19, 39, 1), (20, 40, 1),
-- Event 2: AI Project Showcase (10 participants)
(21, 21, 2), (22, 23, 2), (23, 25, 2), (24, 27, 2), (25, 29, 2),
(26, 31, 2), (27, 33, 2), (28, 35, 2), (29, 37, 2), (30, 39, 2),
-- Event 3: Business Plan Competition (10 participants)
(31, 22, 3), (32, 24, 3), (33, 26, 3), (34, 28, 3), (35, 30, 3),
(36, 32, 3), (37, 34, 3), (38, 36, 3), (39, 38, 3), (40, 40, 3),
-- Event 5: Game Dev Jam (8 participants)
(41, 41, 5), (42, 42, 5), (43, 43, 5), (44, 44, 5),
(45, 45, 5), (46, 46, 5), (47, 47, 5), (48, 48, 5),
-- Event 7: Data Science Olympiad (8 participants)
(49, 49, 7), (50, 50, 7), (51, 51, 7), (52, 52, 7),
(53, 53, 7), (54, 54, 7), (55, 55, 7), (56, 56, 7),
-- Event 8: Cybersecurity CTF (5 participants)
(57, 57, 8), (58, 58, 8), (59, 59, 8), (60, 60, 8), (61, 21, 8),
-- Event 15: Open Source Hackathon (free, 4 participants)
(62, 22, 15), (63, 24, 15), (64, 26, 15), (65, 28, 15);

-- ─── Payments ────────────────────────────────────────────────────────
-- Registration payments for events with fees
INSERT INTO payments (user_id, event_id, amount, payment_type, status) VALUES
-- Event 1 (fee 500) - all 20 registered, 15 completed, 5 pending
(21, 1, 500.00, 'registration', 'completed'), (22, 1, 500.00, 'registration', 'completed'),
(23, 1, 500.00, 'registration', 'completed'), (24, 1, 500.00, 'registration', 'completed'),
(25, 1, 500.00, 'registration', 'completed'), (26, 1, 500.00, 'registration', 'completed'),
(27, 1, 500.00, 'registration', 'completed'), (28, 1, 500.00, 'registration', 'completed'),
(29, 1, 500.00, 'registration', 'completed'), (30, 1, 500.00, 'registration', 'completed'),
(31, 1, 500.00, 'registration', 'completed'), (32, 1, 500.00, 'registration', 'completed'),
(33, 1, 500.00, 'registration', 'completed'), (34, 1, 500.00, 'registration', 'completed'),
(35, 1, 500.00, 'registration', 'completed'),
(36, 1, 500.00, 'registration', 'pending'),   (37, 1, 500.00, 'registration', 'pending'),
(38, 1, 500.00, 'registration', 'pending'),   (39, 1, 500.00, 'registration', 'pending'),
(40, 1, 500.00, 'registration', 'pending'),
-- Event 2 (fee 1000) - 10 registered, 8 completed
(21, 2, 1000.00, 'registration', 'completed'), (23, 2, 1000.00, 'registration', 'completed'),
(25, 2, 1000.00, 'registration', 'completed'), (27, 2, 1000.00, 'registration', 'completed'),
(29, 2, 1000.00, 'registration', 'completed'), (31, 2, 1000.00, 'registration', 'completed'),
(33, 2, 1000.00, 'registration', 'completed'), (35, 2, 1000.00, 'registration', 'completed'),
(37, 2, 1000.00, 'registration', 'pending'),   (39, 2, 1000.00, 'registration', 'pending'),
-- Event 3 (fee 750) - 10 registered, 6 completed
(22, 3, 750.00, 'registration', 'completed'), (24, 3, 750.00, 'registration', 'completed'),
(26, 3, 750.00, 'registration', 'completed'), (28, 3, 750.00, 'registration', 'completed'),
(30, 3, 750.00, 'registration', 'completed'), (32, 3, 750.00, 'registration', 'completed'),
(34, 3, 750.00, 'registration', 'pending'),   (36, 3, 750.00, 'registration', 'pending'),
(38, 3, 750.00, 'registration', 'pending'),   (40, 3, 750.00, 'registration', 'pending'),
-- Event 5 (fee 600) - 8 registered, all completed
(41, 5, 600.00, 'registration', 'completed'), (42, 5, 600.00, 'registration', 'completed'),
(43, 5, 600.00, 'registration', 'completed'), (44, 5, 600.00, 'registration', 'completed'),
(45, 5, 600.00, 'registration', 'completed'), (46, 5, 600.00, 'registration', 'completed'),
(47, 5, 600.00, 'registration', 'completed'), (48, 5, 600.00, 'registration', 'completed'),
-- Event 7 (fee 600) - 8 registered, 5 completed
(49, 7, 600.00, 'registration', 'completed'), (50, 7, 600.00, 'registration', 'completed'),
(51, 7, 600.00, 'registration', 'completed'), (52, 7, 600.00, 'registration', 'completed'),
(53, 7, 600.00, 'registration', 'completed'),
(54, 7, 600.00, 'registration', 'pending'),   (55, 7, 600.00, 'registration', 'pending'),
(56, 7, 600.00, 'registration', 'pending'),
-- Event 8 (fee 500) - 5 registered, all completed
(57, 8, 500.00, 'registration', 'completed'), (58, 8, 500.00, 'registration', 'completed'),
(59, 8, 500.00, 'registration', 'completed'), (60, 8, 500.00, 'registration', 'completed'),
(21, 8, 500.00, 'registration', 'completed'),
-- Event 15 (free) - 4 participants, payments all auto-completed
(22, 15, 0.00, 'registration', 'completed'), (24, 15, 0.00, 'registration', 'completed'),
(26, 15, 0.00, 'registration', 'completed'), (28, 15, 0.00, 'registration', 'completed'),
-- Sponsorship payments
(15, 2,  1200000.00, 'sponsorship', 'completed'),
(15, 1,   500000.00, 'sponsorship', 'completed'),
(16, 3,   450000.00, 'sponsorship', 'completed'),
(16, 5,   250000.00, 'sponsorship', 'completed'),
(17, 6,   400000.00, 'sponsorship', 'completed'),
(18, 9,   200000.00, 'sponsorship', 'pending'),
(18, 11,  350000.00, 'sponsorship', 'completed'),
(18, 12,  150000.00, 'sponsorship', 'completed'),
(19, 7,   180000.00, 'sponsorship', 'pending'),
(20, 20,  100000.00, 'sponsorship', 'completed');

-- ─── Passes ──────────────────────────────────────────────────────────
-- Issued for completed registration payments
INSERT INTO passes (pass_id, participant_id, event_id, status, qr_code) VALUES
('p1a2b3c4-0001-0001-0001-000000000001', 1,  1, 'issued',   'SOFTEC-1-1'),
('p1a2b3c4-0002-0002-0002-000000000002', 2,  1, 'issued',   'SOFTEC-1-2'),
('p1a2b3c4-0003-0003-0003-000000000003', 3,  1, 'issued',   'SOFTEC-1-3'),
('p1a2b3c4-0004-0004-0004-000000000004', 4,  1, 'issued',   'SOFTEC-1-4'),
('p1a2b3c4-0005-0005-0005-000000000005', 5,  1, 'issued',   'SOFTEC-1-5'),
('p1a2b3c4-0006-0006-0006-000000000006', 6,  1, 'redeemed', 'SOFTEC-1-6'),
('p1a2b3c4-0007-0007-0007-000000000007', 7,  1, 'issued',   'SOFTEC-1-7'),
('p1a2b3c4-0008-0008-0008-000000000008', 8,  1, 'issued',   'SOFTEC-1-8'),
('p1a2b3c4-0009-0009-0009-000000000009', 9,  1, 'issued',   'SOFTEC-1-9'),
('p1a2b3c4-0010-0010-0010-000000000010', 10, 1, 'issued',   'SOFTEC-1-10'),
('p1a2b3c4-0011-0011-0011-000000000011', 11, 1, 'issued',   'SOFTEC-1-11'),
('p1a2b3c4-0012-0012-0012-000000000012', 12, 1, 'issued',   'SOFTEC-1-12'),
('p1a2b3c4-0013-0013-0013-000000000013', 13, 1, 'issued',   'SOFTEC-1-13'),
('p1a2b3c4-0014-0014-0014-000000000014', 14, 1, 'issued',   'SOFTEC-1-14'),
('p1a2b3c4-0015-0015-0015-000000000015', 15, 1, 'issued',   'SOFTEC-1-15'),
-- Event 2 passes
('p2a2b3c4-0001-0001-0001-000000000021', 21, 2, 'issued',   'SOFTEC-2-21'),
('p2a2b3c4-0002-0002-0002-000000000022', 22, 2, 'issued',   'SOFTEC-2-22'),
('p2a2b3c4-0003-0003-0003-000000000023', 23, 2, 'issued',   'SOFTEC-2-23'),
('p2a2b3c4-0004-0004-0004-000000000024', 24, 2, 'issued',   'SOFTEC-2-24'),
('p2a2b3c4-0005-0005-0005-000000000025', 25, 2, 'issued',   'SOFTEC-2-25'),
('p2a2b3c4-0006-0006-0006-000000000026', 26, 2, 'issued',   'SOFTEC-2-26'),
('p2a2b3c4-0007-0007-0007-000000000027', 27, 2, 'issued',   'SOFTEC-2-27'),
('p2a2b3c4-0008-0008-0008-000000000028', 28, 2, 'issued',   'SOFTEC-2-28'),
-- Event 3 passes
('p3a2b3c4-0001-0001-0001-000000000031', 31, 3, 'issued',   'SOFTEC-3-31'),
('p3a2b3c4-0002-0002-0002-000000000032', 32, 3, 'issued',   'SOFTEC-3-32'),
('p3a2b3c4-0003-0003-0003-000000000033', 33, 3, 'issued',   'SOFTEC-3-33'),
('p3a2b3c4-0004-0004-0004-000000000034', 34, 3, 'issued',   'SOFTEC-3-34'),
('p3a2b3c4-0005-0005-0005-000000000035', 35, 3, 'issued',   'SOFTEC-3-35'),
('p3a2b3c4-0006-0006-0006-000000000036', 36, 3, 'issued',   'SOFTEC-3-36'),
-- Event 5 passes
('p5a2b3c4-0001-0001-0001-000000000041', 41, 5, 'issued',   'SOFTEC-5-41'),
('p5a2b3c4-0002-0002-0002-000000000042', 42, 5, 'issued',   'SOFTEC-5-42'),
('p5a2b3c4-0003-0003-0003-000000000043', 43, 5, 'issued',   'SOFTEC-5-43'),
('p5a2b3c4-0004-0004-0004-000000000044', 44, 5, 'issued',   'SOFTEC-5-44'),
('p5a2b3c4-0005-0005-0005-000000000045', 45, 5, 'issued',   'SOFTEC-5-45'),
('p5a2b3c4-0006-0006-0006-000000000046', 46, 5, 'issued',   'SOFTEC-5-46'),
('p5a2b3c4-0007-0007-0007-000000000047', 47, 5, 'issued',   'SOFTEC-5-47'),
('p5a2b3c4-0008-0008-0008-000000000048', 48, 5, 'issued',   'SOFTEC-5-48'),
-- Event 7 passes
('p7a2b3c4-0001-0001-0001-000000000049', 49, 7, 'issued',   'SOFTEC-7-49'),
('p7a2b3c4-0002-0002-0002-000000000050', 50, 7, 'issued',   'SOFTEC-7-50'),
('p7a2b3c4-0003-0003-0003-000000000051', 51, 7, 'issued',   'SOFTEC-7-51'),
('p7a2b3c4-0004-0004-0004-000000000052', 52, 7, 'issued',   'SOFTEC-7-52'),
('p7a2b3c4-0005-0005-0005-000000000053', 53, 7, 'issued',   'SOFTEC-7-53'),
-- Event 8 passes
('p8a2b3c4-0001-0001-0001-000000000057', 57, 8, 'issued',   'SOFTEC-8-57'),
('p8a2b3c4-0002-0002-0002-000000000058', 58, 8, 'issued',   'SOFTEC-8-58'),
('p8a2b3c4-0003-0003-0003-000000000059', 59, 8, 'issued',   'SOFTEC-8-59'),
('p8a2b3c4-0004-0004-0004-000000000060', 60, 8, 'issued',   'SOFTEC-8-60'),
('p8a2b3c4-0005-0005-0005-000000000061', 61, 8, 'issued',   'SOFTEC-8-61'),
-- Event 15 passes (free)
('p15a2b3c-0001-0001-0001-000000000062', 62, 15, 'issued',  'SOFTEC-15-62'),
('p15a2b3c-0002-0002-0002-000000000063', 63, 15, 'issued',  'SOFTEC-15-63'),
('p15a2b3c-0003-0003-0003-000000000064', 64, 15, 'issued',  'SOFTEC-15-64'),
('p15a2b3c-0004-0004-0004-000000000065', 65, 15, 'issued',  'SOFTEC-15-65');

-- ─── Judging scores ──────────────────────────────────────────────────
-- Event 1 judging by judge 1 and 2
INSERT INTO judging (event_id, judge_id, participant_id, score, comments) VALUES
(1, 1, 1,  8.50, 'Excellent speed and accuracy.'),
(1, 1, 2,  7.80, 'Good approach, minor bugs.'),
(1, 1, 3,  9.20, 'Fastest submission, clean code.'),
(1, 1, 4,  6.50, 'Partial solution on hard problem.'),
(1, 1, 5,  7.20, 'Solid performance.'),
(1, 2, 1,  8.80, 'Very efficient solution.'),
(1, 2, 2,  7.50, 'Good but could optimize more.'),
(1, 2, 3,  9.00, 'Outstanding, top performer.'),
(1, 2, 4,  6.00, 'Struggled with advanced problems.'),
(1, 2, 5,  7.50, 'Consistent performance.'),
-- Event 2 judging by judge 3 and 4
(2, 3, 21, 8.00, 'Strong ML pipeline.'),
(2, 3, 22, 7.50, 'Good presentation, average model.'),
(2, 3, 23, 9.00, 'Innovative use of transformer models.'),
(2, 4, 21, 8.20, 'Well-structured project.'),
(2, 4, 22, 7.80, 'Solid baseline model.'),
(2, 4, 23, 9.10, 'Best project of the day.'),
-- Event 3 judging by judge 5 and 6
(3, 5, 31, 7.80, 'Good business model.'),
(3, 5, 32, 8.50, 'Very compelling pitch.'),
(3, 5, 33, 7.20, 'Interesting idea, weak financials.'),
(3, 6, 31, 7.60, 'Realistic market analysis.'),
(3, 6, 32, 8.70, 'Best pitch of the competition.'),
(3, 6, 33, 7.40, 'Creative solution.'),
-- Event 5 judging by judge 1 and 3
(5, 1, 41, 8.20, 'Great gameplay loop.'),
(5, 1, 42, 7.90, 'Polished graphics.'),
(5, 3, 41, 8.50, 'Excellent mechanics.'),
(5, 3, 42, 8.10, 'Fun and engaging.');

-- ─── Teams ───────────────────────────────────────────────────────────
INSERT INTO teams (team_id, team_name, event_id, created_by) VALUES
(1, 'Team Alpha',  5, 41),
(2, 'Team Beta',   5, 43),
(3, 'Code Ninjas', 1, 21);

INSERT INTO team_members (team_id, user_id, role) VALUES
(1, 41, 'leader'), (1, 42, 'member'),
(2, 43, 'leader'), (2, 44, 'member'),
(3, 21, 'leader'), (3, 22, 'member'), (3, 23, 'member');

-- ─── Event rounds ────────────────────────────────────────────────────
INSERT INTO event_rounds (event_id, round_type, round_date, venue_id) VALUES
(1, 'Prelims',     '2026-06-15 09:00:00', 3),
(1, 'Finals',      '2026-06-15 15:00:00', 3),
(2, 'Prelims',     '2026-06-16 10:00:00', 2),
(2, 'Finals',      '2026-06-16 15:00:00', 2),
(3, 'Prelims',     '2026-06-15 10:00:00', 2),
(3, 'Semi-Finals', '2026-06-15 13:00:00', 2),
(3, 'Finals',      '2026-06-15 17:00:00', 2),
(5, 'Custom',      '2026-06-14 09:00:00', 4),
(9, 'Finals',      '2026-06-14 14:00:00', 1);

-- ─── Accommodations ──────────────────────────────────────────────────
INSERT INTO accommodations (accommodation_id, venue_name, room_type, capacity, price_per_night, available_rooms) VALUES
(1, 'FAST Hostel Block A', 'Single Room',   1, 1500.00, 20),
(2, 'FAST Hostel Block A', 'Double Room',   2, 1000.00, 15),
(3, 'FAST Hostel Block B', 'Dormitory',     6, 500.00,  8),
(4, 'FAST Hostel Block B', 'Triple Room',   3, 800.00,  10);

INSERT INTO user_accommodations (user_id, accommodation_id, check_in, check_out) VALUES
(41, 1, '2026-06-13', '2026-06-19'),
(42, 2, '2026-06-14', '2026-06-18');

-- ─── Sync derived counts ─────────────────────────────────────────────
UPDATE events e
SET registered_participants = (
  SELECT COUNT(*) FROM participants p WHERE p.event_id = e.event_id
);

UPDATE events e
SET sponsorship_total = (
  SELECT COALESCE(SUM(s.amount), 0)
  FROM sponsorships s
  WHERE s.event_id = e.event_id AND s.status = 'confirmed'
);

UPDATE judges j
SET assigned_events_count = (
  SELECT COUNT(*) FROM event_judges ej WHERE ej.judge_id = j.judge_id
);

SET FOREIGN_KEY_CHECKS = 1;
