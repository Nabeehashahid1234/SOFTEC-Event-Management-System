# MS Access Integration Guide

This guide covers the Microsoft Access component for the SOFTEC Event Management System course submission.

## Prerequisites

- MySQL 8.x server running with `softec_db` imported.
- MySQL ODBC Connector 8.x installed on Windows.
- Microsoft Access installed.
- A MySQL user with permission to read/write the required tables.

Recommended Access DSN name:

```text
SOFTEC_MYSQL
```

## Connect MS Access To MySQL Via ODBC

1. Open Windows Start Menu and search for **ODBC Data Sources (64-bit)**.
2. Open the **System DSN** tab.
3. Click **Add**.
4. Select **MySQL ODBC 8.0 Unicode Driver**.
5. Configure:
   - Data Source Name: `SOFTEC_MYSQL`
   - TCP/IP Server: `localhost`
   - Port: `3306`
   - User: your MySQL user
   - Password: your MySQL password
   - Database: `softec_db`
6. Click **Test** and confirm the connection succeeds.
7. Open Microsoft Access.
8. Create a new blank database named `SOFTEC_Access.accdb`.
9. Go to **External Data > New Data Source > From Other Sources > ODBC Database**.
10. Choose **Link to the data source by creating a linked table**.
11. Select the `SOFTEC_MYSQL` DSN.
12. Link these tables:
    - `users`
    - `events`
    - `venues`
    - `participants`
    - `payments`
    - `event_statistics`
    - `venue_utilization_stats`

Screenshot placeholder:

```text
[Add screenshot: ODBC DSN configuration window]
[Add screenshot: Access linked tables list]
```

## Required Form 1: Participant Registration Form

Purpose: register a participant user for an event and optionally record payment.

### Query Source

Create a saved Access query named `qry_participant_registration_source`:

```sql
SELECT
  users.user_id,
  users.name,
  users.email,
  events.event_id,
  events.event_name,
  events.event_date,
  events.registration_fee
FROM users, events
WHERE users.role = 'participant'
ORDER BY users.name, events.event_date;
```

### Form Steps

1. Go to **Create > Form Design**.
2. Set the form Record Source to `qry_participant_registration_source`.
3. Add combo boxes:
   - `cboParticipant`
     - Row Source: `SELECT user_id, name, email FROM users WHERE role='participant' ORDER BY name;`
     - Bound Column: `1`
     - Column Count: `3`
   - `cboEvent`
     - Row Source: `SELECT event_id, event_name, event_date, registration_fee FROM events ORDER BY event_date;`
     - Bound Column: `1`
     - Column Count: `4`
4. Add text boxes:
   - `txtAmount`
   - `txtPaymentStatus`
5. Add command button: `btnRegister`.
6. Button caption: `Register Participant`.
7. Use this button behavior:
   - Insert a row into `payments` with `payment_type='registration'`.
   - If status is `completed`, MySQL trigger `auto_register_participant` inserts into `participants`.
8. Add validation:
   - Participant is required.
   - Event is required.
   - Amount must be non-negative.

Screenshot placeholders:

```text
[Add screenshot: Participant Registration Form design view]
[Add screenshot: Participant Registration Form filled example]
```

## Required Form 2: Event Entry Form

Purpose: allow organizers/admins to create new events while respecting venue/date conflict rules.

### Query Source

Create a saved Access query named `qry_event_entry_source`:

```sql
SELECT
  events.event_id,
  events.event_name,
  events.description,
  events.category,
  events.event_date,
  events.max_participants,
  events.venue_id,
  events.organizer_id,
  events.registration_fee
FROM events;
```

### Form Steps

1. Go to **Create > Form Design**.
2. Set Record Source to `events`.
3. Add fields:
   - `event_name`
   - `description`
   - `category`
   - `event_date`
   - `max_participants`
   - `registration_fee`
4. Add combo box `cboVenue`:
   - Row Source: `SELECT venue_id, venue_name, capacity FROM venues ORDER BY venue_name;`
   - Bound Column: `1`
5. Add combo box `cboOrganizer`:
   - Row Source: `SELECT user_id, name FROM users WHERE role='organizer' ORDER BY name;`
   - Bound Column: `1`
6. Add Save button.
7. On save, Access submits the insert to MySQL.
8. If the selected venue/date is already booked, MySQL trigger `prevent_venue_conflict` raises:

```text
Venue is already booked for this date by event: <event_name>
```

9. Display that message to the user as the validation error.

Screenshot placeholders:

```text
[Add screenshot: Event Entry Form design view]
[Add screenshot: Event Entry Form venue conflict error]
```

## Required Report: Event Participation Summary Report

Purpose: show event participation grouped by category, with participant counts and event date sorting.

### Saved Query

Create a query named `qry_event_participation_summary`:

```sql
SELECT
  events.category,
  events.event_name,
  events.event_date,
  venues.venue_name,
  COUNT(participants.participant_id) AS participant_count
FROM (events
LEFT JOIN participants ON participants.event_id = events.event_id)
LEFT JOIN venues ON venues.venue_id = events.venue_id
GROUP BY
  events.category,
  events.event_name,
  events.event_date,
  venues.venue_name
ORDER BY
  events.category,
  events.event_date;
```

### Report Steps

1. Go to **Create > Report Wizard**.
2. Select `qry_event_participation_summary`.
3. Add fields:
   - `category`
   - `event_name`
   - `event_date`
   - `venue_name`
   - `participant_count`
4. Group by `category`.
5. Sort by `event_date` ascending.
6. Choose tabular layout.
7. Name the report `rpt_event_participation_summary`.
8. Add a report footer with total participant count:
   - Control Source: `=Sum([participant_count])`

Screenshot placeholders:

```text
[Add screenshot: Report Wizard field selection]
[Add screenshot: Event Participation Summary Report preview]
```

