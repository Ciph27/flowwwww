# StockFlow Africa - Development Guide

## Project Overview

StockFlow Africa is a production-ready, full-stack inventory management system designed for African businesses. The system manages inventory, stores, procurement, issuing, departmental stock control, approvals, and optional POS functionality.

**Core Principle**: Never directly edit stock quantities. Every stock movement must originate from a documented transaction.

## Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT with bcrypt password hashing
- **Other**: Helmet, CORS, express-validator

### Frontend
- **Framework**: React with TypeScript
- **Routing**: React Router
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Project Structure

```
StockFlowAfrica/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, error handling
│   │   ├── models/          # Data models (future)
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   └── index.ts         # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context (Auth)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   └── .env.example
└── DEVELOPMENT.md
```

## Environment Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE stockflow_africa;
```

2. Run the database schema:
```bash
cd backend
psql -U postgres -d stockflow_africa -f src/config/database.sql
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stockflow_africa
DB_USER=postgres
DB_PASSWORD=your_password_here
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here_change_in_production
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173
BCRYPT_ROUNDS=12
```

5. Start the development server:
```bash
npm run dev
```

The backend server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Database Schema

The database uses PostgreSQL with the following key tables:

### Core Tables
- `organizations` - Organization data
- `users` - User accounts with authentication
- `roles` - User roles (SUPREME_ADMIN, ADMINISTRATOR, etc.)
- `permissions` - Granular permissions
- `role_permissions` - Role-permission mapping
- `departments` - Organizational departments
- `stores` - Physical stores with POS configuration

### Inventory Tables
- `products` - Product master data
- `inventory_balances` - Store-specific inventory balances
- `inventory_transactions` - Transaction ledger (never deleted)
- `categories` - Product categories
- `units_of_measure` - Measurement units

### Transaction Tables
- `documents` - Generic document system
- `document_lines` - Document line items
- `requisitions` - Department requisitions
- `purchase_requisitions` - Purchase requests
- `purchase_orders` - Purchase orders
- `goods_receipts` - Goods received notes
- `stock_issues` - Stock issue documents
- `stock_transfers` - Stock transfer documents
- `stock_returns` - Stock return documents
- `stock_adjustments` - Stock adjustments
- `stock_counts` - Stock count sessions

### POS Tables
- `pos_terminals` - POS terminals
- `pos_sessions` - Cashier sessions
- `pos_sales` - Sales transactions
- `pos_sale_lines` - Sale line items
- `pos_payments` - Payment records
- `customers` - Customer data

### Accounting Tables
- `chart_of_accounts` - Chart of accounts
- `journal_entries` - Journal entries
- `journal_lines` - Journal line items
- `fiscal_periods` - Fiscal period management

### System Tables
- `suppliers` - Supplier master
- `approval_workflows` - Approval workflow configuration
- `approval_steps` - Approval step definitions
- `approval_actions` - Approval action history
- `product_batches` - Batch tracking
- `serial_numbers` - Serial number tracking
- `document_sequences` - Document number sequences
- `notifications` - User notifications
- `audit_logs` - Comprehensive audit trail

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `POST /api/users` - Create user
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Departments
- `POST /api/departments` - Create department
- `GET /api/departments` - List all departments
- `GET /api/departments/:id` - Get department by ID
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Stores
- `POST /api/stores` - Create store
- `GET /api/stores` - List all stores
- `GET /api/stores/:id` - Get store by ID
- `PUT /api/stores/:id` - Update store
- `DELETE /api/stores/:id` - Delete store

## Development Commands

### Backend
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
```

### Frontend
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Authentication Flow

1. User logs in with email/username and password
2. Backend validates credentials and generates JWT token
3. Token is stored in localStorage
4. Token is included in Authorization header for all subsequent requests
5. Token expires after configured time (default 24h)
6. Middleware validates token on protected routes

## Authorization

The system implements role-based access control (RBAC) with granular permissions:

### Roles
- SUPREME_ADMIN - Full system access
- ADMINISTRATOR - Operational management
- CENTRAL_STORE_MANAGER - Central store operations
- DEPARTMENT_STORE_MANAGER - Department store operations
- STORE_CLERK - Operational stock tasks
- POS_CASHIER - POS operations
- AUDITOR_VIEWER - Read-only access

### Permissions
Permissions are checked server-side on every protected endpoint. Examples:
- `inventory.view`, `inventory.create`, `inventory.edit`
- `requisition.create`, `requisition.approve`
- `purchase.create`, `purchase.approve`
- `pos.use`, `pos.refund`
- `users.manage`, `roles.manage`

## Implementation Phases

### Phase 1 (Complete)
- Database schema setup
- Authentication system
- User management
- Role-based authorization
- Department management
- Store management
- Basic frontend with login

### Phase 2 (Next)
- Product master data
- Inventory balance system
- Inventory transaction engine
- Inventory ledger

### Phase 3
- Requisitions
- Approval engine
- Approval workflows

### Phase 4
- Purchasing
- Purchase orders
- Goods receiving

### Phase 5
- Stock issues
- Stock returns
- Stock transfers

### Phase 6
- Camera barcode scanning
- Manual entry systems

### Phase 7
- POS module
- POS sessions
- POS sales and payments

### Phase 8
- Stock counts
- Stock adjustments
- Batch tracking
- Serial number tracking

### Phase 9
- Accounting engine
- Chart of accounts
- Journal entries

### Phase 10
- Reports generation
- Export functionality
- Dashboards

### Phase 11
- Mobile/PWA support
- Performance optimization
- Security hardening

## Testing

### Backend Testing
```bash
cd backend
npm test              # Run tests (to be implemented)
```

### Frontend Testing
```bash
cd frontend
npm test              # Run tests (to be implemented)
```

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- CORS properly configured
- Helmet for security headers
- SQL injection prevention through parameterized queries
- Server-side authorization checks
- Audit logging for all important actions

## Deployment

### Backend Deployment
1. Build the TypeScript code:
```bash
cd backend
npm run build
```

2. Set production environment variables
3. Start the production server:
```bash
npm start
```

### Frontend Deployment
1. Build the React app:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to your web server

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists: `psql -U postgres -l`

### Frontend API Connection Issues
- Verify backend is running on correct port
- Check `VITE_API_URL` in frontend `.env`
- Check CORS configuration in backend

### Authentication Issues
- Verify JWT_SECRET is set in backend `.env`
- Check token expiration time
- Clear localStorage and try logging in again

## Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Write meaningful commit messages
4. Test changes before committing
5. Update documentation as needed

## License

Proprietary - StockFlow Africa