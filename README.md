<div align="center">

# SOFTEC Event Management System

### Engineering Smart & Scalable Technology Event Operations

A modern full-stack event management platform built to streamline technology competitions, hackathons, conferences, registrations, judging workflows, sponsorship management, and analytics through a scalable and production-oriented architecture.

<br>

![Backend](https://img.shields.io/badge/Backend-Production_Ready-16a34a?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-Integration_In_Progress-f59e0b?style=for-the-badge)
![Architecture](https://img.shields.io/badge/Architecture-Scalable-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-black?style=for-the-badge)

</div>

---

# Overview

The **SOFTEC Event Management System** is a comprehensive platform designed to manage large-scale technology events with efficiency, scalability, and role-based operational control.

The system centralizes:

- Event Management
- Participant Registration
- Team Coordination
- Judge Assignment & Evaluation
- Sponsorship Tracking
- Accommodation Management
- Analytics & Dashboards
- Authentication & Authorization

Built using modern development practices, the platform focuses on maintainable architecture, optimized workflows, and real-world scalability.

---

# Core Features

## Event Management
- Create and manage technology events
- Configure competition categories and rounds
- Track registrations and participation

## Participant & Team Management
- Individual and team registrations
- Team creation and member management
- Registration tracking system

## Judge Evaluation System
- Judge assignment workflows
- Score submission & evaluation
- Event round management

## Sponsorship Management
- Sponsorship tracking
- Partnership management
- Contribution monitoring

## Analytics & Dashboards
- Real-time statistics
- Role-specific dashboards
- Performance insights & leaderboards

## Secure Authentication
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Protected API routes

---

# Tech Stack

## Frontend
- React + TypeScript
- TanStack Router
- Tailwind CSS
- React Query
- Recharts

## Backend
- Node.js
- Express.js
- MySQL 8+
- JWT Authentication
- RBAC Authorization

---

# Architecture Highlights

- Modular backend architecture
- Service-layer business logic
- Scalable relational database design
- Optimized schema normalization
- Secure authentication workflow
- Separation of concerns
- Production-oriented API structure

---

# Database Modernization

The platform includes a redesigned normalized database structure focused on scalability and maintainability.

### Improvements Introduced
- Reduced redundancy
- Better relational integrity
- Cleaner backend services
- Optimized database relationships
- Improved frontend integration support

---

# Getting Started

# Clone Repository

```bash
git clone https://github.com/your-username/softec-event-management.git

cd softec-event-management
```

---

# Backend Setup

```bash
cd backend

npm install
```

## Configure Environment Variables

Create a `.env` file inside the backend directory.

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name

JWT_SECRET=your_secret_key

PORT=5000
```

---

## Initialize Database

```bash
npm run setup:db
```

---

## Start Backend Server

```bash
npm run dev
```

Backend will run on:

```bash
http://localhost:5000
```

---

# Frontend Setup

```bash
npm install

npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

# Authentication

Protected routes require JWT authentication.

```http
Authorization: Bearer <your_token>
```

---

# Documentation

| File | Description |
|---|---|
| `PROJECT_OVERVIEW.md` | Complete architecture overview |
| `BACKEND_API_REFERENCE.md` | API documentation |
| `FRONTEND_INTEGRATION_GUIDE.md` | Frontend integration guide |
| `TESTING_AND_DEPLOYMENT.md` | Deployment & testing guide |

---

# Validation

## Backend Validation

```bash
npm run validate:schema
```

Expected Output:

```bash
✅ Schema Validation Passed
✅ Database Connected Successfully
```

---

# Development Status

## Completed
- Backend architecture redesign
- RESTful API implementation
- Database schema normalization
- Service-layer integration
- Authentication & RBAC
- Documentation ecosystem

## In Progress
- Frontend integration
- UI optimization
- API refinement

## Planned
- Docker support
- CI/CD pipelines
- Real-time notifications
- Cloud deployment support

---

# Security Notice

Sensitive configurations, environment variables, credentials, and internal implementation details have been excluded from this public repository.

---

# Why This Project Stands Out

- Enterprise-inspired architecture
- Scalable event management workflows
- Clean and maintainable backend structure
- Role-driven access control system
- Production-ready API ecosystem
- Real-world system design implementation

---

# License

This project is licensed under the MIT License.

---

<div align="center">

### SOFTEC Event Management System

Built for modern technology events, scalable operations, and seamless digital management.

</div>
