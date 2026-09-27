-- StockFlow Africa Database Schema
-- PostgreSQL Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    tax_number VARCHAR(100),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    role_id UUID,
    department_id UUID,
    store_id UUID,
    active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permissions
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    module VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role Permissions
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

-- Departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    department_id UUID REFERENCES departments(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    location TEXT,
    pos_enabled BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    parent_id UUID REFERENCES categories(id),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Units of Measure
CREATE TABLE units_of_measure (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    abbreviation VARCHAR(10),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_code VARCHAR(50) UNIQUE NOT NULL,
    barcode VARCHAR(100) UNIQUE,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    subcategory_id UUID REFERENCES categories(id),
    brand VARCHAR(100),
    unit_of_measure_id UUID REFERENCES units_of_measure(id),
    cost_price DECIMAL(15, 2) DEFAULT 0,
    average_cost DECIMAL(15, 2) DEFAULT 0,
    selling_price DECIMAL(15, 2) DEFAULT 0,
    reorder_level INTEGER DEFAULT 0,
    minimum_stock INTEGER DEFAULT 0,
    maximum_stock INTEGER DEFAULT 0,
    tax_code VARCHAR(50),
    active BOOLEAN DEFAULT true,
    tracking_type VARCHAR(20) DEFAULT 'NONE' CHECK (tracking_type IN ('NONE', 'BARCODE', 'BATCH', 'SERIAL')),
    batch_controlled BOOLEAN DEFAULT false,
    serial_controlled BOOLEAN DEFAULT false,
    expiry_controlled BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Balances
CREATE TABLE inventory_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    quantity_on_hand INTEGER DEFAULT 0,
    quantity_reserved INTEGER DEFAULT 0,
    quantity_available INTEGER GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,
    average_cost DECIMAL(15, 2) DEFAULT 0,
    stock_value DECIMAL(15, 2) GENERATED ALWAYS AS (quantity_on_hand * average_cost) STORED,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, store_id)
);

-- Inventory Transactions (Ledger)
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    product_id UUID REFERENCES products(id),
    store_id UUID REFERENCES stores(id),
    transaction_type VARCHAR(50) NOT NULL,
    document_type VARCHAR(50),
    document_id UUID,
    quantity_in INTEGER DEFAULT 0,
    quantity_out INTEGER DEFAULT 0,
    unit_cost DECIMAL(15, 2) DEFAULT 0,
    total_cost DECIMAL(15, 2) DEFAULT 0,
    balance_before INTEGER DEFAULT 0,
    balance_after INTEGER DEFAULT 0,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reference VARCHAR(255),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_number VARCHAR(50) UNIQUE NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    reference VARCHAR(255),
    notes TEXT,
    organization_id UUID REFERENCES organizations(id),
    department_id UUID REFERENCES departments(id),
    store_id UUID REFERENCES stores(id),
    created_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    posted_by UUID REFERENCES users(id),
    posted_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document Lines
CREATE TABLE document_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity DECIMAL(15, 2) NOT NULL,
    unit_cost DECIMAL(15, 2) DEFAULT 0,
    total_cost DECIMAL(15, 2) DEFAULT 0,
    description TEXT,
    batch_number VARCHAR(100),
    expiry_date DATE,
    serial_number VARCHAR(100),
    line_number INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    tax_number VARCHAR(100),
    payment_terms VARCHAR(100),
    credit_limit DECIMAL(15, 2) DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Requisitions
CREATE TABLE purchase_requisitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES suppliers(id),
    expected_delivery_date DATE,
    priority VARCHAR(20) DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Orders
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    purchase_requisition_id UUID REFERENCES purchase_requisitions(id),
    supplier_id UUID REFERENCES suppliers(id),
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    priority VARCHAR(20) DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Goods Receipts
CREATE TABLE goods_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    purchase_order_id UUID REFERENCES purchase_orders(id),
    supplier_id UUID REFERENCES suppliers(id),
    received_date DATE NOT NULL,
    received_by UUID REFERENCES users(id),
    vehicle_number VARCHAR(50),
    delivery_note VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Requisitions
CREATE TABLE requisitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    requested_by UUID REFERENCES users(id),
    required_date DATE,
    priority VARCHAR(20) DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
    justification TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock Issues
CREATE TABLE stock_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    requisition_id UUID REFERENCES requisitions(id),
    issued_by UUID REFERENCES users(id),
    issue_date DATE NOT NULL,
    capture_method VARCHAR(20) DEFAULT 'MANUAL' CHECK (capture_method IN ('CAMERA', 'MANUAL', 'USB_SCANNER')),
    destination_store_id UUID REFERENCES stores(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock Transfers
CREATE TABLE stock_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    from_store_id UUID REFERENCES stores(id),
    to_store_id UUID REFERENCES stores(id),
    transfer_date DATE NOT NULL,
    transferred_by UUID REFERENCES users(id),
    received_by UUID REFERENCES users(id),
    received_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock Returns
CREATE TABLE stock_returns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    original_issue_id UUID REFERENCES stock_issues(id),
    return_reason TEXT,
    returned_by UUID REFERENCES users(id),
    return_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock Adjustments
CREATE TABLE stock_adjustments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    adjustment_type VARCHAR(20) NOT NULL CHECK (adjustment_type IN ('IN', 'OUT')),
    reason TEXT NOT NULL,
    adjusted_by UUID REFERENCES users(id),
    adjustment_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock Counts
CREATE TABLE stock_counts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    store_id UUID REFERENCES stores(id),
    count_date DATE NOT NULL,
    counted_by UUID REFERENCES users(id),
    count_method VARCHAR(20) DEFAULT 'MANUAL' CHECK (count_method IN ('CAMERA', 'MANUAL', 'USB_SCANNER')),
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'POSTED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock Count Lines
CREATE TABLE stock_count_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_count_id UUID REFERENCES stock_counts(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    system_quantity INTEGER DEFAULT 0,
    counted_quantity INTEGER DEFAULT 0,
    variance INTEGER GENERATED ALWAYS AS (counted_quantity - system_quantity) STORED,
    line_number INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Batches
CREATE TABLE product_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    store_id UUID REFERENCES stores(id),
    batch_number VARCHAR(100) NOT NULL,
    manufacture_date DATE,
    expiry_date DATE,
    supplier_id UUID REFERENCES suppliers(id),
    quantity INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, store_id, batch_number)
);

-- Serial Numbers
CREATE TABLE serial_numbers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    product_id UUID REFERENCES products(id),
    store_id UUID REFERENCES stores(id),
    status VARCHAR(20) DEFAULT 'IN_STOCK' CHECK (status IN ('IN_STOCK', 'ISSUED', 'RETURNED', 'TRANSFERRED', 'RETIRED')),
    purchase_document_id UUID REFERENCES documents(id),
    current_holder_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Approval Workflows
CREATE TABLE approval_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Approval Steps
CREATE TABLE approval_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES approval_workflows(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    role_id UUID REFERENCES roles(id),
    approval_limit DECIMAL(15, 2) DEFAULT 0,
    required BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workflow_id, step_order)
);

-- Approval Actions
CREATE TABLE approval_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    workflow_id UUID REFERENCES approval_workflows(id),
    step_id UUID REFERENCES approval_steps(id),
    action VARCHAR(20) NOT NULL CHECK (action IN ('APPROVED', 'REJECTED', 'RETURNED')),
    action_by UUID REFERENCES users(id),
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- POS Terminals
CREATE TABLE pos_terminals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id),
    terminal_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255),
    location VARCHAR(255),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- POS Sessions
CREATE TABLE pos_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    terminal_id UUID REFERENCES pos_terminals(id),
    cashier_id UUID REFERENCES users(id),
    store_id UUID REFERENCES stores(id),
    session_date DATE NOT NULL,
    opening_time TIMESTAMP NOT NULL,
    closing_time TIMESTAMP,
    opening_cash DECIMAL(15, 2) DEFAULT 0,
    expected_closing_cash DECIMAL(15, 2) DEFAULT 0,
    actual_closing_cash DECIMAL(15, 2) DEFAULT 0,
    variance DECIMAL(15, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- POS Sales
CREATE TABLE pos_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    session_id UUID REFERENCES pos_sessions(id),
    customer_id UUID,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(15, 2) DEFAULT 0,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) DEFAULT 0,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- POS Sale Lines
CREATE TABLE pos_sale_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pos_sale_id UUID REFERENCES pos_sales(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity DECIMAL(15, 2) NOT NULL,
    unit_price DECIMAL(15, 2) DEFAULT 0,
    line_total DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    line_number INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- POS Payments
CREATE TABLE pos_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pos_sale_id UUID REFERENCES pos_sales(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    reference VARCHAR(255),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chart of Accounts
CREATE TABLE chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_code VARCHAR(50) UNIQUE NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE')),
    parent_id UUID REFERENCES chart_of_accounts(id),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Journal Entries
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_number VARCHAR(50) UNIQUE NOT NULL,
    entry_date DATE NOT NULL,
    entry_type VARCHAR(50) NOT NULL,
    reference VARCHAR(255),
    description TEXT,
    document_id UUID REFERENCES documents(id),
    posted BOOLEAN DEFAULT false,
    posted_by UUID REFERENCES users(id),
    posted_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Journal Lines
CREATE TABLE journal_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_id UUID REFERENCES chart_of_accounts(id),
    debit_amount DECIMAL(15, 2) DEFAULT 0,
    credit_amount DECIMAL(15, 2) DEFAULT 0,
    description TEXT,
    line_number INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fiscal Periods
CREATE TABLE fiscal_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period_name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'LOCKED')),
    organization_id UUID REFERENCES organizations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document Sequences
CREATE TABLE document_sequences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_type VARCHAR(50) UNIQUE NOT NULL,
    prefix VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    current_number INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50),
    reference_id UUID,
    reference_type VARCHAR(50),
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_users_store ON users(store_id);

CREATE INDEX idx_products_item_code ON products(item_code);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(active);

CREATE INDEX idx_inventory_balances_product ON inventory_balances(product_id);
CREATE INDEX idx_inventory_balances_store ON inventory_balances(store_id);

CREATE INDEX idx_inventory_transactions_product ON inventory_transactions(product_id);
CREATE INDEX idx_inventory_transactions_store ON inventory_transactions(store_id);
CREATE INDEX idx_inventory_transactions_type ON inventory_transactions(transaction_type);
CREATE INDEX idx_inventory_transactions_date ON inventory_transactions(transaction_date);

CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_organization ON documents(organization_id);
CREATE INDEX idx_documents_department ON documents(department_id);
CREATE INDEX idx_documents_store ON documents(store_id);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('SUPREME_ADMIN', 'Full system access'),
('ADMINISTRATOR', 'Operational management'),
('CENTRAL_STORE_MANAGER', 'Central store operations'),
('DEPARTMENT_STORE_MANAGER', 'Department store operations'),
('STORE_CLERK', 'Operational stock tasks'),
('POS_CASHIER', 'POS operations'),
('AUDITOR_VIEWER', 'Read-only access');

-- Insert default permissions
INSERT INTO permissions (name, description, module) VALUES
('inventory.view', 'View inventory', 'inventory'),
('inventory.create', 'Create inventory items', 'inventory'),
('inventory.edit', 'Edit inventory items', 'inventory'),
('inventory.adjust', 'Adjust inventory quantities', 'inventory'),
('inventory.count', 'Perform stock counts', 'inventory'),
('requisition.create', 'Create requisitions', 'requisition'),
('requisition.view', 'View requisitions', 'requisition'),
('requisition.approve', 'Approve requisitions', 'requisition'),
('requisition.reject', 'Reject requisitions', 'requisition'),
('purchase.create', 'Create purchase orders', 'purchase'),
('purchase.approve', 'Approve purchase orders', 'purchase'),
('purchase.view', 'View purchase orders', 'purchase'),
('receiving.create', 'Create goods receipts', 'receiving'),
('receiving.post', 'Post goods receipts', 'receiving'),
('issue.create', 'Create stock issues', 'issue'),
('issue.approve', 'Approve stock issues', 'issue'),
('issue.post', 'Post stock issues', 'issue'),
('transfer.create', 'Create stock transfers', 'transfer'),
('transfer.approve', 'Approve stock transfers', 'transfer'),
('transfer.post', 'Post stock transfers', 'transfer'),
('pos.use', 'Use POS system', 'pos'),
('pos.refund', 'Process POS refunds', 'pos'),
('pos.discount', 'Apply POS discounts', 'pos'),
('pos.override', 'Override POS prices', 'pos'),
('reports.view', 'View reports', 'reports'),
('reports.export', 'Export reports', 'reports'),
('users.manage', 'Manage users', 'admin'),
('roles.manage', 'Manage roles', 'admin'),
('stores.manage', 'Manage stores', 'admin'),
('departments.manage', 'Manage departments', 'admin'),
('accounting.view', 'View accounting', 'accounting'),
('accounting.post', 'Post accounting entries', 'accounting'),
('audit.view', 'View audit logs', 'audit');