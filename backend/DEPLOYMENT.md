# Deployment Notes

This guide covers deployment to Railway or Render for the SOFTEC Event Management System.

## Environment Variables

Backend:

```text
PORT=5000
DB_HOST=<mysql-host>
DB_PORT=3306
DB_USER=<mysql-user>
DB_PASSWORD=<mysql-password>
DB_NAME=softec_db
JWT_SECRET=<long-random-secret>
FRONTEND_ORIGIN=<frontend-url>
NODE_ENV=production
```

Frontend:

```text
VITE_API_URL=<backend-url>
```

## Railway Deployment

1. Push the project to GitHub.
2. Create a Railway project.
3. Add a MySQL service.
4. Open the MySQL service and copy host, port, user, password, and database values.
5. Create a backend service from the GitHub repo.
6. Set the backend root directory to `backend`.
7. Add backend environment variables.
8. Use build command:

```text
npm install
```

9. Use start command:

```text
npm start
```

10. Import the database using Railway's MySQL connection:

```bash
mysql -h <host> -P <port> -u <user> -p < database/schema.sql
mysql -h <host> -P <port> -u <user> -p softec_db < database/triggers.sql
mysql -h <host> -P <port> -u <user> -p softec_db < database/procedures.sql
mysql -h <host> -P <port> -u <user> -p softec_db < database/views.sql
mysql -h <host> -P <port> -u <user> -p softec_db < database/events_scheduler.sql
mysql -h <host> -P <port> -u <user> -p softec_db < database/dcl_permissions.sql
mysql -h <host> -P <port> -u <user> -p softec_db < database/seed.sql
```

11. Deploy the frontend as a separate service.
12. Set `VITE_API_URL` to the backend public URL.
13. Set backend `FRONTEND_ORIGIN` to the frontend public URL.

## Render Deployment

1. Push the project to GitHub.
2. Create a Render MySQL-compatible database externally, or use a managed MySQL provider such as PlanetScale, Aiven, Railway MySQL, or AWS RDS.
3. Create a new Render Web Service for the backend.
4. Set root directory to `backend`.
5. Build command:

```text
npm install
```

6. Start command:

```text
npm start
```

7. Add environment variables listed above.
8. Import SQL files into the MySQL database in this order:
   - `schema.sql`
   - `triggers.sql`
   - `procedures.sql`
   - `views.sql`
   - `events_scheduler.sql`
   - `dcl_permissions.sql`
   - `seed.sql`
9. Deploy frontend separately as a static site.
10. Set frontend build command:

```text
npm install && npm run build
```

11. Set frontend publish directory:

```text
dist
```

## Production Checks

- Confirm `/api/health` or `/api/auth/me` responds from the backend.
- Confirm CORS allows only the deployed frontend origin.
- Confirm JWT secret is not the development value.
- Confirm MySQL Event Scheduler is enabled if the host permits it.
- Confirm seeded test users can log in.
- Confirm venue conflict creation returns HTTP `409`.
- Confirm reports run without timeout.

