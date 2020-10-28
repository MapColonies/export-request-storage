import express from 'express';
import { initAsync as validatorInit } from 'openapi-validator-middleware';
import { MCLogger } from '@map-colonies/mc-logger';
import { injectable } from 'tsyringe';
import { json as jsonParser } from 'body-parser';
import { RequestLogger } from './middleware/requestLogger';
import { ErrorHandler } from './middleware/errorHandler';
import { globalRouter } from './routers/global';

@injectable()
export class ServerBuilder {
  private readonly serverInstance = express();

  public constructor(
    private readonly logger: MCLogger,
    private readonly requestLogger: RequestLogger,
    private readonly errorHandler: ErrorHandler
  ) {
    this.serverInstance = express();
  }

  public async build(): Promise<express.Application> {
    //initiate swagger validator
    await validatorInit('./docs/openapi3.yaml');

    this.serverInstance.use(jsonParser());
    this.serverInstance.use(this.requestLogger.getLoggerMiddleware());
    this.serverInstance.use(globalRouter);
    this.serverInstance.use(this.errorHandler.getErrorHandlerMiddleware());

    return this.serverInstance;
  }
}
