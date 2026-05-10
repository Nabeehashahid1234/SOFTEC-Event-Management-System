# Error Handling Audit

Status: source-level audit partially blocked.

The current workspace contains the SQL/database backend artifacts, but no Express source files such as `backend/server.js`, `backend/routes/*`, `backend/controllers/*`, or `backend/middleware/errorHandler.js`. Because those files are not present in this checkout, the API endpoint implementation cannot be directly verified from code here. This audit records the required contract and the database-level change completed in this pass.

## Required API Response Contract

All API endpoints should return a consistent JSON shape:

```json
{
  "success": false,
  "error": "Human-readable message",
  "code": "OPTIONAL_MACHINE_CODE"
}
```

Successful responses should return:

```json
{
  "success": true,
  "data": {}
}
```

## Status Code Matrix

| Status | When to return | Example |
| --- | --- | --- |
| 400 | Validation failure or malformed request body | Missing `email`, invalid `score`, invalid date range |
| 401 | Missing, invalid, or expired JWT | No `Authorization: Bearer <token>` header |
| 403 | Authenticated user lacks role/permission | Participant calls admin-only `/api/users` |
| 404 | Resource does not exist | Unknown event, user, payment, team, sponsor |
| 409 | Database conflict or business rule conflict | Duplicate registration, venue conflict, duplicate payment |
| 500 | Unexpected server or database error | Unhandled SQL/connection failure |

## Endpoint Coverage Checklist

| Resource | Endpoints | Expected error coverage |
| --- | --- | --- |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` | 400, 401, 409, 500 |
| Users | `GET /api/users`, `GET /api/users/:id`, `PATCH /api/users/:id`, `DELETE /api/users/:id` | 400, 401, 403, 404, 500 |
| Events | `GET /api/events`, `GET /api/events/:id`, `POST /api/events`, `PATCH /api/events/:id`, `DELETE /api/events/:id`, rounds, judges, leaderboard | 400, 401, 403, 404, 409, 500 |
| Participants | register, my-events, withdraw | 400, 401, 403, 404, 409, 500 |
| Teams | create, list by event, delete | 400, 401, 403, 404, 409, 500 |
| Judging | submit, edit, leaderboard | 400, 401, 403, 404, 409, 500 |
| Sponsors | sponsors and sponsorships | 400, 401, 403, 404, 409, 500 |
| Payments | create, status update, history | 400, 401, 403, 404, 409, 500 |
| Accommodations | list, book | 400, 401, 404, 409, 500 |
| Reports | all six report endpoints | 400, 401, 403, 404, 500 |
| Dashboard | role dashboards | 401, 403, 500 |

## Frontend Toast Contract

The frontend should map API errors to friendly Sonner toast messages:

| Status | Toast title | Message guidance |
| --- | --- | --- |
| 400 | Check the form | Show the first validation message returned by the API |
| 401 | Please sign in again | Clear token and redirect to `/login` |
| 403 | Not allowed | Explain that the current role cannot perform this action |
| 404 | Not found | The requested record may have been removed |
| 409 | Conflict | Show the backend error exactly when it is business-specific |
| 500 | Something went wrong | Ask user to retry; avoid exposing stack traces |

## Venue Conflict Handling

Completed in `backend/database/triggers.sql`.

The `prevent_venue_conflict` and `prevent_venue_conflict_update` triggers now raise a message containing the conflicting event name:

```text
Venue is already booked for this date by event: <event_name>
```

Backend handling should map MySQL `SQLSTATE '45000'` or duplicate key errors from `uq_events_venue_date` to HTTP `409`.

Frontend behavior should show:

```text
Venue conflict: Venue is already booked for this date by event: Speed Programming
```

