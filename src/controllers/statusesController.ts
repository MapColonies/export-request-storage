import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { injectable } from 'tsyringe';
import { InsertResult, UpdateResult } from 'typeorm';
import { StatusService } from '../services/statusesService';
import { StatusData } from '../models/statusData';
import { SearchOrder } from '../models/searchOptions';

@injectable()
export class StatusController {
  public constructor(private readonly service: StatusService) {}

  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const updatedTimeOrder: SearchOrder = req.query.updatedTime as SearchOrder;
      const data = await this.service.getAll(updatedTimeOrder);
      return res.status(httpStatus.OK).json(data);
    } catch (err) {
      return next(err);
    }
  }


  public async get(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const id = req.params.taskId;
      const data = await this.service.get(id);
      return res.status(httpStatus.OK).json(data);
    } catch (err) {
      return next(err);
    }
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const status: StatusData = req.body as StatusData;
      const data: InsertResult = await this.service.create(status);
      return res.status(httpStatus.OK).json(data);
    } catch (err) {
      return next(err);
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const status: StatusData = req.body as StatusData;
      const data: UpdateResult = await this.service.update(status);
      
      return res.status(httpStatus.OK).json(data);
    } catch (err) {
      return next(err);
    }
  }

  public async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const taskIds: string[] = req.body as string[];
      const data = await this.service.delete(taskIds);
      return res.status(httpStatus.OK).json(data);
    } catch (err) {
      return next(err);
    }
  }

  public async getStatusesByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId: string = req.params.userId;
      const updatedTime: SearchOrder = req.query.updatedTime as SearchOrder;
      const data = await this.service.statusesByUserId(userId, updatedTime);
      return res.status(httpStatus.OK).json(data);
    } catch (err) {
      return next(err);
    }
  }

  public async getStatusesBeforeExpiredDate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {;
      const date: string = req.params.date;
      const data = await this.service.statusesBeforeExpiredDate(date);
      return res.status(httpStatus.OK).json(data);
    } catch (err) {
      return next(err);
    }
  }
}
