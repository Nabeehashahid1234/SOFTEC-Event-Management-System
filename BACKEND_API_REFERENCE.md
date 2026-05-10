# Backend API Reference - Updated Schema

## Authentication

All endpoints require Bearer token authentication header:

```
Authorization: Bearer <jwt_token>
```

Roles: `admin`, `organizer`, `judge`, `sponsor`, `participant`

---

## Event Routes

### GET /api/events

List all events with filters and aggregated data.

**Query Parameters:**

- `category` (optional) - Filter by event category
- `from` (optional) - ISO8601 date (min event_date)
- `to` (optional) - ISO8601 date (max event_date)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "event_id": 1,
      "event_name": "Tech Summit 2024",
      "category": "Technology",
      "event_date": "2024-03-15",
      "max_participants": 100,
      "registered_participants": 45,
      "registration_fee": 50.0,
      "prize_pool": 5000.0,
      "sponsorship_total": 10000.0,
      "total_prize_pool": 15000.0,
      "event_status": "ongoing",
      "assigned_judge_id": 12,
      "venue_id": 5,
      "venue_name": "Convention Center"
    }
  ]
}
```

### GET /api/events/:id

Get detailed event information.

**Response:**

```json
{
  "success": true,
  "data": {
    "event_id": 1,
    "event_name": "Tech Summit 2024",
    "description": "Annual technology summit...",
    "category": "Technology",
    "event_date": "2024-03-15",
    "event_status": "ongoing",
    "max_participants": 100,
    "registration_fee": 50.0,
    "prize_pool": 5000.0,
    "sponsorship_total": 10000.0,
    "assigned_judge_id": 12,
    "assigned_judge_name": "John Doe",
    "assigned_judge_email": "john@example.com",
    "venue_name": "Convention Center",
    "venue_capacity": 500,
    "organizer_id": 3,
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-03-10T15:30:00Z"
  }
}
```

### POST /api/events

Create a new event (organizer only).

**Request Body:**

```json
{
  "event_name": "Tech Summit 2024",
  "description": "Annual technology conference",
  "category": "Technology",
  "event_date": "2024-03-15",
  "max_participants": 100,
  "registration_fee": 50.0,
  "prize_pool": 5000.0,
  "venue_id": 5,
  "auto_assign_judge": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "event_id": 1,
    "assigned_judge_id": 12,
    "event_status": "created",
    "message": "Event created and judge assigned"
  }
}
```

### PATCH /api/events/:id

Update event (organizer only).

**Request Body (optional fields):**

```json
{
  "event_name": "Updated Name",
  "description": "Updated description",
  "event_status": "ongoing",
  "prize_pool": 6000.0,
  "max_participants": 150
}
```

**Response:** Updated event object

### DELETE /api/events/:id

Soft delete event (organizer/admin only).

---

## Registration Routes

### GET /api/registrations

List user's registrations (participant).

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "registration_id": 789,
      "event_id": 1,
      "event_name": "Tech Summit 2024",
      "status": "confirmed",
      "registered_at": "2024-02-01T10:00:00Z",
      "payment_status": "completed",
      "team_id": null
    }
  ]
}
```

### POST /api/registrations

Register for an event (participant).

**Request Body:**

```json
{
  "event_id": 1,
  "team_id": null
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "registration_id": 789,
    "event_id": 1,
    "status": "pending",
    "registered_at": "2024-02-01T10:00:00Z",
    "payment_required": true,
    "payment_amount": 50.0
  }
}
```

### PATCH /api/registrations/:id

Update registration status (admin/organizer).

**Request Body:**

```json
{
  "status": "confirmed"
}
```

---

## Payment Routes

### GET /api/payments

List payments for user or event.

**Query Parameters:**

- `event_id` (optional) - Filter by event
- `status` (optional) - Filter by status (pending, completed, failed)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "payment_id": 456,
      "registration_id": 789,
      "event_id": 1,
      "event_name": "Tech Summit 2024",
      "amount": 50.0,
      "payment_type": "registration",
      "status": "completed",
      "created_at": "2024-02-01T10:05:00Z"
    }
  ]
}
```

### POST /api/payments

Create payment for registration or sponsorship.

**Request Body:**

```json
{
  "registration_id": 789,
  "amount": 50.0,
  "payment_type": "registration",
  "method": "card"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "payment_id": 456,
    "status": "completed",
    "transaction_id": "txn_123456"
  }
}
```

---

## Judge Routes

### GET /api/judges/assignments

List judge's event assignments.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "assignment_id": 1,
      "event_id": 1,
      "event_name": "Tech Summit 2024",
      "event_date": "2024-03-15",
      "category": "Technology",
      "assigned_at": "2024-02-01T10:00:00Z",
      "total_rounds": 3,
      "active": true
    }
  ]
}
```

### GET /api/judges/workload

Get judge's pending work.

**Response:**

```json
{
  "success": true,
  "data": {
    "assigned_count": 5,
    "pending_evaluations": 12,
    "completed_scores": 28,
    "assigned_events": [
      {
        "event_id": 1,
        "event_name": "Tech Summit 2024",
        "total_rounds": 3,
        "pending_teams": 20
      }
    ]
  }
}
```

### POST /api/judges/assign

Assign judge to event (organizer/admin).

**Request Body:**

```json
{
  "event_id": 1,
  "judge_id": 12
}
```

---

## Sponsorship Routes

### GET /api/sponsorships

List sponsorships (sponsor/organizer/admin).

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "sponsorship_id": 1,
      "event_id": 1,
      "event_name": "Tech Summit 2024",
      "sponsor_id": 5,
      "amount": 10000.0,
      "tier": "platinum",
      "status": "confirmed",
      "sponsored_at": "2024-02-01T10:00:00Z"
    }
  ]
}
```

### POST /api/sponsorships

Create sponsorship agreement.

**Request Body:**

```json
{
  "event_id": 1,
  "amount": 10000.0,
  "tier": "platinum"
}
```

**Response:** Created sponsorship object

### PATCH /api/sponsorships/:id

Update sponsorship status.

**Request Body:**

```json
{
  "status": "confirmed"
}
```

---

## Dashboard Routes

### GET /api/dashboard/admin

Admin dashboard - system metrics.

**Response:**

```json
{
  "success": true,
  "data": {
    "kpi": {
      "total_users": 150,
      "active_users": 120,
      "total_events": 8,
      "total_registrations": 450,
      "revenue_completed": 22500.00,
      "pending_revenue": 5000.00
    },
    "roleDistribution": [
      {"role": "participant", "count": 100},
      {"role": "judge", "count": 20}
    ],
    "categoryDistribution": [
      {"category": "Technology", "count": 3}
    ],
    "topPrograms": [
      {
        "event_id": 1,
        "event_name": "Tech Summit",
        "registered": 80,
        "max_participants": 100
      }
    ],
    "revenueBreakdown": [
      {"payment_type": "registration", "total": 20000.00}
    ],
    "recentActivity": [...]
  }
}
```

### GET /api/dashboard/participant

Participant dashboard.

**Response:**

```json
{
  "success": true,
  "data": {
    "myEvents": [
      {
        "event_id": 1,
        "event_name": "Tech Summit",
        "status": "confirmed",
        "event_date": "2024-03-15",
        "current_registrations": 80,
        "max_participants": 100
      }
    ],
    "upcomingEvents": [
      {
        "event_id": 2,
        "event_name": "Next Summit",
        "event_date": "2024-04-15",
        "days_until": 32
      }
    ],
    "payments": [...],
    "accommodation": [...],
    "teams": [...],
    "stats": {
      "registered_count": 5,
      "paid_count": 4,
      "pending_payment": 1
    }
  }
}
```

### GET /api/dashboard/judge

Judge dashboard.

**Response:**

```json
{
  "success": true,
  "data": {
    "assigned": [
      {
        "event_id": 1,
        "event_name": "Tech Summit",
        "category": "Technology",
        "event_date": "2024-03-15",
        "total_rounds": 3
      }
    ],
    "submitted": [
      {
        "score_id": 1,
        "event_name": "Tech Summit",
        "team_name": "Team A",
        "score": 85.5,
        "submission_date": "2024-03-16T10:00:00Z"
      }
    ],
    "pending": [
      {
        "round_id": 1,
        "round_name": "Preliminary",
        "event_name": "Tech Summit",
        "teams_pending": 15
      }
    ],
    "stats": {
      "assigned_count": 3,
      "submitted_count": 25,
      "pending_count": 15
    }
  }
}
```

### GET /api/dashboard/organizer

Organizer dashboard.

**Response:**

```json
{
  "success": true,
  "data": {
    "events": [
      {
        "event_id": 1,
        "event_name": "Tech Summit",
        "event_status": "ongoing",
        "registered_participants": 80,
        "max_participants": 100,
        "fill_rate": 80.0
      }
    ],
    "judges": [
      {
        "judge_id": 12,
        "name": "John Doe",
        "email": "john@example.com",
        "assigned_events": 3
      }
    ],
    "rounds": [...],
    "venueConflicts": [...],
    "stats": {
      "total_events": 5,
      "total_registrations": 450,
      "avg_fill_rate": 75.5
    }
  }
}
```

### GET /api/dashboard/sponsor

Sponsor dashboard.

**Response:**

```json
{
  "success": true,
  "data": {
    "sponsorInfo": {
      "sponsor_id": 5,
      "name": "Tech Corp",
      "sponsorship_tier": "platinum",
      "contribution_amount": 10000.00
    },
    "sponsoredEvents": [
      {
        "event_id": 1,
        "event_name": "Tech Summit",
        "participants_reached": 80,
        "sponsorship_contribution": 10000.00
      }
    ],
    "payments": [...],
    "history": [...],
    "stats": {
      "total_contribution": 50000.00,
      "events_sponsored": 5,
      "total_reach": 400
    }
  }
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Invalid input validation failed"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Missing or invalid authentication token"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": "Insufficient permissions for this action"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Status Codes Reference

| Code | Status       | Description              |
| ---- | ------------ | ------------------------ |
| 200  | OK           | Request successful       |
| 201  | Created      | Resource created         |
| 400  | Bad Request  | Invalid input            |
| 401  | Unauthorized | Auth required            |
| 403  | Forbidden    | Insufficient permissions |
| 404  | Not Found    | Resource not found       |
| 500  | Server Error | Internal error           |

---

## Data Types

### Event Status

- `created` - Event initialized
- `open` - Registration open
- `ongoing` - Event in progress
- `completed` - Event finished
- `cancelled` - Event cancelled

### Registration Status

- `pending` - Awaiting confirmation
- `confirmed` - User registered
- `cancelled` - Registration cancelled

### Payment Status

- `pending` - Awaiting processing
- `completed` - Payment received
- `failed` - Payment failed

### Judge Assignment Status

- Active (1) - Judge assigned and working
- Inactive (0) - Judge assignment revoked

### Sponsorship Status

- `pending` - Agreement pending
- `confirmed` - Agreement confirmed
- `completed` - Sponsorship fulfilled
