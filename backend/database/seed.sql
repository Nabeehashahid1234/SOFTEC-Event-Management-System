-- Sample Data for SOFTEC Event Management System (Updated Schema)
-- This file provides test data to validate the new schema

USE softec_db;

SET @dev_hash = '$2a$10$CwTycUXWue0Thq9StjUM0uJ8o6wLYuGkU2m0rQzS9Wy2R3sjJq3Rq';

-- Add test users with new roles
INSERT INTO users (name, email, password_hash, role, status, organization, phone) VALUES
('Aisha Khan','aisha@softec.org',@dev_hash,'admin','active','SOFTEC','1111111111'),
('Sana Riaz','sana@softec.org',@dev_hash,'organizer','active','Tech Events Inc','2222222222'),
('Hamza Qureshi','hamza.organizer@softec.org',@dev_hash,'organizer','active','Event Corp','3333333333'),
('Minaal Sheikh','minaal.organizer@softec.org',@dev_hash,'organizer','active','Event Mgmt','4444444444'),
('Taha Javed','taha.organizer@softec.org',@dev_hash,'organizer','active','Tech Academy','5555555555'),
('Sarah Judge','sarah.judge@softec.org',@dev_hash,'judge','active','Tech Academy','6666666666'),
('Mark Judge','mark.judge@softec.org',@dev_hash,'judge','active','Education Institute','7777777777'),
('Tech Sponsor','tech.sponsor@softec.org',@dev_hash,'sponsor','active','Tech Corp Ltd','8888888888'),
('Alice Participant','alice.p@softec.org',@dev_hash,'participant','active',NULL,'9999999999'),
('Bob Participant','bob.p@softec.org',@dev_hash,'participant','active',NULL,'1010101010'),
('Charlie Participant','charlie.p@softec.org',@dev_hash,'participant','active',NULL,'1111111111'),
('Diana Participant','diana.p@softec.org',@dev_hash,'participant','active',NULL,'1212121212'),
('Eve Participant','eve.p@softec.org',@dev_hash,'participant','active',NULL,'1313131313');

-- Add venues
INSERT INTO venues (venue_name, capacity, facilities, location) VALUES
('Convention Center Downtown',500,'WiFi, Parking, Catering, AV Equipment','Downtown, Main City'),
('Tech Hub Arena',300,'WiFi, Parking, Cafeteria','Innovation District'),
('University Auditorium',400,'WiFi, Audio System, Projection','Campus Street'),
('Grand Hotel Ballroom',250,'WiFi, Catering, AV, VIP Lounge','Hotel Plaza');

-- Add sponsors
INSERT INTO sponsors (user_id, tier, company_name, email, phone) VALUES
(8,'platinum','Tech Corp Ltd','tech.sponsor@softec.org','8888888888');

-- Add events with new fields
INSERT INTO events (
  event_name, description, category, event_date, max_participants,
  registration_fee, prize_pool, organizer_id, venue_id,
  assigned_judge_id, event_status
) VALUES
(
  'Tech Summit 2024','Annual technology innovation conference','Technology',
  DATE_ADD(NOW(), INTERVAL 30 DAY),100,50.00,5000.00,2,1,6,'open'
),
(
  'Mobile App Hackathon','Build innovative mobile applications','Development',
  DATE_ADD(NOW(), INTERVAL 45 DAY),80,30.00,3000.00,2,2,7,'open'
),
(
  'AI Workshop Series','Learn artificial intelligence fundamentals','Technology',
  DATE_ADD(NOW(), INTERVAL 60 DAY),60,75.00,2000.00,3,3,6,'created'
);

-- Add event rounds (replaces legacy rounds table)
INSERT INTO event_rounds (event_id, round_type, round_date, start_time, end_time, status, venue_id) VALUES
(1,'Keynote',DATE_ADD(NOW(), INTERVAL 30 DAY),'09:00:00','10:30:00','scheduled',1),
(1,'Technical Sessions',DATE_ADD(NOW(), INTERVAL 30 DAY),'10:45:00','13:00:00','scheduled',1),
(1,'Networking',DATE_ADD(NOW(), INTERVAL 30 DAY),'13:00:00','14:00:00','scheduled',1),
(2,'Kickoff',DATE_ADD(NOW(), INTERVAL 45 DAY),'09:00:00','10:00:00','scheduled',2),
(2,'Development',DATE_ADD(NOW(), INTERVAL 45 DAY),'10:00:00','17:00:00','scheduled',2),
(2,'Final Presentations',DATE_ADD(NOW(), INTERVAL 46 DAY),'09:00:00','12:00:00','scheduled',2);

-- Add judge assignments (replaces legacy judge tracking)
INSERT INTO judge_assignments (event_id, judge_id, assigned_by, active) VALUES
(1,6,1,1),
(2,7,1,1),
(3,6,1,1);

-- Add sponsorships (replaces sponsor_events table)
INSERT INTO sponsorships (sponsor_id, event_id, amount, tier, status, sponsored_at) VALUES
(1,1,10000.00,'platinum','confirmed',NOW()),
(1,2,5000.00,'gold','confirmed',NOW());

-- Add registrations (replaces participants table)
INSERT INTO registrations (user_id, event_id, status, registered_at) VALUES
(9,1,'confirmed',NOW()),
(10,1,'confirmed',NOW()),
(11,1,'confirmed',NOW()),
(12,1,'confirmed',NOW()),
(13,1,'confirmed',NOW()),
(9,2,'confirmed',NOW()),
(10,2,'confirmed',NOW()),
(11,2,'confirmed',NOW()),
(13,3,'pending',NOW());

-- Add payments (unified payment tracking)
INSERT INTO payments (
  user_id, registration_id, event_id, sponsor_id, amount,
  payment_type, status, created_at
) VALUES
(9,1,1,NULL,50.00,'registration','completed',NOW()),
(10,2,1,NULL,50.00,'registration','completed',NOW()),
(11,3,1,NULL,50.00,'registration','completed',NOW()),
(12,4,1,NULL,50.00,'registration','completed',NOW()),
(13,5,1,NULL,50.00,'registration','completed',NOW()),
(9,6,2,NULL,30.00,'registration','completed',NOW()),
(10,7,2,NULL,30.00,'registration','completed',NOW()),
(11,8,2,NULL,30.00,'registration','completed',NOW()),
(13,9,3,NULL,75.00,'registration','pending',NOW()),
(8,NULL,1,1,10000.00,'sponsorship','completed',NOW()),
(8,NULL,2,1,5000.00,'sponsorship','completed',NOW());

-- Add teams
INSERT INTO teams (team_name, event_id, created_by) VALUES
('Tech Innovators',1,9),
('Code Masters',2,10),
('AI Explorers',3,13);

-- Add team members
INSERT INTO team_members (team_id, user_id, joined_at) VALUES
(1,9,NOW()),
(1,10,NOW()),
(2,10,NOW()),
(2,11,NOW()),
(3,13,NOW());

-- Add sample scores from judges
INSERT INTO scores (event_id, judge_id, participant_id, score, comments, created_at) VALUES
(1,6,1,85.5,'Excellent presentation and innovation',NOW()),
(1,6,2,78.0,'Good technical skills, needs improvement in presentation',NOW()),
(1,6,3,92.0,'Outstanding work, highly recommended',NOW()),
(2,7,2,88.0,'Clean code and good UX design',NOW()),
(2,7,3,81.5,'Functional but needs performance optimization',NOW());

-- Add accommodations
INSERT INTO accommodations (venue_name, room_type, capacity, price_per_night, availability) VALUES
('Downtown Hotel','Single Room',50,100.00,30),
('Downtown Hotel','Double Room',40,150.00,25),
('Campus Guest House','Single Room',100,75.00,50);

-- Add accommodation bookings
INSERT INTO user_accommodations (user_id, accommodation_id, check_in, check_out) VALUES
(9,1,DATE_ADD(NOW(), INTERVAL 29 DAY),DATE_ADD(NOW(), INTERVAL 31 DAY)),
(10,2,DATE_ADD(NOW(), INTERVAL 29 DAY),DATE_ADD(NOW(), INTERVAL 31 DAY)),
(11,3,DATE_ADD(NOW(), INTERVAL 29 DAY),DATE_ADD(NOW(), INTERVAL 31 DAY));
(6,'Rabia Noor','rabia.organizer@softec.org',@dev_hash,'organizer','active'),
(7,'Bilal Ahmed','bilal@nu.edu.pk',@dev_hash,'participant','active'),
(8,'Hira Iqbal','hira@nu.edu.pk',@dev_hash,'participant','active'),
(9,'Omar Sheikh','omar@nu.edu.pk',@dev_hash,'participant','active'),
(10,'Zara Malik','zara@nu.edu.pk',@dev_hash,'participant','active'),
(11,'Hassan Tariq','hassan@nu.edu.pk',@dev_hash,'participant','active'),
(12,'Mariam Sheikh','mariam@nu.edu.pk',@dev_hash,'participant','active'),
(13,'Ali Raza','ali.raza@nu.edu.pk',@dev_hash,'participant','active'),
(14,'Fatima Noor','fatima.noor@nu.edu.pk',@dev_hash,'participant','active'),
(15,'Usman Ali','usman.ali@nu.edu.pk',@dev_hash,'participant','active'),
(16,'Noor Fatima','noor.fatima@nu.edu.pk',@dev_hash,'participant','active'),
(17,'Saad Khan','saad.khan@nu.edu.pk',@dev_hash,'participant','active'),
(18,'Areeba Tariq','areeba.tariq@nu.edu.pk',@dev_hash,'participant','active'),
(19,'Daniyal Akram','daniyal.akram@nu.edu.pk',@dev_hash,'participant','active'),
(20,'Mahnoor Aziz','mahnoor.aziz@nu.edu.pk',@dev_hash,'participant','active'),
(21,'Ahmad Farooq','ahmad.farooq@nu.edu.pk',@dev_hash,'participant','active'),
(22,'Laiba Hassan','laiba.hassan@nu.edu.pk',@dev_hash,'participant','active'),
(23,'Rayyan Siddiqui','rayyan.siddiqui@nu.edu.pk',@dev_hash,'participant','active'),
(24,'Eman Zahid','eman.zahid@nu.edu.pk',@dev_hash,'participant','active'),
(25,'Kashif Ilyas','kashif.ilyas@nu.edu.pk',@dev_hash,'participant','active'),
(26,'Anaya Butt','anaya.butt@nu.edu.pk',@dev_hash,'participant','active'),
(27,'Mustafa Baig','mustafa.baig@nu.edu.pk',@dev_hash,'participant','active'),
(28,'Iqra Saleem','iqra.saleem@nu.edu.pk',@dev_hash,'participant','active'),
(29,'Shayan Mir','shayan.mir@nu.edu.pk',@dev_hash,'participant','active'),
(30,'Amina Yousaf','amina.yousaf@nu.edu.pk',@dev_hash,'participant','active'),
(31,'Fahad Nadeem','fahad.nadeem@nu.edu.pk',@dev_hash,'participant','active'),
(32,'Kinza Aslam','kinza.aslam@nu.edu.pk',@dev_hash,'participant','active'),
(33,'Huzaifa Shah','huzaifa.shah@nu.edu.pk',@dev_hash,'participant','active'),
(34,'Sadia Malik','sadia.malik@nu.edu.pk',@dev_hash,'participant','active'),
(35,'Rafay Akhtar','rafay.akhtar@nu.edu.pk',@dev_hash,'participant','active'),
(36,'Nimra Jamil','nimra.jamil@nu.edu.pk',@dev_hash,'participant','active'),
(37,'Arham Gill','arham.gill@nu.edu.pk',@dev_hash,'participant','active'),
(38,'Maham Rauf','maham.rauf@nu.edu.pk',@dev_hash,'participant','active'),
(39,'Waleed Asif','waleed.asif@nu.edu.pk',@dev_hash,'participant','active'),
(40,'Hania Tariq','hania.tariq@nu.edu.pk',@dev_hash,'participant','active'),
(41,'Talha Rehman','talha.rehman@nu.edu.pk',@dev_hash,'participant','active'),
(42,'Saira Latif','saira.latif@nu.edu.pk',@dev_hash,'participant','active'),
(43,'Muneeb Anwar','muneeb.anwar@nu.edu.pk',@dev_hash,'participant','active'),
(44,'Alina Qadir','alina.qadir@nu.edu.pk',@dev_hash,'participant','active'),
(45,'Dawood Sami','dawood.sami@nu.edu.pk',@dev_hash,'participant','active'),
(46,'Mehak Iqbal','mehak.iqbal@nu.edu.pk',@dev_hash,'participant','active'),
(47,'Sameer Zafar','sameer.zafar@nu.edu.pk',@dev_hash,'participant','active'),
(48,'Rida Kamal','rida.kamal@nu.edu.pk',@dev_hash,'participant','active'),
(49,'Haroon Niaz','haroon.niaz@nu.edu.pk',@dev_hash,'participant','active'),
(50,'Sehrish Khan','sehrish.khan@nu.edu.pk',@dev_hash,'participant','active'),
(51,'Yasir Mehmood','yasir.mehmood@nu.edu.pk',@dev_hash,'participant','active'),
(52,'Saba Imran','saba.imran@nu.edu.pk',@dev_hash,'participant','active'),
(53,'Adeel Shahid','adeel.shahid@nu.edu.pk',@dev_hash,'participant','active'),
(54,'Misha Naveed','misha.naveed@nu.edu.pk',@dev_hash,'participant','active'),
(55,'Ibrahim Qasim','ibrahim.qasim@nu.edu.pk',@dev_hash,'participant','active'),
(56,'Nashit Raza','nashit.raza@nu.edu.pk',@dev_hash,'participant','active'),
(57,'Dr. Faraz Mahmood','faraz@nu.edu.pk',@dev_hash,'judge','active'),
(58,'Prof. Naila Hashmi','naila@nu.edu.pk',@dev_hash,'judge','active'),
(59,'Dr. Salman Wasti','salman.wasti@nu.edu.pk',@dev_hash,'judge','active'),
(60,'Abeer Kazmi','abeer.kazmi@industry.pk',@dev_hash,'judge','active'),
(61,'Dr. Mahwish Arif','mahwish.arif@nu.edu.pk',@dev_hash,'judge','active'),
(62,'Rohail Ansari','rohail.ansari@industry.pk',@dev_hash,'judge','active'),
(63,'Dr. Anum Faisal','anum.faisal@nu.edu.pk',@dev_hash,'judge','active'),
(64,'Sarmad Aziz','sarmad.aziz@industry.pk',@dev_hash,'judge','active'),
(65,'Systems Limited','patrons@systemsltd.com',@dev_hash,'sponsor','active'),
(66,'10Pearls','give@10pearls.com',@dev_hash,'sponsor','active'),
(67,'Afiniti','marketing@afiniti.com',@dev_hash,'sponsor','active'),
(68,'Devsinc','events@devsinc.com',@dev_hash,'sponsor','active'),
(69,'NETSOL Technologies','community@netsoltech.com',@dev_hash,'sponsor','active'),
(70,'Arbisoft','campus@arbisoft.com',@dev_hash,'sponsor','active');

INSERT INTO venues (venue_id, venue_name, capacity, facilities, location) VALUES
(1,'CS Auditorium',400,'Projector, stage, sound system, Wi-Fi','FAST Lahore Main Campus'),
(2,'EE Hall A',200,'Projector, seating, podium','Electrical Engineering Block'),
(3,'New Building Lab 1',80,'High-end PCs, wired internet, judge station','New Academic Block'),
(4,'Sports Complex',300,'Gaming arena, booths, seating','Sports Complex');

INSERT INTO events (event_id, event_name, description, category, event_date, max_participants, registered_participants, venue_id, organizer_id, registration_fee) VALUES
(1,'Speed Programming','ICPC-style algorithm sprint.','Tech Events','2026-06-01',80,0,3,2,1500.00),
(2,'SOFTEC Hackathon','Thirty-six hour product build challenge.','Tech Events','2026-06-02',200,0,1,2,4000.00),
(3,'AI Model Showdown','Applied ML competition with live demos.','Tech Events','2026-06-03',100,0,2,3,2500.00),
(4,'Cyber Security Capture The Flag','Blue team and red team security challenges.','Tech Events','2026-06-04',120,0,3,3,2000.00),
(5,'Web Engineering Sprint','Frontend and backend sprint build.','Tech Events','2026-06-05',80,0,2,4,1800.00),
(6,'Business Plan Showdown','Pitch a venture to investors and faculty.','Business Competitions','2026-06-06',60,0,1,4,2500.00),
(7,'Marketing Mavericks','Live campaign strategy challenge.','Business Competitions','2026-06-07',70,0,2,5,2000.00),
(8,'Startup Expo','Prototype exhibition and jury walk-through.','Business Competitions','2026-06-08',100,0,1,5,3000.00),
(9,'Case Study Challenge','Solve a strategic business case.','Business Competitions','2026-06-09',80,0,2,6,1800.00),
(10,'Finance Guru','Corporate finance and valuation contest.','Business Competitions','2026-06-10',70,0,1,6,1200.00),
(11,'Valorant Championship','Team FPS tournament.','Gaming Tournaments','2026-06-11',80,0,4,2,3000.00),
(12,'Tekken Solo Tournament','Solo fighting game bracket.','Gaming Tournaments','2026-06-12',64,0,4,3,1000.00),
(13,'FIFA Cup','Console football tournament.','Gaming Tournaments','2026-06-13',64,0,4,4,1000.00),
(14,'DOTA 2 Clash','Five-player MOBA tournament.','Gaming Tournaments','2026-06-14',100,0,4,5,3500.00),
(15,'PUBG Mobile Arena','Squad mobile esports event.','Gaming Tournaments','2026-06-15',120,0,4,6,2500.00),
(16,'Photography Salon','Juried photography exhibition.','General Events','2026-06-16',300,0,1,2,800.00),
(17,'AI Ethics Symposium','Panel and moderated debate.','General Events','2026-06-17',200,0,2,3,500.00),
(18,'Tech Talk Series','Industry talks and networking.','General Events','2026-06-18',250,0,1,4,0.00),
(19,'Closing Concert','Festival closing ceremony and concert.','General Events','2026-06-19',300,0,4,5,1500.00),
(20,'Robotics Showcase','Student robotics demonstration.','General Events','2026-06-20',150,0,2,6,1000.00);

INSERT INTO judges (judge_id, name, email, contact) VALUES
(1,'Dr. Faraz Mahmood','faraz@nu.edu.pk','0300-1000001'),
(2,'Prof. Naila Hashmi','naila@nu.edu.pk','0300-1000002'),
(3,'Dr. Salman Wasti','salman.wasti@nu.edu.pk','0300-1000003'),
(4,'Abeer Kazmi','abeer.kazmi@industry.pk','0300-1000004'),
(5,'Dr. Mahwish Arif','mahwish.arif@nu.edu.pk','0300-1000005'),
(6,'Rohail Ansari','rohail.ansari@industry.pk','0300-1000006'),
(7,'Dr. Anum Faisal','anum.faisal@nu.edu.pk','0300-1000007'),
(8,'Sarmad Aziz','sarmad.aziz@industry.pk','0300-1000008');

INSERT INTO event_judges (event_id, judge_id) VALUES
(1,1),(1,3),(2,1),(2,4),(3,5),(4,6),(6,2),(6,4),(7,2),(8,4),(9,7),(10,2),(16,8),(17,5),(20,7);

INSERT INTO sponsors (sponsor_id, company_name, contact_person, email, phone, sponsorship_level, amount, user_id) VALUES
(1,'Systems Limited','Nadia Qureshi','patrons@systemsltd.com','042-111-000-001','Gold',2500000.00,65),
(2,'10Pearls','Asim Malik','give@10pearls.com','042-111-000-002','Gold',1500000.00,66),
(3,'Afiniti','Sara Raza','marketing@afiniti.com','042-111-000-003','Silver',1000000.00,67),
(4,'Devsinc','Bilal Tariq','events@devsinc.com','042-111-000-004','Silver',750000.00,68),
(5,'NETSOL Technologies','Hania Asif','community@netsoltech.com','042-111-000-005','Bronze',500000.00,69),
(6,'Arbisoft','Hamid Khan','campus@arbisoft.com','042-111-000-006','Bronze',450000.00,70);

INSERT INTO sponsorships (sponsor_id, user_id, event_id, sponsorship_type, amount, status) VALUES
(1,65,2,'Title',1200000.00,'confirmed'),
(1,65,1,'Gold',500000.00,'confirmed'),
(2,66,3,'Gold',450000.00,'confirmed'),
(2,66,5,'Silver',250000.00,'confirmed'),
(3,67,6,'Gold',400000.00,'confirmed'),
(3,67,7,'Silver',200000.00,'pending'),
(4,68,11,'Gold',350000.00,'confirmed'),
(4,68,12,'Silver',150000.00,'confirmed'),
(5,69,16,'Silver',125000.00,'pending'),
(6,70,20,'Silver',100000.00,'confirmed');

INSERT INTO accommodations (accommodation_id, room_type, capacity, price_per_night, available_rooms) VALUES
(1,'Single',1,4500.00,6),
(2,'Double',2,2500.00,24),
(3,'Triple',3,2000.00,15),
(4,'Quad',4,1500.00,12),
(5,'Double',2,3000.00,8);

INSERT INTO payments (payment_id, user_id, event_id, amount, payment_type, status, payment_date) VALUES
(1,7,1,1500.00,'registration','completed','2026-05-01 10:00:00'),
(2,7,2,4000.00,'registration','completed','2026-05-02 10:00:00'),
(3,8,1,1500.00,'registration','completed','2026-05-03 10:00:00'),
(4,9,1,1500.00,'registration','completed','2026-05-04 10:00:00'),
(5,10,1,1500.00,'registration','completed','2026-05-05 10:00:00'),
(6,11,1,1500.00,'registration','completed','2026-05-06 10:00:00'),
(7,12,1,1500.00,'registration','completed','2026-05-07 10:00:00'),
(8,13,2,4000.00,'registration','completed','2026-05-08 10:00:00'),
(9,14,2,4000.00,'registration','completed','2026-05-09 10:00:00'),
(10,15,3,2500.00,'registration','completed','2026-05-10 10:00:00'),
(11,16,3,2500.00,'registration','completed','2026-05-11 10:00:00'),
(12,17,6,2500.00,'registration','completed','2026-05-12 10:00:00'),
(13,18,6,2500.00,'registration','completed','2026-05-13 10:00:00'),
(14,19,11,3000.00,'registration','completed','2026-05-14 10:00:00'),
(15,20,16,800.00,'registration','completed','2026-05-15 10:00:00'),
(16,21,7,2000.00,'registration','pending','2026-05-16 10:00:00'),
(17,22,8,3000.00,'registration','pending','2026-05-17 10:00:00'),
(18,23,12,1000.00,'registration','pending','2026-05-18 10:00:00'),
(19,24,13,1000.00,'registration','failed','2026-05-19 10:00:00'),
(20,25,14,3500.00,'registration','failed','2026-05-20 10:00:00'),
(21,7,NULL,5000.00,'accommodation','completed','2026-05-21 10:00:00'),
(22,8,NULL,5000.00,'accommodation','completed','2026-05-22 10:00:00'),
(23,9,NULL,3000.00,'accommodation','pending','2026-05-23 10:00:00'),
(24,65,2,1200000.00,'sponsorship','completed','2026-05-24 10:00:00'),
(25,66,3,450000.00,'sponsorship','completed','2026-05-25 10:00:00'),
(26,67,6,400000.00,'sponsorship','completed','2026-05-26 10:00:00'),
(27,68,11,350000.00,'sponsorship','completed','2026-05-27 10:00:00'),
(28,69,16,125000.00,'sponsorship','pending','2026-05-28 10:00:00'),
(29,70,20,100000.00,'sponsorship','completed','2026-05-29 10:00:00'),
(30,10,NULL,4500.00,'accommodation','failed','2026-05-30 10:00:00');

UPDATE events e
SET registered_participants = (
  SELECT COUNT(*)
  FROM participants p
  WHERE p.event_id = e.event_id
);

INSERT INTO user_accommodations (user_id, accommodation_id, booked_at, check_in, check_out) VALUES
(7,2,'2026-05-21 11:00:00','2026-06-01','2026-06-04'),
(8,2,'2026-05-22 11:00:00','2026-06-01','2026-06-04');

INSERT INTO teams (team_id, team_name, event_id) VALUES
(1,'ByteForce',2),
(2,'Solo Stack',1),
(3,'Pitch Perfect',6);

INSERT INTO team_members (team_id, user_id, role) VALUES
(1,7,'captain'),(1,13,'member'),(1,14,'member'),
(2,11,'captain'),
(3,17,'captain'),(3,18,'member');

INSERT INTO event_rounds (event_id, round_type, round_date, venue_id, status) VALUES
(1,'Prelims','2026-05-28 10:00:00',3,'scheduled'),
(1,'Finals','2026-06-01 09:00:00',3,'scheduled'),
(2,'Prelims','2026-06-02 18:00:00',1,'scheduled'),
(2,'Semi-Finals','2026-06-03 12:00:00',1,'scheduled'),
(2,'Finals','2026-06-04 09:00:00',1,'scheduled'),
(6,'Prelims','2026-06-05 10:00:00',1,'scheduled'),
(6,'Finals','2026-06-06 14:00:00',1,'scheduled');

INSERT INTO judging (event_id, judge_id, participant_id, score, comments) VALUES
(1,1,1,9.30,'Excellent algorithmic thinking.'),
(1,3,1,9.10,'Clean and fast solution.'),
(1,1,3,8.70,'Strong performance.'),
(1,3,3,8.90,'Good optimization.'),
(1,1,4,8.40,'Solid attempt.'),
(1,3,4,8.10,'Minor edge case issues.'),
(1,1,5,9.60,'Outstanding result.'),
(1,3,5,9.40,'Very polished.'),
(1,1,6,8.80,'Consistent scoring.'),
(1,3,6,8.50,'Good work.'),
(2,1,2,9.00,'Compelling prototype.'),
(2,4,2,9.20,'Strong product direction.'),
(2,1,8,8.30,'Useful idea.'),
(2,4,8,8.00,'Needs business clarity.'),
(6,2,12,8.60,'Strong pitch and market sizing.');
