# SOFTEC Event Management System

Database Systems course project for FAST-NUCES.

Team:

- Name 1 / Roll No.
- Name 2 / Roll No.
- Name 3 / Roll No.

Course:

- Database Systems
- FAST-NUCES
- SOFTEC Event Management System

## Tech Stack

Frontend:

- React 19
- TypeScript
- Vite
- TanStack Start / TanStack Router
- Tailwind CSS
- shadcn/ui and Radix UI
- TanStack React Query
- Recharts
- Sonner

Backend:

- Node.js
- Express.js
- MySQL 8.x
- `mysql2/promise`
- JWT authentication
- bcrypt password hashing
- Raw SQL, no ORM

Database:

- MySQL 8.x
- Normalized relational schema
- Foreign keys, constraints, indexes
- Triggers
- Stored procedures
- Views
- Event scheduler
- Role-based permissions

## Architecture

```text
┌────────────────────────────────────────────────────────────┐
│ React + TypeScript Frontend                                │
│ TanStack Router, React Query, Tailwind, shadcn/ui           │
└──────────────────────────┬─────────────────────────────────┘
                           │ HTTP JSON + JWT
┌──────────────────────────▼─────────────────────────────────┐
│ Node.js + Express Backend                                  │
│ Routes, Controllers, Auth Middleware, RBAC, Validators      │
└──────────────────────────┬─────────────────────────────────┘
                           │ mysql2/promise raw SQL
┌──────────────────────────▼─────────────────────────────────┐
│ MySQL 8 Database                                            │
│ Tables, FKs, Indexes, Triggers, Procedures, Views, DCL       │
└────────────────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Database

Create and seed the database:

```powershell
mysql -u root -p < backend/database/schema.sql && mysql -u root -p softec_db < backend/database/triggers.sql && mysql -u root -p softec_db < backend/database/procedures.sql && mysql -u root -p softec_db < backend/database/views.sql && mysql -u root -p softec_db < backend/database/events_scheduler.sql && mysql -u root -p softec_db < backend/database/dcl_permissions.sql && mysql -u root -p softec_db < backend/database/seed.sql
```

Note: `events_scheduler.sql` enables the MySQL event scheduler and may require a privileged MySQL user.

### 2. Backend

Expected backend setup:

```powershell
cd backend
npm install
npm run dev
```

Backend environment variables:

```text
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=softec_db
JWT_SECRET=replace_with_long_secret
FRONTEND_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 3. Frontend

```powershell
npm install
npm run dev
```

Frontend environment:

```text
VITE_API_URL=http://localhost:5000
```

## Test Credentials

All seeded users use the development password:

```text
softec2026
```

| Role | Email |
| --- | --- |
| Admin | `aisha@softec.org` |
| Organizer | `sana@softec.org` |
| Participant | `bilal@nu.edu.pk` |
| Judge | `faraz@nu.edu.pk` |
| Sponsor | `patrons@systemsltd.com` |

## Features Mapped To Course Requirements

| Requirement | Implementation |
| --- | --- |
| 3NF/BCNF relational design | `backend/database/schema.sql` |
| Primary keys and foreign keys | All core tables in `schema.sql` |
| Referential integrity | `ON DELETE CASCADE` and `ON DELETE SET NULL` constraints |
| Constraints | ENUMs, UNIQUE constraints, CHECK constraints |
| Indexing | User, role, category, date, participant, judging, payment indexes |
| SQL joins | `backend/database/QUERIES_DEMO.sql`, report endpoints |
| Subqueries | `QUERIES_DEMO.sql` |
| GROUP BY and HAVING | Reports and views |
| ACID transactions | Stored procedures and booking/payment operations |
| Triggers | `backend/database/triggers.sql` |
| Stored procedures | `backend/database/procedures.sql` |
| Views | `backend/database/views.sql` |
| DCL / RBAC | `backend/database/dcl_permissions.sql` |
| Event scheduler | `backend/database/events_scheduler.sql` |
| MS Access component | `backend/database/ms_access_guide.md` |
| ER diagram | `backend/database/ERD_description.md` |
| API testing | `backend/postman_collection.json` |
| Deployment notes | `backend/DEPLOYMENT.md` |

## Six Graded SQL Queries

1. Event Participation  
   Uses `LEFT JOIN`, `GROUP BY`, `COUNT`, and `ORDER BY` to count registrations for every event, including events with no participants.

2. High-Quality Events  
   Uses `INNER JOIN`, `GROUP BY`, `AVG`, and `HAVING > 7.5` to identify events with strong judge scores.

3. Sponsorship Funds  
   Uses joins and `SUM` to calculate confirmed sponsor contributions by sponsor.

4. Participant Logistics  
   Uses multiple joins and `COALESCE` to combine participant registrations, payments, and accommodation status.

5. Venue Utilization  
   Uses `LEFT JOIN`, `GROUP BY`, and `COUNT` to show how often each venue is used.

6. Leaderboard  
   Uses joins, `AVG`, sorting, and `LIMIT 10` to show top event participants.

Full annotated SQL is in:

```text
backend/database/QUERIES_DEMO.sql
```

## Advanced Database Features

Triggers:

- `prevent_venue_conflict`
- `prevent_venue_conflict_update`
- `auto_register_participant`
- `before_role_permissions_update`

Stored procedures:

- `sp_register_team`
- `sp_schedule_event_rounds`
- `sp_get_leaderboard`
- `sp_generate_event_reminders`
- `sp_process_refund`

Views:

- `venue_utilization_stats`
- `event_statistics`
- `sponsor_summary`
- `participant_logistics`
- `revenue_breakdown`
- `high_quality_events`
- `upcoming_events`
- `judge_workload`

Scheduler:

- `ev_generate_event_reminders_daily`

RBAC:

- MySQL roles in `dcl_permissions.sql`
- Application-level `role_permissions` JSON entries

## API Endpoint Reference

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Users:

- `GET /api/users`
- `GET /api/users/:id`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`

Events:

- `GET /api/events`
- `GET /api/events/:id`
- `POST /api/events`
- `PATCH /api/events/:id`
- `DELETE /api/events/:id`
- `POST /api/events/:id/rounds`
- `POST /api/events/:id/judges`
- `GET /api/events/:id/leaderboard`

Participants:

- `POST /api/participants/register`
- `GET /api/participants/my-events`
- `DELETE /api/participants/:id`

Teams:

- `POST /api/teams`
- `GET /api/teams/event/:eventId`
- `DELETE /api/teams/:id`

Judging:

- `POST /api/judging`
- `PATCH /api/judging/:id`
- `GET /api/judging/event/:eventId/leaderboard`

Sponsors:

- `GET /api/sponsors`
- `POST /api/sponsors`
- `POST /api/sponsorships`

Payments:

- `POST /api/payments`
- `PATCH /api/payments/:id/status`
- `GET /api/payments/my-history`

Accommodations:

- `GET /api/accommodations`
- `POST /api/accommodations/book`

Reports:

- `GET /api/reports/event-participation`
- `GET /api/reports/high-quality-events`
- `GET /api/reports/sponsorship-funds`
- `GET /api/reports/participant-logistics`
- `GET /api/reports/venue-utilization`
- `GET /api/reports/leaderboard/:eventId`

Dashboard:

- `GET /api/dashboard/admin`
- `GET /api/dashboard/participant`
- `GET /api/dashboard/organizer`
- `GET /api/dashboard/judge`
- `GET /api/dashboard/sponsor`

## Error Handling

The intended API error contract is documented in:

```text
backend/ERROR_HANDLING_AUDIT.md
```

Expected codes:

- `400` validation error
- `401` unauthenticated
- `403` forbidden
- `404` not found
- `409` conflict
- `500` server error

Venue conflict trigger messages include the conflicting event name:

```text
Venue is already booked for this date by event: <event_name>
```

## Screenshots

Add final screenshots here:

```text
[Screenshot: Landing page]
[Screenshot: Login page]
[Screenshot: Admin dashboard]
[Screenshot: Participant dashboard]
[Screenshot: Organizer event creation]
[Screenshot: Judge scoring]
[Screenshot: Sponsor dashboard]
[Screenshot: Reports page]
[Screenshot: MS Access Participant Registration Form]
[Screenshot: MS Access Event Entry Form]
[Screenshot: MS Access Event Participation Summary Report]
```

