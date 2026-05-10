# ERD Description

This file provides a complete textual ERD description. The DBML block can be pasted into dbdiagram.io to generate the diagram. It also works as a relationship checklist for drawing in draw.io.

## DBML

```dbml
Table users {
  user_id int [pk, increment]
  name varchar(120) [not null]
  email varchar(160) [not null, unique]
  password_hash varchar(255) [not null]
  role enum('admin','participant','organizer','judge','sponsor') [not null]
  status enum('active','inactive') [not null, default: 'active']
  created_at timestamp [not null]
  last_payment_date date
}

Table venues {
  venue_id int [pk, increment]
  venue_name varchar(120) [not null]
  capacity int [not null]
  facilities text
  location varchar(180) [not null]
}

Table events {
  event_id int [pk, increment]
  event_name varchar(160) [not null]
  description text
  category enum('Tech Events','Business Competitions','Gaming Tournaments','General Events') [not null]
  event_date date [not null]
  max_participants int [not null]
  registered_participants int [not null, default: 0]
  venue_id int
  organizer_id int
  registration_fee decimal(10,2) [not null, default: 0]
  created_at timestamp [not null]
  indexes {
    (venue_id, event_date) [unique]
  }
}

Table participants {
  participant_id int [pk, increment]
  user_id int [not null]
  event_id int [not null]
  registration_date timestamp [not null]
  indexes {
    (user_id, event_id) [unique]
  }
}

Table judges {
  judge_id int [pk, increment]
  name varchar(120) [not null]
  email varchar(160) [not null, unique]
  contact varchar(80)
}

Table judging {
  judging_id int [pk, increment]
  event_id int [not null]
  judge_id int [not null]
  participant_id int [not null]
  score decimal(4,2) [not null]
  comments text
  judged_at timestamp [not null]
  indexes {
    (event_id, judge_id, participant_id) [unique]
  }
}

Table event_judges {
  event_judge_id int [pk, increment]
  event_id int [not null]
  judge_id int [not null]
  assigned_at timestamp [not null]
  indexes {
    (event_id, judge_id) [unique]
  }
}

Table teams {
  team_id int [pk, increment]
  team_name varchar(120) [not null]
  event_id int [not null]
}

Table team_members {
  team_id int [not null]
  user_id int [not null]
  role varchar(60) [not null]
  indexes {
    (team_id, user_id) [pk]
  }
}

Table event_rounds {
  round_id int [pk, increment]
  event_id int [not null]
  round_type enum('Prelims','Semi-Finals','Finals') [not null]
  round_date datetime [not null]
  venue_id int
  status enum('scheduled','in_progress','completed') [not null, default: 'scheduled']
}

Table sponsors {
  sponsor_id int [pk, increment]
  company_name varchar(160) [not null]
  contact_person varchar(120) [not null]
  email varchar(160) [not null, unique]
  phone varchar(50)
  sponsorship_level enum('Gold','Silver','Bronze') [not null]
  amount decimal(10,2) [not null]
  user_id int
}

Table sponsorships {
  sponsorship_id int [pk, increment]
  sponsor_id int [not null]
  user_id int
  event_id int
  sponsorship_type enum('Gold','Silver','Title') [not null]
  amount decimal(10,2) [not null]
  status enum('pending','confirmed','cancelled') [not null, default: 'pending']
}

Table payments {
  payment_id int [pk, increment]
  user_id int [not null]
  event_id int
  amount decimal(10,2) [not null]
  payment_type enum('registration','accommodation','sponsorship') [not null]
  status enum('pending','completed','failed') [not null, default: 'pending']
  payment_date timestamp [not null]
  indexes {
    (user_id, event_id, payment_type) [unique]
  }
}

Table accommodations {
  accommodation_id int [pk, increment]
  room_type enum('Single','Double','Triple','Quad') [not null]
  capacity int [not null]
  price_per_night decimal(10,2) [not null]
  available_rooms int [not null]
}

Table user_accommodations {
  user_id int [not null]
  accommodation_id int [not null]
  booked_at timestamp [not null]
  check_in date [not null]
  check_out date [not null]
  indexes {
    (user_id, accommodation_id, booked_at) [pk]
  }
}

Table reminders {
  reminder_id int [pk, increment]
  user_id int [not null]
  event_id int [not null]
  reminder_date date [not null]
  message text [not null]
  sent boolean [not null, default: false]
  indexes {
    (user_id, event_id, reminder_date) [unique]
  }
}

Table role_permissions {
  id int [pk, increment]
  role varchar(40) [not null, unique]
  permissions json [not null]
  updated_at timestamp [not null]
  audit_metadata json
}

Ref: events.venue_id > venues.venue_id [delete: set null, update: cascade]
Ref: events.organizer_id > users.user_id [delete: set null, update: cascade]
Ref: participants.user_id > users.user_id [delete: cascade, update: cascade]
Ref: participants.event_id > events.event_id [delete: cascade, update: cascade]
Ref: judging.event_id > events.event_id [delete: cascade, update: cascade]
Ref: judging.judge_id > judges.judge_id [delete: cascade, update: cascade]
Ref: judging.participant_id > participants.participant_id [delete: cascade, update: cascade]
Ref: event_judges.event_id > events.event_id [delete: cascade, update: cascade]
Ref: event_judges.judge_id > judges.judge_id [delete: cascade, update: cascade]
Ref: teams.event_id > events.event_id [delete: cascade, update: cascade]
Ref: team_members.team_id > teams.team_id [delete: cascade, update: cascade]
Ref: team_members.user_id > users.user_id [delete: cascade, update: cascade]
Ref: event_rounds.event_id > events.event_id [delete: cascade, update: cascade]
Ref: event_rounds.venue_id > venues.venue_id [delete: set null, update: cascade]
Ref: sponsors.user_id > users.user_id [delete: set null, update: cascade]
Ref: sponsorships.sponsor_id > sponsors.sponsor_id [delete: cascade, update: cascade]
Ref: sponsorships.user_id > users.user_id [delete: set null, update: cascade]
Ref: sponsorships.event_id > events.event_id [delete: set null, update: cascade]
Ref: payments.user_id > users.user_id [delete: cascade, update: cascade]
Ref: payments.event_id > events.event_id [delete: set null, update: cascade]
Ref: user_accommodations.user_id > users.user_id [delete: cascade, update: cascade]
Ref: user_accommodations.accommodation_id > accommodations.accommodation_id [delete: cascade, update: cascade]
Ref: reminders.user_id > users.user_id [delete: cascade, update: cascade]
Ref: reminders.event_id > events.event_id [delete: cascade, update: cascade]
```

## Relationship Summary

- One user can organize many events.
- One venue can host many events, but only one event per venue per date.
- One participant user can register for many events through `participants`.
- One event can have many participants.
- One event can have many judges through `event_judges`.
- One judge can judge many participants through `judging`.
- One event can have many teams; one team can have many users through `team_members`.
- One event can have Prelims, Semi-Finals, and Finals through `event_rounds`.
- One sponsor user can have a sponsor profile in `sponsors`.
- One sponsor can support many events through `sponsorships`.
- One user can make many payments; registration payments can be tied to events.
- One user can book many accommodations through `user_accommodations`.
- One event can generate many reminders for registered users.
- `role_permissions` stores application-level RBAC permissions as JSON.

