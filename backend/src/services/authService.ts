import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { checkDatabaseConnection } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { LoginDto, AuthResponse } from '../types/user.js';

export class AuthService {
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Check database connection first
    const dbConnected = await checkDatabaseConnection();
    if (!dbConnected) {
      throw new AppError('Database connection failed. Please ensure PostgreSQL is running and configured correctly.', 503);
    }

    const query = `
      SELECT 
        id, email, username, full_name, password_hash, 
        role_id, department_id, store_id, active
      FROM users 
      WHERE email = $1 OR username = $1
    `;

    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      throw new AppError('Invalid credentials', 401);
    }

    const user = result.rows[0];

    if (!user.active) {
      throw new AppError('Account is inactive', 403);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate JWT token
    const token = this.generateToken({
      id: user.id,
      email: user.email,
      roleId: user.role_id,
      departmentId: user.department_id,
      storeId: user.store_id
    });

    // Return user without password
    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };
  }

  private generateToken(payload: any): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError('Server configuration error: JWT_SECRET not set', 500);
    }

    return jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    } as jwt.SignOptions);
  }

  async hashPassword(password: string): Promise<string> {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    return bcrypt.hash(password, rounds);
  }
}