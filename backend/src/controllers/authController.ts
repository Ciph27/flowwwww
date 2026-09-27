import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import { AppError } from '../middleware/errorHandler.js';
import { LoginDto } from '../types/user.js';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginDto: LoginDto = req.body;
      const result = await this.authService.login(loginDto);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // In a real implementation, you might want to invalidate the token
      // For now, we'll just return success
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: any, res: Response, next: NextFunction) => {
    try {
      // Return the authenticated user info from the middleware
      res.json({ user: req.user });
    } catch (error) {
      next(error);
    }
  };
}