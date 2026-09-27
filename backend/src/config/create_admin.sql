-- StockFlow Africa - Admin User Creation Script
-- Run this in Supabase SQL Editor after applying the main schema

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

-- Get the organization ID for user creation
DO $$
DECLARE
    org_id UUID;
    admin_role_id UUID;
BEGIN
    -- Get the organization ID
    SELECT id INTO org_id FROM organizations WHERE code = 'NEHANDA' LIMIT 1;
    
    -- Get the Supreme Admin role ID
    SELECT id INTO admin_role_id FROM roles WHERE name = 'SUPREME_ADMIN' LIMIT 1;
    
    -- Create admin user with bcrypt-hashed password for "Admin123!"
    -- This hash was generated using bcrypt with 12 rounds
    INSERT INTO users (organization_id, full_name, email, username, password_hash, role_id, active)
    VALUES (
        org_id,
        'System Administrator',
        'admin@stockflow.africa',
        'admin',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NiyEWdyZ7.5u', -- bcrypt hash of "Admin123!"
        admin_role_id,
        true
    )
    ON CONFLICT (email) DO NOTHING;
    
    RAISE NOTICE 'Admin user created successfully';
    RAISE NOTICE 'Email: admin@stockflow.africa';
    RAISE NOTICE 'Username: admin';
    RAISE NOTICE 'Password: Admin123!';
END $$;