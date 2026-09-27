import { Request, Response, NextFunction } from 'express';
import { DepartmentService } from '../services/departmentService.js';
import { AppError } from '../middleware/errorHandler.js';
import { CreateDepartmentDto, UpdateDepartmentDto } from '../types/department.js';

export class DepartmentController {
  private departmentService: DepartmentService;

  constructor() {
    this.departmentService = new DepartmentService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createDepartmentDto: CreateDepartmentDto = req.body;
      const department = await this.departmentService.create(createDepartmentDto);
      res.status(201).json(department);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const departments = await this.departmentService.findAll();
      res.json(departments);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const department = await this.departmentService.findById(id as string);
      res.json(department);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateDepartmentDto: UpdateDepartmentDto = req.body;
      const department = await this.departmentService.update(id as string, updateDepartmentDto);
      res.json(department);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.departmentService.delete(id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}