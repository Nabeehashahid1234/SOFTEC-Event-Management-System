# Backend Schema Migration Guide

## Overview

This document describes the complete schema redesign of the SOFTEC Event Management System backend. The migration introduces a normalized database structure that separates concerns, improves data integrity, and aligns with modern best practices.

## Key Changes

### 1. Removed Tables

- **`participants`** - Data now directly in `registrations` with `user_id` field
- **`judges`** - Judges are now users with `role='judge'` and tracked in `judge_assignments`
- **`sponsor_events`** - Replaced with `sponsorships` table for direct event sponsorship tracking
- **`rounds`** - Renamed to `event_rounds` for clarity

### 2. New Tables

#### `registrations` (Replaces `participants`)

Tracks user participation in events with payment status.

```sql
CREATE TABLE registrations (
  registration_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id),
  UNIQUE KEY unique_user_event (user_id, event_id)
)
```

#### `payments` (Replaces legacy payment tracking)

Unified payment tracking for registrations and sponsorships.

```sql
CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  registration_id INT,
  event_id INT,
  sponsor_id INT,
  amount DECIMAL(10,2) NOT NULL,
  payment_type ENUM('registration', 'sponsorship') DEFAULT 'registration',
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (registration_id) REFERENCES registrations(registration_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id),
  FOREIGN KEY (sponsor_id) REFERENCES sponsors(sponsor_id)
)
```

#### `judge_assignments` (Replaces legacy judge tracking)

Explicit event-to-judge assignments with status tracking.

```sql
CREATE TABLE judge_assignments (
  assignment_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  judge_id INT NOT NULL,
  active TINYINT(1) DEFAULT 1,
  assigned_by INT,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(event_id),
  FOREIGN KEY (judge_id) REFERENCES users(user_id),
  UNIQUE KEY unique_event_judge (event_id, judge_id)
)
```

#### `event_rounds` (Renamed from `rounds`)

Replaces the `rounds` table with explicit naming and better structure.

```sql
CREATE TABLE event_rounds (
  round_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  round_type VARCHAR(100) NOT NULL,
  round_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  status ENUM('scheduled', 'ongoing', 'completed') DEFAULT 'scheduled',
  venue_id INT,
  FOREIGN KEY (event_id) REFERENCES events(event_id),
  FOREIGN KEY (venue_id) REFERENCES venues(venue_id)
)
```

#### `sponsorships` (Replaces `sponsor_events`)

Direct event sponsorship tracking with monetary amounts and status.

```sql
CREATE TABLE sponsorships (
  sponsorship_id INT AUTO_INCREMENT PRIMARY KEY,
  sponsor_id INT NOT NULL,
  event_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  tier VARCHAR(50),
  status ENUM('pending', 'confirmed', 'completed') DEFAULT 'pending',
  sponsored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sponsor_id) REFERENCES sponsors(sponsor_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id)
)
```

### 3. Updated Tables

#### `events` Table Changes

**Added fields:**

- `assigned_judge_id` - FK to users.user_id (judges)
- `event_status` - ENUM for event lifecycle management
- `prize_pool` - DECIMAL for event prize money
- `sponsorship_total` - Calculated from sponsorships
- `total_prize_pool` - Combined with sponsorship contributions

**Removed fields:**

- `organizer_name` (use organizer_id → users)
- Legacy judge/participant references

#### `users` Table (No structural changes)

Role-based access control:

- `role='judge'` - Can be assigned to events
- `role='organizer'` - Can create events
- `role='sponsor'` - Can sponsor events
- `role='participant'` - Can register for events
- `role='admin'` - Full system access

### 4. Database Views

#### `vw_event_leaderboard`

Displays ranking for participants in events based on judge scores.

#### `vw_judge_workload`

Shows active judge assignments and pending evaluations.

#### `vw_sponsorship_totals`

Aggregates sponsorship amounts by event and sponsor.

## Migration Path

### Old Architecture

```
participants → events ← judge_events ← judges
           ↓
        payments
           ↑
     sponsor_events → sponsors
```

### New Architecture

```
users (role-based)
  ├── participants (registrations) → events
  ├── judges (judge_assignments) → events
  ├── sponsors (sponsorships) → events
  └── payments (unified)
```

## Backend Integration

### Event Service (`backend/services/event.service.js`)

New service layer for consistent event operations:

```javascript
// Create event with auto-judge assignment
await createEvent({
  event_name, category, organizer_id, max_participants, ...
}, autoAssignJudge=true);

// Auto-assign best available judge
await autoAssignJudge(eventId, assignedBy);

// Check venue conflicts
await checkVenueConflict({venue_id, event_date, start_time, end_time});

// Refresh event status
await refreshEventStatus(eventId);

// Calculate prize pool
await calculatePrizePool(eventId);
```

### API Routes

#### Event Routes (`backend/routes/events.routes.js`)

- **GET /events** - List all events with registrations, judge info
- **GET /events/:id** - Detailed event info with judge, registrations, sponsorships
- **POST /events** - Create event (auto-assigns judge)
- **PATCH /events/:id** - Update event fields and status
- **DELETE /events/:id** - Soft delete event

#### Dashboard Routes (`backend/routes/dashboard.routes.js`)

Role-specific views:

- **GET /dashboard/admin** - System KPIs, user distribution
- **GET /dashboard/participant** - My events, registrations, payments
- **GET /dashboard/judge** - Assigned events, scores, leaderboards
- **GET /dashboard/organizer** - Owned events, registrations, venues
- **GET /dashboard/sponsor** - Sponsored events, contributions, reach

## Setting Up

### 1. Create Database

```bash
npm run setup:db
```

### 2. Validate Schema

```bash
npm run validate:schema
```

### 3. Start Backend

```bash
npm run dev
```

## Query Examples

### Get user's registered events

```sql
SELECT e.* FROM events e
JOIN registrations r ON r.event_id = e.event_id
WHERE r.user_id = ? AND r.status = 'confirmed'
```

### Get assigned judges for event

```sql
SELECT u.* FROM users u
JOIN judge_assignments ja ON ja.judge_id = u.user_id
WHERE ja.event_id = ? AND ja.active = 1
```

### Get event sponsorships

```sql
SELECT sp.* FROM sponsorships sp
WHERE sp.event_id = ? AND sp.status = 'confirmed'
ORDER BY sp.amount DESC
```

### Get pending payments

```sql
SELECT p.* FROM payments p
WHERE p.status = 'pending'
ORDER BY p.created_at DESC
```

## Frontend Updates Required

### API Response Changes

**Before:**

```javascript
// Legacy participants table structure
{
  participant_id: 123,
  event_id: 456,
  payment_status: "completed"
}
```

**After:**

```javascript
// New registrations structure
{
  registration_id: 789,
  user_id: 123,
  event_id: 456,
  status: "confirmed",
  registered_at: "2024-01-15T10:30:00Z"
}
```

### Hook Updates

- `useEvents.ts` - Update to handle new registration schema
- `useDashboard.ts` - Update participant/judge/organizer endpoints
- `useAuth.ts` - Ensure role-based routing works with new structure

## Indexes for Performance

Key indexes created:

- `idx_users_email` - User lookup
- `idx_users_role` - Role filtering
- `idx_events_organizer` - Organizer's events
- `idx_events_category` - Category filtering
- `idx_registrations_user` - User's registrations
- `idx_registrations_event` - Event registrations
- `idx_judge_assignments_judge` - Judge's assignments
- `idx_payments_user` - User's payments
- `idx_sponsorships_event` - Event sponsorships

## Common Operations

### Register user for event

```javascript
// 1. Create registration
INSERT INTO registrations (user_id, event_id, status) VALUES (?, ?, 'pending');

// 2. Create payment record
INSERT INTO payments (user_id, registration_id, event_id, amount, status)
VALUES (?, ?, ?, ?, 'pending');

// 3. Update registration after payment
UPDATE registrations SET status = 'confirmed' WHERE registration_id = ?;
```

### Assign judge to event

```javascript
// 1. Update event judge reference
UPDATE events SET assigned_judge_id = ? WHERE event_id = ?;

// 2. Create assignment record
INSERT INTO judge_assignments (event_id, judge_id, assigned_by)
VALUES (?, ?, ?);
```

### Track sponsorship

```javascript
INSERT INTO sponsorships (sponsor_id, event_id, amount, tier, status)
VALUES (?, ?, ?, ?, 'pending');
```

## Troubleshooting

### Foreign Key Constraints

If you encounter foreign key errors:

1. Ensure referenced tables are created first
2. Check column types match between FK and referenced column
3. Run `FOREIGN_KEY_CHECKS=0` during migration if needed

### Connection Issues

1. Verify `.env` database credentials
2. Check MySQL is running: `mysql -u root -p`
3. Test connection: `npm run check:db`

### Schema Issues

1. Run validation: `npm run validate:schema`
2. Check error logs for specific table/column issues
3. Drop and recreate: `npm run setup:db`

## Performance Notes

- Registrations query is optimized with compound indexes
- Judge workload calculation uses LEFT JOINs to handle unassigned judges
- Sponsorship aggregation is pre-calculated in views
- Payment status tracking allows quick revenue reporting

## Future Enhancements

- Add audit logs for all changes
- Implement soft deletes for data retention
- Add event_status workflow automation
- Create real-time notification system
- Add performance metrics and caching
