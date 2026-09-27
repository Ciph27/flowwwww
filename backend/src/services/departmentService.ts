import pool from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { Department, CreateDepartmentDto, UpdateDepartmentDto } from '../types/department.js';

export class DepartmentService {
  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const { name, code, description, organization_id } = createDepartmentDto;

    // Check if code already exists
    const existingDepartment = await pool.query(
      'SELECT id FROM departments WHERE code = $1',
      [code]
    );

    if (existingDepartment.rows.length > 0) {
      throw new AppError('Department code already exists', 409);
    }

    const query = `
      INSERT INTO departments (name, code, description, organization_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await pool.query(query, [name, code, description, organization_id]);
    return result.rows[0];
  }

  async findAll(): Promise<Department[]> {
    const query = `
      SELECT * FROM departments
      ORDER BY name ASC
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  async findById(id: string): Promise<Department> {
    const query = 'SELECT * FROM departments WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new AppError('Department not found', 404);
    }

    return result.rows[0];
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    const { name, code, description, active } = updateDepartmentDto;

    // Check if department exists
    const existingDepartment = await this.findById(id);

    // Check if code is being changed and if it conflicts
    if (code && code !== existingDepartment.code) {
      const conflictCheck = await pool.query(
        'SELECT id FROM departments WHERE code = $1 AND id != $2',
        [code, id]
      );

      if (conflictCheck.rows.length > 0) {
        throw new AppError('Department code already exists', 409);
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
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (active !== undefined) {
      updates.push(`active = $${paramCount++}`);
      values.push(active);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE departments
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    const query = 'DELETE FROM departments WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      throw new AppError('Department not found', 404);
    }
  }
}