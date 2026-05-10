# SOFTEC Event Management System

> A comprehensive event management platform for organizing technology events with participant registration, judging, sponsorships, and analytics.

**Status**: ✅ Production-Ready Backend | ⏳ Frontend Integration in Progress

## 📚 Quick Links

### Getting Started

- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Complete project overview and architecture
- **[TESTING_AND_DEPLOYMENT.md](TESTING_AND_DEPLOYMENT.md)** - Setup and testing guide

### Backend Documentation

- **[SCHEMA_MIGRATION.md](SCHEMA_MIGRATION.md)** - Database schema redesign (complete guide)
- **[BACKEND_API_REFERENCE.md](BACKEND_API_REFERENCE.md)** - Full API endpoint documentation
- **Backend Setup**: See `backend/README.md` or PROJECT_OVERVIEW.md

### Frontend Documentation

- **[FRONTEND_INTEGRATION_GUIDE.md](FRONTEND_INTEGRATION_GUIDE.md)** - Frontend migration to new schema
- **Frontend Setup**: See root `package.json`

---

## 🚀 Quick Start

### 1. Backend Setup (5 minutes)

```bash
cd backend
npm install
npm run setup:db        # Create database
npm run validate:schema # Verify schema
npm run dev            # Start server (http://localhost:5000)
```

### 2. Frontend Setup (5 minutes)

```bash
npm install
npm run dev            # Start frontend (http://localhost:5173)
```

### 3. Test API

```bash
# In another terminal
npm run validate:schema
```

---

## 📊 What's New

### Schema Redesign (Complete)

✅ Removed legacy tables (`participants`, `judges`, `sponsor_events`, `rounds`)
✅ Introduced new normalized structure (`registrations`, `judge_assignments`, `sponsorships`, `event_rounds`)
✅ Updated all backend routes and dashboards
✅ Created service layer for business logic
✅ Full documentation and testing guides

### Documentation

✅ SCHEMA_MIGRATION.md - Complete redesign guide
✅ BACKEND_API_REFERENCE.md - Full API docs
✅ FRONTEND_INTEGRATION_GUIDE.md - Frontend update guide
✅ TESTING_AND_DEPLOYMENT.md - Testing procedures
✅ PROJECT_OVERVIEW.md - Architecture overview

---

## 🏗️ Technology Stack

**Frontend:**

- React + TypeScript
- TanStack Router
- Tailwind CSS
- React Query
- Recharts

**Backend:**

- Node.js + Express
- MySQL 8.0+
- JWT Authentication
- Role-Based Access Control

---

## 📁 Project Structure

```
├── src/                          # Frontend React application
│   ├── components/              # React components
│   ├── routes/                  # TanStack Router pages
│   ├── hooks/                   # Custom hooks (useEvents, useDashboard, etc)
│   └── lib/                     # Utilities (api.ts, auth.tsx, etc)
│
├── backend/                     # Node.js + Express backend
│   ├── database/               # MySQL schema, procedures, views
│   ├── routes/                 # API endpoints
│   ├── middleware/             # Authentication, RBAC
│   ├── services/               # Business logic (event operations)
│   ├── scripts/                # Database setup and validation
│   └── .env                    # Configuration
│
└── Documentation/
    ├── PROJECT_OVERVIEW.md          # Architecture and overview
    ├── SCHEMA_MIGRATION.md          # Database schema guide
    ├── BACKEND_API_REFERENCE.md     # API documentation
    ├── FRONTEND_INTEGRATION_GUIDE.md# Frontend migration
    └── TESTING_AND_DEPLOYMENT.md    # Testing guide
```

---

## 🎯 Key Features

### User Roles

- **Admin**: System management and oversight
- **Organizer**: Create and manage events
- **Judge**: Evaluate participants and submit scores
- **Sponsor**: Track sponsorships and contributions
- **Participant**: Register and compete in events

### Core Functionality

- Event creation and management
- Participant registration and payment
- Judge assignment and scoring
- Sponsorship tracking
- Real-time leaderboards
- Role-specific dashboards
- Accommodation booking
- Team management

---

## 🔧 Configuration

### Backend (.env)

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=softec_db
JWT_SECRET=your_secret_key
PORT=5000
```

---

## 📖 Important Documentation

### For Database/Backend Developers

1. Start with [SCHEMA_MIGRATION.md](SCHEMA_MIGRATION.md) to understand the new schema
2. Review [BACKEND_API_REFERENCE.md](BACKEND_API_REFERENCE.md) for API endpoints
3. Check [TESTING_AND_DEPLOYMENT.md](TESTING_AND_DEPLOYMENT.md) for validation

### For Frontend Developers

1. Read [FRONTEND_INTEGRATION_GUIDE.md](FRONTEND_INTEGRATION_GUIDE.md)
2. Review [BACKEND_API_REFERENCE.md](BACKEND_API_REFERENCE.md) for API payloads
3. Check example hooks in [FRONTEND_INTEGRATION_GUIDE.md](FRONTEND_INTEGRATION_GUIDE.md)

### For Deployment

1. See [TESTING_AND_DEPLOYMENT.md](TESTING_AND_DEPLOYMENT.md)
2. Verify with `npm run validate:schema`
3. Load test data with `backend/database/seed.sql`

---

## ✅ Verification Checklist

After setup, verify everything works:

```bash
# 1. Backend database
cd backend
npm run validate:schema

# 2. Backend server
npm run dev
# Should see: "✅ MySQL Connected Successfully"

# 3. Frontend (in another terminal)
npm run dev
# Should open http://localhost:5173
```

---

## 🐛 Troubleshooting

### Database Won't Connect

1. Verify MySQL is running: `mysql -u root -p`
2. Check .env credentials match your MySQL setup
3. Ensure database user has CREATE/ALTER permissions

### Schema Validation Fails

1. Run `npm run setup:db` again (will drop and recreate)
2. Check MySQL error log for specific issues
3. See [TESTING_AND_DEPLOYMENT.md](TESTING_AND_DEPLOYMENT.md) for detailed troubleshooting

### API Returns 401 Errors

1. Generate JWT token via login endpoint first
2. Include "Bearer " prefix in Authorization header
3. Ensure token hasn't expired

---

## 📞 Support Resources

- **Database Schema**: [SCHEMA_MIGRATION.md](SCHEMA_MIGRATION.md)
- **API Endpoints**: [BACKEND_API_REFERENCE.md](BACKEND_API_REFERENCE.md)
- **Frontend Integration**: [FRONTEND_INTEGRATION_GUIDE.md](FRONTEND_INTEGRATION_GUIDE.md)
- **Testing Guide**: [TESTING_AND_DEPLOYMENT.md](TESTING_AND_DEPLOYMENT.md)
- **Full Overview**: [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)

---

## 🚀 Next Steps

1. ✅ Complete backend setup with `npm run setup:db`
2. ✅ Validate schema with `npm run validate:schema`
3. ⏳ Update frontend hooks and components (see [FRONTEND_INTEGRATION_GUIDE.md](FRONTEND_INTEGRATION_GUIDE.md))
4. ⏳ Test API endpoints (see [BACKEND_API_REFERENCE.md](BACKEND_API_REFERENCE.md))
5. ⏳ Deploy to production

---

## 📄 Version History

### v2.0 (Current - Production Ready)

- ✅ Complete schema redesign
- ✅ Removed legacy tables
- ✅ New service layer
- ✅ Updated all routes and dashboards
- ✅ Comprehensive documentation
- ⏳ Frontend integration in progress

### v1.0 (Legacy)

- Legacy schema with participants, judges, sponsor_events
- Basic API endpoints
- Initial dashboard implementation

---
