import pool from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { User, CreateUserDto, UpdateUserDto } from '../types/user.js';
import { AuthService } from './authService.js';

export class UserService {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { 
      full_name, email, username, phone, password, 
      role_id, department_id, store_id 
    } = createUserDto;

    // Check if email or username already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      throw new AppError('Email or username already exists', 409);
    }

    // Hash password
    const password_hash = await this.authService.hashPassword(password);

    const query = `
      INSERT INTO users (full_name, email, username, phone, password_hash, role_id, department_id, store_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const result = await pool.query(query, [
      full_name, email, username, phone, password_hash, 
      role_id, department_id, store_id
    ]);

    const { password_hash: _, ...userWithoutPassword } = result.rows[0];
    return userWithoutPassword;
  }

  async findAll(): Promise<User[]> {
    const query = `
      SELECT id, organization_id, full_name, email, username, phone, 
             role_id, department_id, store_id, active, last_login, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  async findById(id: string): Promise<User> {
    const query = `
      SELECT id, organization_id, full_name, email, username, phone, 
             role_id, department_id, store_id, active, last_login, created_at, updated_at
      FROM users
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    return result.rows[0];
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { full_name, email, username, phone, role_id, department_id, store_id, active } = updateUserDto;

    // Check if user exists
    const existingUser = await this.findById(id);

    // Check if email/username is being changed and if it conflicts
    if (email || username) {
      const conflictCheck = await pool.query(
        'SELECT id FROM users WHERE (email = $1 OR username = $2) AND id != $3',
        [email || existingUser.email, username || existingUser.username, id]
      );

      if (conflictCheck.rows.length > 0) {
        throw new AppError('Email or username already exists', 409);
      }
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (full_name !== undefined) {
      updates.push(`full_name = $${paramCount++}`);
      values.push(full_name);
    }
    if (email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }
    if (username !== undefined) {
      updates.push(`username = $${paramCount++}`);
      values.push(username);
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramCount++}`);
      values.push(phone);
    }
    if (role_id !== undefined) {
      updates.push(`role_id = $${paramCount++}`);
      values.push(role_id);
    }
    if (department_id !== undefined) {
      updates.push(`department_id = $${paramCount++}`);
      values.push(department_id);
    }
    if (store_id !== undefined) {
      updates.push(`store_id = $${paramCount++}`);
      values.push(store_id);
    }
    if (active !== undefined) {
      updates.push(`active = $${paramCount++}`);
      values.push(active);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, organization_id, full_name, email, username, phone, 
                role_id, department_id, store_id, active, last_login, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      throw new AppError('User not found', 404);
    }
  }
}