import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { injectable } from 'tsyringe';
import { StatusService } from '../services/statusesService';

@injectable()
export class ImagesController {
  public constructor(private readonly service: StatusService) {}

  public async get(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const id = req.params['id'];
      const data = await this.service.get(id);
      return res.status(httpStatus.OK).json(data);
    } catch (err) {
      return next(err);
    }
  }
}
