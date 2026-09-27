# StockFlow Africa

A production-ready, full-stack inventory management system designed for African businesses. StockFlow Africa manages inventory, stores, procurement, issuing, departmental stock control, approvals, and optional POS functionality.

## Features

### Core Functionality
- **Inventory Management**: Complete product master with store-specific inventory balances
- **Transaction Engine**: Every stock movement is documented with full audit trail
- **Multi-Store Support**: Multiple stores with department-specific inventory
- **Approval Workflows**: Configurable multi-level approval system
- **POS Integration**: Optional point-of-sale module for retail operations
- **Barcode Scanning**: Camera-based barcode scanning for mobile devices
- **Reporting**: Comprehensive business reports and dashboards
- **Accounting-Ready**: Designed for seamless accounting integration

### Key Principles
- **Never directly edit stock quantities** - All movements originate from documented transactions
- **Complete audit trail** - Every action is logged and traceable
- **Role-based security** - Granular permissions enforced server-side
- **Mobile-responsive** - Works on desktop, tablet, and mobile devices
- **Real database** - No mock data or fake APIs in production

## Technology Stack

### Backend
- Node.js with TypeScript
- Express.js REST API
- PostgreSQL database
- JWT authentication with bcrypt
- Helmet security headers

### Frontend
- React with TypeScript
- React Router for navigation
- Axios for API calls
- Vite for fast development

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd StockFlowAfrica
```

2. Set up the database:
```bash
# Create PostgreSQL database
createdb stockflow_africa

# Run database schema
cd backend
psql -U postgres -d stockflow_africa -f src/config/database.sql
```

3. Configure backend:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
```

4. Seed development data:
```bash
npm run seed
```

5. Start backend server:
```bash
npm run dev
```

6. Configure frontend:
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with API URL (default: http://localhost:3000/api)
```

7. Start frontend server:
```bash
npm run dev
```

8. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Default Login Credentials
After running the seed script:
- Email: `admin@stockflow.africa`
- Username: `admin`
- Password: `Admin123!`

## Project Structure

```
StockFlowAfrica/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/          # Database configuration & seed
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth & error handling
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript types
│   │   └── index.ts         # Server entry point
│   └── package.json
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context (Auth)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx          # Main app component
│   └── package.json
└── DEVELOPMENT.md           # Detailed development guide
```

## API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `POST /api/users` - Create user
- `GET /api/users` - List users
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Departments
- `POST /api/departments` - Create department
- `GET /api/departments` - List departments
- `GET /api/departments/:id` - Get department details
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Stores
- `POST /api/stores` - Create store
- `GET /api/stores` - List stores
- `GET /api/stores/:id` - Get store details
- `PUT /api/stores/:id` - Update store
- `DELETE /api/stores/:id` - Delete store

## Development

For detailed development instructions, see [DEVELOPMENT.md](./DEVELOPMENT.md).

### Backend Commands
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run seed         # Seed development data
```

### Frontend Commands
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
```

## Implementation Status

### Phase 1 (Complete)
- ✅ Database schema with PostgreSQL
- ✅ Authentication system with JWT
- ✅ User management API
- ✅ Role-based authorization
- ✅ Department management API
- ✅ Store management API
- ✅ React frontend with authentication UI

### Phase 2 (In Progress)
- ⏳ Product master data
- ⏳ Inventory balance system
- ⏳ Inventory transaction engine
- ⏳ Inventory ledger

### Phase 3-11 (Planned)
- Requisitions and approval engine
- Purchasing and goods receiving
- Stock issues, returns, and transfers
- Camera barcode scanning
- POS module
- Stock counts and adjustments
- Accounting engine
- Reports and dashboards
- Mobile/PWA support

## Security

- Passwords hashed with bcrypt
- JWT token authentication
- Server-side authorization checks
- SQL injection prevention
- CORS properly configured
- Security headers with Helmet
- Comprehensive audit logging

## License

Proprietary - StockFlow Africa

## Support

For support and documentation, see [DEVELOPMENT.md](./DEVELOPMENT.md).