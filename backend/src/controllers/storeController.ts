import { Request, Response, NextFunction } from 'express';
import { StoreService } from '../services/storeService.js';
import { AppError } from '../middleware/errorHandler.js';
import { CreateStoreDto, UpdateStoreDto } from '../types/store.js';

export class StoreController {
  private storeService: StoreService;

  constructor() {
    this.storeService = new StoreService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createStoreDto: CreateStoreDto = req.body;
      const store = await this.storeService.create(createStoreDto);
      res.status(201).json(store);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stores = await this.storeService.findAll();
      res.json(stores);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const store = await this.storeService.findById(id);
      res.json(store);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateStoreDto: UpdateStoreDto = req.body;
      const store = await this.storeService.update(id, updateStoreDto);
      res.json(store);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.storeService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}