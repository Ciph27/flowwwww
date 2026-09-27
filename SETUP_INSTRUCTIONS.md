# StockFlow Africa - Database Setup Instructions

## Step 1: Apply Database Schema to Supabase

### Manual Method (Recommended for first setup):

1. Go to your Supabase project: https://fejgmjjxudpnstdyldac.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Click **"New Query"**
4. Copy the entire contents of `backend/src/config/database.sql`
5. Paste it into the SQL editor
6. Click **"Run"** to execute the schema
7. Wait for all tables to be created (this may take a minute)

### What the schema creates:
- 40+ database tables including users, roles, permissions, inventory, transactions, etc.
- Proper indexes and foreign keys
- Default roles and permissions
- All required relationships

## Step 2: Create Admin User

### Method 1: Use the Seed Script (After Deployment)

Once the app is deployed to Render, you can run the seed script:
1. Go to your Render service
2. Click the **"Shell"** tab
3. Run: `cd backend && npm run seed`

### Method 2: Manual Creation (Immediate)

Run this SQL in Supabase SQL Editor to create the admin user immediately:

```sql
-- First, let's create the organization
INSERT INTO organizations (name, code, address, phone, email) 
VALUES ('Nehanda Technologies', 'NEHANDA', 'Harare, Zimbabwe', '+263 4 123 456', 'info@nehandatech.co.zw')
ON CONFLICT (code) DO NOTHING;

-- Create departments
INSERT INTO departments (name, code) VALUES
('Automotive', 'AUTO'),
('Engineering', 'ENG'),
('ICT', 'ICT'),
('Hospitality', 'HOSP'),
('Administration', 'ADMIN'),
('Tuckshop', 'TUCK')
ON CONFLICT (code) DO NOTHING;

-- Create stores
INSERT INTO stores (name, code, pos_enabled) VALUES
('Central Stores', 'CENTRAL', false),
('Automotive Store', 'AUTO_STORE', false),
('Engineering Store', 'ENG_STORE', false),
('ICT Store', 'ICT_STORE', false),
('Hospitality Store', 'HOSP_STORE', false),
('Tuckshop', 'TUCK_STORE', true)
ON CONFLICT (code) DO NOTHING;

-- Create admin user (password: Admin123!)
-- Note: You'll need to use bcrypt to hash the password properly
-- The seed script handles this, so Method 1 is preferred
```

## Step 3: Verify Database Setup

### Check Tables:
1. In Supabase, go to **Table Editor**
2. Verify all tables are visible
3. Check that `users`, `roles`, `permissions`, `departments`, `stores` tables exist

### Test Connection:
The backend health check will verify database connectivity once deployed.

## Step 4: Deploy to Render

### Pre-deployment Checklist:
- [ ] Database schema applied to Supabase
- [ ] Render YAML configured with correct credentials
- [ ] Environment variables set
- [ ] Frontend build tested locally

### Deployment Steps:
1. Push your code to GitHub
2. Go to https://render.com
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Use the configuration from `render.yaml`
6. Click **"Create Web Service"**
7. Wait for deployment to complete

## Step 5: Post-Deployment Setup

### Update CORS Origin:
Once deployed, you'll get a Render URL like `https://stockflow-africa-xxxx.onrender.com`
1. Update `CORS_ORIGIN` in Render environment variables
2. Redeploy the service

### Run Seed Script:
1. In Render service, go to **"Shell"** tab
2. Run: `cd backend && npm run seed`
3. This will create the admin user with credentials:
   - Email: `admin@stockflow.africa`
   - Password: `Admin123!`

### Test the Application:
1. Access your Render URL
2. Navigate to `/login`
3. Login with admin credentials
4. Verify dashboard loads correctly

## Troubleshooting

### Database Connection Issues:
- Verify DATABASE_URL is correct in Render
- Check Supabase project is active
- Ensure password matches exactly

### Build Failures:
- Check Render build logs
- Verify all dependencies are installed
- Ensure TypeScript compiles successfully

### Schema Issues:
- Run schema in Supabase SQL Editor
- Check for any constraint violations
- Verify all tables were created successfully