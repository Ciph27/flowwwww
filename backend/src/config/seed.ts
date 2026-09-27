import pool from './database.js';
import bcrypt from 'bcrypt';

async function seed() {
  console.log('Starting database seed...');

  try {
    // Create organization
    const orgResult = await pool.query(
      `INSERT INTO organizations (name, code, address, phone, email) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (code) DO NOTHING 
       RETURNING *`,
      ['Nehanda Technologies', 'NEHANDA', 'Harare, Zimbabwe', '+263 4 123 456', 'info@nehandatech.co.zw']
    );

    const organization = orgResult.rows[0];
    console.log('Organization created:', organization?.name || 'Already exists');

    // Create departments
    const departments = [
      { name: 'Automotive', code: 'AUTO' },
      { name: 'Engineering', code: 'ENG' },
      { name: 'ICT', code: 'ICT' },
      { name: 'Hospitality', code: 'HOSP' },
      { name: 'Administration', code: 'ADMIN' },
      { name: 'Tuckshop', code: 'TUCK' }
    ];

    const departmentIds: Record<string, string> = {};

    for (const dept of departments) {
      const result = await pool.query(
        `INSERT INTO departments (organization_id, name, code) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (code) DO NOTHING 
         RETURNING *`,
        [organization?.id, dept.name, dept.code]
      );
      if (result.rows[0]) {
        departmentIds[dept.code] = result.rows[0].id;
        console.log('Department created:', dept.name);
      }
    }

    // Create stores
    const stores = [
      { name: 'Central Stores', code: 'CENTRAL', department_code: null },
      { name: 'Automotive Store', code: 'AUTO_STORE', department_code: 'AUTO' },
      { name: 'Engineering Store', code: 'ENG_STORE', department_code: 'ENG' },
      { name: 'ICT Store', code: 'ICT_STORE', department_code: 'ICT' },
      { name: 'Hospitality Store', code: 'HOSP_STORE', department_code: 'HOSP' },
      { name: 'Tuckshop', code: 'TUCK_STORE', department_code: 'TUCK', pos_enabled: true }
    ];

    const storeIds: Record<string, string> = {};

    for (const store of stores) {
      const deptId = store.department_code ? departmentIds[store.department_code] : null;
      const result = await pool.query(
        `INSERT INTO stores (organization_id, department_id, name, code, pos_enabled) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (code) DO NOTHING 
         RETURNING *`,
        [organization?.id, deptId, store.name, store.code, store.pos_enabled || false]
      );
      if (result.rows[0]) {
        storeIds[store.code] = result.rows[0].id;
        console.log('Store created:', store.name);
      }
    }

    // Get Supreme Admin role
    const roleResult = await pool.query(
      "SELECT id FROM roles WHERE name = 'SUPREME_ADMIN'"
    );
    const adminRoleId = roleResult.rows[0]?.id;

    if (!adminRoleId) {
      throw new Error('SUPREME_ADMIN role not found');
    }

    // Create admin user
    const passwordHash = await bcrypt.hash('Admin123!', 12);
    
    const userResult = await pool.query(
      `INSERT INTO users (organization_id, full_name, email, username, password_hash, role_id, active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       ON CONFLICT (email) DO NOTHING 
       RETURNING *`,
      [organization?.id, 'System Administrator', 'admin@stockflow.africa', 'admin', passwordHash, adminRoleId, true]
    );

    if (userResult.rows[0]) {
      console.log('Admin user created');
      console.log('Email: admin@stockflow.africa');
      console.log('Username: admin');
      console.log('Password: Admin123!');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Database seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (process.argv[1] === 'seed.ts') {
  seed()
    .then(() => {
      console.log('Seed process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed process failed:', error);
      process.exit(1);
    });
}

export default seed;