# Backend Testing & Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Setup

- [ ] MySQL server is installed and running
- [ ] `.env` file configured with correct database credentials
- [ ] Node.js dependencies installed (`npm install`)
- [ ] All backend files are in place

### 2. Database Setup

- [ ] Run database setup script: `npm run setup:db`
- [ ] Verify no errors during schema creation
- [ ] Run schema validation: `npm run validate:schema`
- [ ] Confirm all tables created successfully

### 3. Seed Data

- [ ] Optionally load test data: `mysql -u root -p softec_db < backend/database/seed.sql`
- [ ] Verify seed data loaded without errors
- [ ] Check user, event, and registration records are present

---

## Testing Steps

### Step 1: Verify Database Connection

```bash
npm run check:db
```

Expected output:

```
✅ MySQL Connected Successfully
```

### Step 2: Validate Schema

```bash
npm run validate:schema
```

This will check:

- All required tables exist
- All required columns present
- All views created
- Foreign key relationships
- Indexes configured

Expected output:

```
✓ Table 'users' exists
✓ Table 'events' exists
✓ Table 'registrations' exists
✓ Column 'events.assigned_judge_id' exists
... (all checks pass)
✓ All validations passed!
```

### Step 3: Test Database Queries

Connect to MySQL and run these test queries:

#### Test 1: Count records by table

```sql
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'registrations', COUNT(*) FROM registrations
UNION ALL
SELECT 'payments', COUNT(*) FROM payments
UNION ALL
SELECT 'judge_assignments', COUNT(*) FROM judge_assignments;
```

#### Test 2: Verify event with judge info

```sql
SELECT e.event_id, e.event_name, u.name as judge_name
FROM events e
LEFT JOIN users u ON u.user_id = e.assigned_judge_id
LIMIT 3;
```

Expected: Events should show assigned judge names (or NULL if not assigned)

#### Test 3: Check registrations with payments

```sql
SELECT r.registration_id, r.user_id, e.event_name, r.status,
       p.amount, p.status as payment_status
FROM registrations r
JOIN events e ON r.event_id = e.event_id
LEFT JOIN payments p ON p.registration_id = r.registration_id
LIMIT 5;
```

Expected: Registrations with payment status (if payments exist)

#### Test 4: Verify views exist and work

```sql
-- Test view: vw_event_leaderboard
SELECT * FROM vw_event_leaderboard LIMIT 1;

-- Test view: vw_judge_workload
SELECT * FROM vw_judge_workload LIMIT 1;

-- Test view: vw_sponsorship_totals
SELECT * FROM vw_sponsorship_totals LIMIT 1;
```

Expected: Views return data or empty results (if no data to show)

### Step 4: Start Backend Server

```bash
npm run dev
```

Expected output:

```
✅ MySQL Connected Successfully
Server running on port 5000
```

### Step 5: Test API Endpoints (Using Postman or cURL)

#### Test 5.1: Get all events

```bash
curl -X GET http://localhost:5000/api/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected response:

```json
{
  "success": true,
  "data": [
    {
      "event_id": 1,
      "event_name": "Tech Summit 2024",
      "registered_participants": 5,
      "event_status": "open",
      ...
    }
  ]
}
```

#### Test 5.2: Get specific event

```bash
curl -X GET http://localhost:5000/api/events/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected: Event details with assigned_judge_id, event_status, prize_pool

#### Test 5.3: Get participant dashboard

```bash
curl -X GET http://localhost:5000/api/dashboard/participant \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected: User's registrations, payments, teams, statistics

#### Test 5.4: Get organizer dashboard

```bash
curl -X GET http://localhost:5000/api/dashboard/organizer \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected: Organizer's events with fill rates, judge assignments, rounds

#### Test 5.5: Get judge dashboard

```bash
curl -X GET http://localhost:5000/api/dashboard/judge \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected: Judge's assigned events, submitted scores, pending evaluations

#### Test 5.6: Get admin dashboard

```bash
curl -X GET http://localhost:5000/api/dashboard/admin \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected: System KPIs, role distribution, top programs

#### Test 5.7: Create registration

```bash
curl -X POST http://localhost:5000/api/registrations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event_id": 1,
    "team_id": null
  }'
```

Expected: New registration with status 'pending'

#### Test 5.8: Get judge assignments

```bash
curl -X GET http://localhost:5000/api/judges/assignments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected: Judge's assigned events with details

---

## Common Issues & Solutions

### Issue 1: MySQL Connection Failed

**Symptom:** "Cannot connect to database"

**Solutions:**

1. Verify MySQL is running: `mysql -u root -p`
2. Check `.env` database credentials
3. Ensure database user has CREATE/ALTER permissions
4. Try restarting MySQL service

### Issue 2: Foreign Key Constraint Errors

**Symptom:** "Foreign key constraint fails during setup"

**Solutions:**

1. Ensure tables are created in correct order (done in schema.sql)
2. Check column types match (e.g., INT vs BIGINT)
3. Verify referenced records exist in parent tables
4. Run: `SET FOREIGN_KEY_CHECKS=0;` temporarily if needed

### Issue 3: View Creation Fails

**Symptom:** "Error creating view vw_event_leaderboard"

**Solutions:**

1. Check that all referenced tables exist
2. Verify column names in view queries
3. Check for typos in column references
4. Run views separately to identify which one fails

### Issue 4: 401 Unauthorized on API Calls

**Symptom:** "Missing or invalid authentication token"

**Solutions:**

1. Generate JWT token via login endpoint
2. Include "Bearer " prefix in Authorization header
3. Verify token is not expired
4. Check JWT_SECRET matches in `.env`

### Issue 5: API Returns 404 Not Found

**Symptom:** "Resource not found"

**Solutions:**

1. Check endpoint URL is correct
2. Verify HTTP method (GET, POST, PATCH)
3. Confirm resource ID exists in database
4. Check backend server is running

---

## Performance Testing

### Load Testing Query

```sql
-- Insert 1000 test registrations
INSERT INTO registrations (user_id, event_id, status, registered_at)
SELECT
  FLOOR(RAND() * 10) + 1,
  FLOOR(RAND() * 3) + 1,
  CASE FLOOR(RAND() * 3) WHEN 0 THEN 'pending' WHEN 1 THEN 'confirmed' ELSE 'cancelled' END,
  NOW()
FROM (SELECT 1 UNION SELECT 2 UNION SELECT 3) t1,
     (SELECT 1 UNION SELECT 2 UNION SELECT 3) t2,
     (SELECT 1 UNION SELECT 2 UNION SELECT 3) t3,
     (SELECT 1 UNION SELECT 2 UNION SELECT 3) t4,
     (SELECT 1 UNION SELECT 2 UNION SELECT 3) t5,
     (SELECT 1 UNION SELECT 2 UNION SELECT 3) t6,
     (SELECT 1 UNION SELECT 2 UNION SELECT 3) t7
LIMIT 1000;
```

Then test query performance:

```sql
-- Check query execution time
EXPLAIN FORMAT=JSON
SELECT e.*, COUNT(DISTINCT r.registration_id) as registrations
FROM events e
LEFT JOIN registrations r ON r.event_id = e.event_id
GROUP BY e.event_id;
```

---

## Verification Checklist

### Database Level

- [ ] All tables created successfully
- [ ] All columns have correct data types
- [ ] Foreign keys enforced
- [ ] Indexes created for performance
- [ ] Views work without errors
- [ ] Sample data loads correctly

### Backend Server Level

- [ ] Server starts without errors
- [ ] Database connection successful
- [ ] All middleware loads
- [ ] Routes are registered
- [ ] Error handling works

### API Level

- [ ] GET endpoints return data
- [ ] POST endpoints create records
- [ ] PATCH endpoints update records
- [ ] Authentication required works
- [ ] Role-based access works
- [ ] Error responses are formatted correctly
- [ ] Response status codes are correct

### Data Level

- [ ] Registrations link user to event
- [ ] Payments link to registrations
- [ ] Judge assignments are tracked
- [ ] Sponsorships associated with events
- [ ] Event rounds linked to events
- [ ] Views aggregate data correctly

---

## Database Backup

Before going to production, backup your database:

```bash
# Backup database structure and data
mysqldump -u root -p softec_db > softec_db_backup.sql

# Backup just structure
mysqldump -u root -p --no-data softec_db > softec_db_structure.sql

# Restore from backup
mysql -u root -p softec_db < softec_db_backup.sql
```

---

## Next Steps After Testing

1. **Frontend Integration**: Update frontend to use new API endpoints
2. **User Testing**: Have test users go through complete workflows
3. **Load Testing**: Test with realistic data volumes
4. **Security Audit**: Review authentication and authorization
5. **Performance Tuning**: Optimize slow queries
6. **Production Deployment**: Deploy to live server

---

## Support Resources

- **Schema Documentation**: See [SCHEMA_MIGRATION.md](SCHEMA_MIGRATION.md)
- **API Documentation**: See [BACKEND_API_REFERENCE.md](BACKEND_API_REFERENCE.md)
- **Frontend Guide**: See [FRONTEND_INTEGRATION_GUIDE.md](FRONTEND_INTEGRATION_GUIDE.md)
- **Database Files**: `backend/database/*.sql`
- **Backend Config**: `backend/.env` and `backend/config/db.js`
