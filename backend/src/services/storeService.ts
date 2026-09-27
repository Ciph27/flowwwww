import pool from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { Store, CreateStoreDto, UpdateStoreDto } from '../types/store.js';

export class StoreService {
  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const { name, code, location, pos_enabled, organization_id, department_id } = createStoreDto;

    // Check if code already exists
    const existingStore = await pool.query(
      'SELECT id FROM stores WHERE code = $1',
      [code]
    );

    if (existingStore.rows.length > 0) {
      throw new AppError('Store code already exists', 409);
    }

    const query = `
      INSERT INTO stores (name, code, location, pos_enabled, organization_id, department_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const result = await pool.query(query, [
      name, code, location, pos_enabled || false, organization_id, department_id
    ]);
    return result.rows[0];
  }

  async findAll(): Promise<Store[]> {
    const query = `
      SELECT s.*, d.name as department_name
      FROM stores s
      LEFT JOIN departments d ON s.department_id = d.id
      ORDER BY s.name ASC
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  async findById(id: string): Promise<Store> {
    const query = `
      SELECT s.*, d.name as department_name
      FROM stores s
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE s.id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new AppError('Store not found', 404);
    }

    return result.rows[0];
  }

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const { name, code, location, pos_enabled, active, department_id } = updateStoreDto;

    // Check if store exists
    const existingStore = await this.findById(id);

    // Check if code is being changed and if it conflicts
    if (code && code !== existingStore.code) {
      const conflictCheck = await pool.query(
        'SELECT id FROM stores WHERE code = $1 AND id != $2',
        [code, id]
      );

      if (conflictCheck.rows.length > 0) {
        throw new AppError('Store code already exists', 409);
      }
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (code !== undefined) {
      updates.push(`code = $${paramCount++}`);
      values.push(code);
    }
    if (location !== undefined) {
      updates.push(`location = $${paramCount++}`);
      values.push(location);
    }
    if (pos_enabled !== undefined) {
      updates.push(`pos_enabled = $${paramCount++}`);
      values.push(pos_enabled);
    }
    if (active !== undefined) {
      updates.push(`active = $${paramCount++}`);
      values.push(active);
    }
    if (department_id !== undefined) {
      updates.push(`department_id = $${paramCount++}`);
      values.push(department_id);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE stores
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    const query = 'DELETE FROM stores WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      throw new AppError('Store not found', 404);
    }
  }
}