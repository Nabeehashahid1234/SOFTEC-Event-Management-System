# Dashboard API Reference

## Authentication

All endpoints require:

```
Authorization: Bearer {JWT_TOKEN}
```

---

## GET /api/dashboard/admin

**Role:** admin only

**Response:**

```json
{
  "success": true,
  "data": {
    "kpi": {
      "total_users": 42,
      "active_users": 38,
      "total_events": 12,
      "total_registrations": 156,
      "revenue_completed": 450000,
      "pending_revenue": 75000
    },
    "roleDistribution": [
      { "role": "participant", "count": 30 },
      { "role": "organizer", "count": 5 },
      { "role": "judge", "count": 4 },
      { "role": "sponsor", "count": 3 }
    ],
    "categoryDistribution": [
      { "category": "Tech", "count": 4 },
      { "category": "Business", "count": 3 },
      { "category": "Gaming", "count": 3 },
      { "category": "General", "count": 2 }
    ],
    "venueUtilization": [
      { "venue_id": 1, "venue_name": "CS Auditorium", "total_events": 3 },
      { "venue_id": 2, "venue_name": "EE Hall A", "total_events": 2 }
    ],
    "topPrograms": [
      {
        "event_id": 1,
        "event_name": "Speed Programming",
        "category": "Tech",
        "registered": 42,
        "max_participants": 60,
        "venue_name": "CS Auditorium"
      }
    ],
    "revenueBreakdown": [
      { "payment_type": "registration", "total": 300000 },
      { "payment_type": "accommodation", "total": 100000 },
      { "payment_type": "sponsorship", "total": 50000 }
    ],
    "sponsorTiers": [
      { "sponsorship_tier": "Title", "count": 1 },
      { "sponsorship_tier": "Gold", "count": 2 },
      { "sponsorship_tier": "Silver", "count": 1 }
    ],
    "recentActivity": [
      {
        "user_id": 10,
        "name": "Ahmed Khan",
        "event_name": "Speed Programming",
        "registration_date": "2026-05-09T10:30:00Z",
        "status": "completed"
      }
    ],
    "paymentStatus": [
      { "status": "completed", "count": 145 },
      { "status": "pending", "count": 8 },
      { "status": "failed", "count": 3 }
    ]
  }
}
```

---

## GET /api/dashboard/participant

**Role:** participant only
**Auth:** Uses logged-in user's user_id

**Response:**

```json
{
  "success": true,
  "data": {
    "myEvents": [
      {
        "event_id": 1,
        "event_name": "Speed Programming",
        "category": "Tech",
        "event_date": "2026-05-15T09:00:00Z",
        "end_date": "2026-05-15T12:00:00Z",
        "registration_fee": 500,
        "venue_name": "CS Auditorium",
        "event_status": "open",
        "current_registrations": 42,
        "max_participants": 60
      }
    ],
    "upcomingEvents": [
      {
        "event_id": 2,
        "event_name": "Web Development",
        "category": "Tech",
        "event_date": "2026-05-20T09:00:00Z",
        "registration_fee": 600,
        "venue_name": "EE Hall A",
        "days_until": 11
      }
    ],
    "payments": [
      {
        "payment_id": 1,
        "event_name": "Speed Programming",
        "amount": 500,
        "payment_type": "registration",
        "status": "completed",
        "payment_date": "2026-05-09T10:30:00Z"
      }
    ],
    "accommodation": [
      {
        "booking_id": 1,
        "room_type": "Single",
        "check_in_date": "2026-05-14",
        "check_out_date": "2026-05-16",
        "nights": 2,
        "price_per_night": 2000,
        "total_cost": 4000,
        "booking_status": "confirmed"
      }
    ],
    "teams": [
      {
        "team_id": 1,
        "team_name": "Code Warriors",
        "event_name": "Speed Programming",
        "member_count": 3
      }
    ],
    "leaderboards": [
      {
        "event_id": 1,
        "event_name": "Speed Programming",
        "rank": 5,
        "score": 8.5,
        "team_id": 1
      }
    ],
    "stats": {
      "registered_count": 3,
      "paid_count": 2,
      "pending_payment": 1
    }
  }
}
```

---

## GET /api/dashboard/organizer

**Role:** organizer only
**Auth:** Uses logged-in user's user_id

**Response:**

```json
{
  "success": true,
  "data": {
    "events": [
      {
        "event_id": 1,
        "event_name": "Speed Programming",
        "category": "Tech",
        "event_date": "2026-05-15T09:00:00Z",
        "registration_fee": 500,
        "venue_name": "CS Auditorium",
        "event_status": "open",
        "registered_participants": 42,
        "max_participants": 60,
        "fill_rate": 70.0
      }
    ],
    "judges": [
      {
        "judge_id": 1,
        "name": "Dr. Faraz Mahmood",
        "email": "faraz@nu.edu.pk",
        "assigned_events": 3
      }
    ],
    "rounds": [
      {
        "round_id": 1,
        "event_id": 1,
        "event_name": "Speed Programming",
        "round_name": "Qualifying Round",
        "round_date": "2026-05-15T09:00:00Z",
        "round_status": "scheduled",
        "venue_name": "CS Auditorium"
      }
    ],
    "venueConflicts": [
      {
        "venue_id": 1,
        "venue_name": "CS Auditorium",
        "conflicting_events": "Speed Programming, Web Dev Challenge",
        "total_rounds": 2
      }
    ],
    "stats": {
      "total_events": 4,
      "total_registrations": 156,
      "avg_fill_rate": 68.5
    }
  }
}
```

---

## GET /api/dashboard/judge

**Role:** judge only
**Auth:** Uses logged-in user's user_id to find judge record

**Response:**

```json
{
  "success": true,
  "data": {
    "assigned": [
      {
        "event_id": 1,
        "event_name": "Speed Programming",
        "category": "Tech",
        "event_date": "2026-05-15T09:00:00Z",
        "total_rounds": 2
      }
    ],
    "submitted": [
      {
        "score_id": 1,
        "event_name": "Speed Programming",
        "team_name": "Code Warriors",
        "score": 8.5,
        "comments": "Excellent algorithmic approach",
        "submission_date": "2026-05-15T12:30:00Z",
        "round_name": "Qualifying Round"
      }
    ],
    "pending": [
      {
        "round_id": 1,
        "round_name": "Final Round",
        "event_name": "Speed Programming",
        "teams_pending": 5
      }
    ],
    "leaderboard": [
      {
        "rank": 1,
        "participant": "Code Warriors",
        "score": 9.2,
        "event_name": "Speed Programming"
      }
    ],
    "stats": {
      "assigned_count": 2,
      "submitted_count": 14,
      "pending_count": 5
    }
  }
}
```

---

## GET /api/dashboard/sponsor

**Role:** sponsor only
**Auth:** Uses logged-in user's user_id to find sponsor record

**Response:**

```json
{
  "success": true,
  "data": {
    "sponsorInfo": {
      "sponsor_id": 1,
      "name": "Systems Limited",
      "sponsorship_tier": "Title",
      "contribution_amount": 2500000,
      "start_date": "2026-04-01",
      "end_date": "2026-05-31",
      "contract_status": "active",
      "email": "sponsors@systemsltd.com"
    },
    "sponsoredEvents": [
      {
        "event_id": 1,
        "event_name": "Speed Programming",
        "category": "Tech",
        "event_date": "2026-05-15T09:00:00Z",
        "participants_reached": 42,
        "sponsorship_contribution": 300000
      }
    ],
    "payments": [
      {
        "payment_id": 1,
        "amount": 500000,
        "payment_date": "2026-04-01T10:00:00Z",
        "status": "completed",
        "payment_type": "sponsorship"
      }
    ],
    "history": [
      {
        "sponsorship_id": 1,
        "event_name": "Speed Programming",
        "amount": 300000,
        "sponsorship_date": "2026-05-01T00:00:00Z",
        "sponsorship_status": "active"
      }
    ],
    "stats": {
      "total_contribution": 2500000,
      "events_sponsored": 4,
      "total_reach": 156
    }
  }
}
```

---

## Error Response

All endpoints return error in same format:

```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

**Common Errors:**

- `"Unauthorized"` - Missing or invalid JWT token
- `"Route not found"` - Endpoint doesn't exist
- `"Database query failed"` - SQL error (check backend logs)

---

## HTTP Status Codes

- `200 OK` - Successful request
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Wrong role for endpoint
- `404 Not Found` - Endpoint doesn't exist
- `500 Internal Server Error` - Database or server error

---

## Usage in React

```typescript
import { useDashboard } from "@/hooks/useDashboard";

function MyDashboard() {
  const { loading, error, data } = useDashboard();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // data structure matches responses above
  const { kpi, roleDistribution, ... } = data;

  return (
    // render dashboard with real data
  );
}
```

---

## Testing with cURL

```bash
# Login first to get token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  | jq -r '.data.token')

# Get admin dashboard
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/dashboard/admin

# Get participant dashboard
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/dashboard/participant
```

---

## Postman Collection

Available in: `backend/postman_collection.json`

Import into Postman for easy endpoint testing.

---

**Last Updated:** May 9, 2026
**Status:** All endpoints active and fully tested
