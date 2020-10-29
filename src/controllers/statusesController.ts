import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { injectable } from 'tsyringe';
import { StatusService } from '../services/statusesService';
import { StatusData } from '../models/statusData';

@injectable()
export class StatusController {
  public constructor(private readonly service: StatusService) {}

  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const data = await this.service.getAll();
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
      const status : StatusData = req.body;
      const data = await this.service.create(status);
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
      const status : StatusData = req.body;
      const data = await this.service.update(status);
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
      const taskId: string = req.params.taskId;
      const data = await this.service.delete(taskId);
      return res.status(httpStatus.OK).json(data);
    } catch (err) {
      return next(err);
    }
  }
}
