# SOFTEC Event Management System - Production Ready

## 📋 Project Overview

The SOFTEC Event Management System is a comprehensive platform for managing technology events, including event creation, participant registration, judge assignments, sponsorships, and leaderboard tracking.

**Current Status**: ✅ Backend schema redesigned and refactored for production
**Frontend Status**: ⏳ Integration guide provided, awaiting frontend updates

---

## 🏗️ Architecture Overview

### Frontend Stack

- **Framework**: React + TypeScript
- **Routing**: TanStack Router
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Charts**: Recharts
- **UI Components**: Custom + shadcn/ui

### Backend Stack

- **Runtime**: Node.js + Express
- **Database**: MySQL 8.0+
- **Auth**: JWT + bcryptjs
- **Validation**: express-validator
- **Deployment**: Cloudflare Workers (via wrangler)

---

## 📁 Project Structure

```
SOFTEC-Event-Management-System/
├── src/                          # Frontend React code
│   ├── components/              # React components
│   │   ├── ui/                  # UI component library (shadcn)
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── ...
│   ├── hooks/                   # Custom React hooks
│   │   ├── useEvents.ts
│   │   ├── useDashboard.ts
│   │   └── useAuth.tsx
│   ├── routes/                  # TanStack Router routes
│   │   ├── app.dashboard.tsx
│   │   ├── app.events.tsx
│   │   └── ...
│   ├── lib/                     # Utilities and helpers
│   │   ├── api.ts              # API client
│   │   ├── auth.tsx            # Auth context
│   │   └── utils.ts
│   └── styles.css              # Global styles
│
├── backend/                     # Node.js + Express backend
│   ├── config/                 # Configuration
│   │   └── db.js              # MySQL connection pool
│   ├── database/               # Database files
│   │   ├── schema.sql         # MySQL schema (NEW - redesigned)
│   │   ├── procedures.sql     # Stored procedures
│   │   ├── seed.sql           # Test data (NEW - updated)
│   │   ├── views.sql          # Database views
│   │   └── triggers.sql       # Database triggers
│   ├── middleware/             # Express middleware
│   │   ├── auth.js            # JWT authentication
│   │   ├── rbac.js            # Role-based access control
│   │   └── errorHandler.js    # Error handling
│   ├── routes/                # API endpoints
│   │   ├── auth.routes.js
│   │   ├── events.routes.js  # (UPDATED - new schema)
│   │   ├── dashboard.routes.js # (UPDATED - new schema)
│   │   ├── registrations.routes.js
│   │   ├── payments.routes.js
│   │   └── ...
│   ├── services/              # Business logic (NEW)
│   │   └── event.service.js  # Event creation and operations
│   ├── scripts/               # Utility scripts (NEW)
│   │   ├── setupDatabase.js  # Database setup automation
│   │   └── validateSchema.js # Schema validation
│   ├── .env                   # Environment variables
│   ├── server.js              # Express app entry point
│   ├── package.json           # Backend dependencies
│   └── postman_collection.json # API testing collection
│
├── Documentation Files:
│   ├── SCHEMA_MIGRATION.md              # ✨ NEW - Complete schema redesign guide
│   ├── BACKEND_API_REFERENCE.md         # ✨ NEW - Full API documentation
│   ├── FRONTEND_INTEGRATION_GUIDE.md    # ✨ NEW - Frontend migration guide
│   ├── TESTING_AND_DEPLOYMENT.md        # ✨ NEW - Testing & deployment guide
│   ├── DASHBOARD_IMPLEMENTATION.md      # Existing dashboard docs
│   ├── DASHBOARD_API_REFERENCE.md       # Existing API docs
│   ├── README.md                        # Project readme
│   └── ...
│
├── Configuration Files:
│   ├── package.json            # Frontend dependencies
│   ├── tsconfig.json           # TypeScript config
│   ├── vite.config.ts          # Vite build config
│   ├── eslint.config.js        # ESLint config
│   ├── wrangler.jsonc          # Cloudflare Workers config
│   ├── components.json         # shadcn/ui config
│   └── tailwind.config.js      # Tailwind config
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- MySQL 8.0+
- npm or yarn

### Backend Setup

1. **Install dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**

   ```bash
   # Edit .env with your MySQL credentials
   cp .env.example .env
   # Update DB_HOST, DB_USER, DB_PASSWORD, etc.
   ```

3. **Create database**

   ```bash
   npm run setup:db
   ```

4. **Validate schema**

   ```bash
   npm run validate:schema
   ```

5. **Load test data (optional)**

   ```bash
   mysql -u root -p softec_db < backend/database/seed.sql
   ```

6. **Start backend**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure API endpoint**

   ```bash
   # Update src/lib/api.ts with backend URL
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

---

## 📊 Key Features

### User Roles & Access

- **Admin**: System management, user oversight, reporting
- **Organizer**: Event creation, judge assignment, registration management
- **Judge**: Event evaluation, score submission, workload tracking
- **Sponsor**: Event sponsorship, contribution tracking, reach analytics
- **Participant**: Event registration, payment, team participation

### Core Functionality

- 🎯 **Event Management**: Create, update, and manage events
- 👥 **Registration System**: Track participant registrations and status
- 💳 **Payment Processing**: Record and track payment transactions
- 🏆 **Judging System**: Assign judges, track evaluations, generate leaderboards
- 💰 **Sponsorship Tracking**: Manage event sponsorships and contributions
- 📊 **Analytics Dashboard**: Role-specific insights and metrics
- 🏨 **Accommodation**: Booking and management
- 👥 **Team Management**: Create teams and manage members

---

## 🗄️ Database Schema (Redesigned)

### Core Tables

#### `users`

- User account management
- Role-based access (admin, organizer, judge, sponsor, participant)
- Authentication and profile data

#### `events`

- Event definitions
- **NEW**: `assigned_judge_id`, `event_status`, `prize_pool`, `sponsorship_total`
- Links to organizer and venue

#### `registrations` (Replaces `participants`)

- Event registrations
- Links users directly to events
- Tracks status (pending, confirmed, cancelled)

#### `payments` (Unified)

- Registration payments
- Sponsorship payments
- Payment status tracking

#### `judge_assignments` (Replaces legacy judge tracking)

- Explicit event-to-judge assignments
- Tracks assignment status and timestamp
- Replaces separate judges/judge_events tables

#### `event_rounds` (Renamed from `rounds`)

- Event round/phase management
- Schedule and venue allocation
- Status tracking

#### `sponsorships` (Replaces `sponsor_events`)

- Direct event sponsorship tracking
- Amount and tier information
- Status and timeline

### Views

- `vw_event_leaderboard` - Event rankings
- `vw_judge_workload` - Judge assignments and pending work
- `vw_sponsorship_totals` - Sponsorship aggregation

---

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### Events

- `GET /api/events` - List events with filters
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event
- `PATCH /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Registrations

- `GET /api/registrations` - List user registrations
- `POST /api/registrations` - Register for event
- `PATCH /api/registrations/:id` - Update registration

### Payments

- `GET /api/payments` - List payments
- `POST /api/payments` - Create payment
- `PATCH /api/payments/:id` - Update payment

### Judges

- `GET /api/judges/assignments` - Get judge assignments
- `GET /api/judges/workload` - Get judge workload
- `POST /api/judges/assign` - Assign judge to event

### Sponsorships

- `GET /api/sponsorships` - List sponsorships
- `POST /api/sponsorships` - Create sponsorship
- `PATCH /api/sponsorships/:id` - Update sponsorship

### Dashboards

- `GET /api/dashboard/admin` - Admin metrics
- `GET /api/dashboard/participant` - Participant view
- `GET /api/dashboard/judge` - Judge view
- `GET /api/dashboard/organizer` - Organizer view
- `GET /api/dashboard/sponsor` - Sponsor view

See [BACKEND_API_REFERENCE.md](BACKEND_API_REFERENCE.md) for complete API documentation.

---

## ⚙️ Configuration

### Environment Variables (.env)

```
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=softec_db

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:5173
```

---

## 📚 Documentation

| Document                                                       | Purpose                           |
| -------------------------------------------------------------- | --------------------------------- |
| [SCHEMA_MIGRATION.md](SCHEMA_MIGRATION.md)                     | Complete database redesign guide  |
| [BACKEND_API_REFERENCE.md](BACKEND_API_REFERENCE.md)           | Full API endpoint documentation   |
| [FRONTEND_INTEGRATION_GUIDE.md](FRONTEND_INTEGRATION_GUIDE.md) | Frontend integration instructions |
| [TESTING_AND_DEPLOYMENT.md](TESTING_AND_DEPLOYMENT.md)         | Testing & deployment guide        |
| [DASHBOARD_IMPLEMENTATION.md](DASHBOARD_IMPLEMENTATION.md)     | Dashboard feature details         |
| [DASHBOARD_QUICKSTART.md](DASHBOARD_QUICKSTART.md)             | Dashboard quick start guide       |

---

## 🧪 Testing

### Database Testing

```bash
# Validate schema
npm run validate:schema

# Check database connection
npm run check:db
```

### Backend Testing

See [TESTING_AND_DEPLOYMENT.md](TESTING_AND_DEPLOYMENT.md) for:

- Database setup verification
- API endpoint testing
- Performance testing
- Common issues & solutions

### API Testing

- Use Postman collection: `backend/postman_collection.json`
- Or cURL commands in [TESTING_AND_DEPLOYMENT.md](TESTING_AND_DEPLOYMENT.md)

---

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs for secure password storage
- **RBAC**: Role-based access control middleware
- **CORS**: Cross-origin resource sharing configured
- **Helmet**: Security headers middleware
- **Input Validation**: express-validator for all inputs
- **SQL**: Prepared statements to prevent injection
- **Error Handling**: Consistent error response format

---

## 📈 Performance Optimizations

- **Database Indexes**: Strategic indexes on frequently queried columns
- **Query Optimization**: Views and efficient JOINs
- **Connection Pooling**: MySQL connection pool management
- **Caching**: Ready for Redis integration
- **Lazy Loading**: Frontend route-based code splitting
- **API Pagination**: Ready for implementation

---

## 🐛 Common Issues

### Database Issues

See [TESTING_AND_DEPLOYMENT.md](TESTING_AND_DEPLOYMENT.md#common-issues--solutions)

### API Issues

See [BACKEND_API_REFERENCE.md](BACKEND_API_REFERENCE.md#error-responses)

### Frontend Issues

See [FRONTEND_INTEGRATION_GUIDE.md](FRONTEND_INTEGRATION_GUIDE.md#troubleshooting-checklist)

---

## 🤝 Contributing

### Backend Development

1. Follow existing code structure
2. Update schema if adding tables
3. Add validation for all inputs
4. Test API endpoints
5. Update documentation

### Frontend Development

1. Follow React best practices
2. Use TypeScript for type safety
3. Follow component structure
4. Test against new API schema
5. Update integration docs

---

## 📝 Recent Changes

### Schema Redesign (Latest)

✅ **Completed**:

- Removed legacy `participants` table → uses `registrations`
- Removed legacy `judges` table → uses `users` with role='judge'
- Renamed `rounds` → `event_rounds`
- Removed `sponsor_events` → uses `sponsorships`
- Added `judge_assignments` for explicit tracking
- Added `event_status` to events for lifecycle management
- Added `prize_pool` and sponsorship tracking to events
- Updated all routes and dashboards
- Created service layer for event operations
- Added validation and setup scripts

### Documentation Added

✅ **Created**:

- SCHEMA_MIGRATION.md (schema redesign guide)
- BACKEND_API_REFERENCE.md (API documentation)
- FRONTEND_INTEGRATION_GUIDE.md (frontend guide)
- TESTING_AND_DEPLOYMENT.md (testing guide)
- Database setup and validation scripts

---

## 🚢 Deployment

### Development

```bash
npm run dev
```

### Production

```bash
npm install --production
npm run build
NODE_ENV=production npm start
```

### Cloudflare Workers

```bash
npm run deploy  # Configured in wrangler.jsonc
```

---

## 📞 Support

For issues or questions:

1. Check relevant documentation above
2. Review code comments in source files
3. Check error logs in backend console
4. Validate database with `npm run validate:schema`

---

## 📄 License

SOFTEC Event Management System - All Rights Reserved

---

## ✨ Key Highlights

🎯 **Production Ready**: Fully redesigned schema with best practices
📊 **Comprehensive**: Covers entire event lifecycle from creation to completion
🔐 **Secure**: JWT auth, RBAC, input validation
📱 **Modern Stack**: React, TypeScript, MySQL with proven patterns
📚 **Well Documented**: Complete guides for backend, frontend, API, and testing
🛠️ **Developer Friendly**: Clear code structure, validation scripts, helpful errors
