# Heroku Deployment Guide

Follow these steps to deploy Game Path Planner to Heroku.

## Prerequisites
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed.
- A Heroku account.
- Git initialized in your project.

## Steps

### 1. Create a Heroku App
```bash
heroku create your-app-name
```

### 2. Add PostgreSQL Add-on
Heroku provides a managed PostgreSQL database.
```bash
heroku addons:create heroku-postgresql:mini
```

### 3. Build the Project
Vite builds the frontend into the `dist/` folder.
```bash
npm run build
```

### 4. Deploy to Heroku
Add your changes and push to Heroku's git remote.
```bash
git add .
git commit -m "Configure for Heroku deployment"
git push heroku main
```

### 5. Initialize the Database
Run the schema script to create tables and seed data.
```bash
heroku run node server/scripts/migrate_refinements.js
# Or use the specific schema path if needed
heroku pg:psql < server/schema.sql
```

## Environment Variables
The following variables are automatically managed by Heroku (PostgreSQL) or used by the app:
- `PORT`: Managed by Heroku.
- `DATABASE_URL`: Managed by Heroku PostgreSQL.

## Troubleshooting
Check the logs if the app fails to start:
```bash
heroku logs --tail
```
