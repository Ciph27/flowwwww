# StockFlow Africa - Production Deployment Guide

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - **Name**: `stockflow-africa`
   - **Database Password**: [Generate a strong password - save this!]
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for testing

### 1.2 Get Database Connection String

1. In your Supabase project dashboard
2. Go to **Settings** → **Database**
3. Find **Connection string**
4. Copy the **URI** format (starts with `postgresql://`)
5. It should look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### 1.3 Get API Keys

1. Go to **Settings** → **API**
2. Copy these keys:
   - **Project URL** (starts with `https://`)
   - **anon public** key
   - **service_role** key (never expose this to frontend!)

### 1.4 Apply Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `backend/src/config/database.sql`
4. Paste into the SQL editor
5. Click "Run" to execute the schema
6. Verify all tables were created successfully

### 1.5 Run Seed Script

1. In SQL Editor, run this to create admin user:
```sql
-- This will be done via the seed script, but you can also run manually if needed
-- The seed script uses bcrypt, so it's better to run it from the backend
```

## Step 2: Set Up Render

### 2.1 Create Render Account

1. Go to https://render.com
2. Sign up or log in
3. Connect your GitHub repository

### 2.2 Create Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure build settings:
   - **Name**: `stockflow-africa`
   - **Branch**: `main` (or your production branch)
   - **Runtime**: `Node`
   - **Build Command**: 
     ```
     cd backend && npm install && npm run build && cd ../frontend && npm install && npm run build
     ```
   - **Start Command**: 
     ```
     cd backend && npm start
     ```

### 2.3 Configure Environment Variables

Add these environment variables in Render:

**Database Configuration:**
- `DATABASE_URL`: [Your Supabase connection string]
- `SUPABASE_URL`: [Your Supabase project URL]
- `SUPABASE_ANON_KEY`: [Your Supabase anon key]
- `SUPABASE_SERVICE_ROLE_KEY`: [Your Supabase service role key]

**Server Configuration:**
- `NODE_ENV`: `production`
- `PORT`: `3000`
- `JWT_SECRET`: [Generate a strong secret - Render can auto-generate this]
- `JWT_EXPIRES_IN`: `24h`
- `BCRYPT_ROUNDS`: `12`

**CORS Configuration:**
- `CORS_ORIGIN`: [Your Render app URL, e.g., `https://stockflow-africa.onrender.com`]

### 2.4 Deploy

1. Click "Create Web Service"
2. Wait for build to complete
3. Render will provide a URL like: `https://stockflow-africa.onrender.com`

## Step 3: Update Frontend Configuration

After deployment, update the frontend to use the production API:

1. In Render dashboard, copy your app URL
2. Update `frontend/.env.production`:
   ```
   VITE_API_URL=https://your-app-url.onrender.com/api
   ```
3. Commit and push this change
4. Render will automatically redeploy

## Step 4: Run Seed Script in Production

You'll need to run the seed script to create the admin user:

### Option 1: Render Shell (Recommended)

1. In Render dashboard, go to your service
2. Click "Shell" tab
3. Run:
   ```bash
   cd backend
   npm run seed
   ```

### Option 2: Local with Production Database

1. Set your local `.env` to use production database
2. Run seed script locally
3. Revert to local database for development

## Step 5: Test Production Deployment

1. Access your Render app URL
2. Test login with admin credentials:
   - Email: `admin@stockflow.africa`
   - Password: `Admin123!`
3. Verify dashboard loads correctly
4. Test basic functionality

## Step 6: Verify Database Connection

Check the health endpoint:
```
https://your-app-url.onrender.com/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "environment": "production"
}
```

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Ensure password matches exactly
- Check SSL configuration

### Build Failures

- Check build logs in Render
- Verify all dependencies are in package.json
- Ensure TypeScript compiles correctly

### Authentication Issues

- Verify `JWT_SECRET` is set
- Check CORS origin matches your app URL
- Ensure database users table exists

### Frontend Not Loading

- Check frontend build completed successfully
- Verify static files are being served
- Check API base URL is correct

## Security Checklist

- [ ] Never commit `.env` files with real secrets
- [ ] Use strong passwords for database
- [ ] Enable SSL for all connections
- [ ] Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting in production
- [ ] Keep dependencies updated
- [ ] Monitor logs for suspicious activity

## Maintenance

### Regular Backups

Supabase automatically backs up your database, but verify:
- Backup retention period
- Point-in-time recovery options
- Export functionality for manual backups

### Monitoring

- Monitor Render service health
- Check database connection pool usage
- Review error logs regularly
- Set up alerts for failures

### Updates

- Keep Node.js version updated
- Update dependencies regularly
- Test updates in staging first
- Monitor for security advisories