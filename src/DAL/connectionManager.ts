import { readFileSync } from 'fs';
import {
  createConnection,
  Connection,
  ObjectType,
  ConnectionOptions,
} from 'typeorm';
import config from 'config';
import { delay, inject, injectable } from 'tsyringe';
import { MCLogger } from '@map-colonies/mc-logger';
import { IDbConfig } from '../common/interfaces';
import { StatusesRepository } from './statusesRepository';

@injectable()
export class ConnectionManager {
  private connection?: Connection;

  public constructor(
    @inject(delay(() => MCLogger)) private readonly logger: MCLogger
  ) {}

  public async init(): Promise<void> {
    const connectionConfig = config.get<IDbConfig>('typeOrm');
    this.logger.info(
      `connection to database ${connectionConfig.database as string} on ${
        connectionConfig.host as string
      }`
    );
    try {
      const options = this.createConnectionOptions(connectionConfig);
      this.connection = await createConnection(options);
    } catch (err) {
      const errString = JSON.stringify(err);
      this.logger.error(`failed to connect to database: ${errString}`);
      throw err;
    }
  }

  private createConnectionOptions(dbConfig: IDbConfig): ConnectionOptions {
    const { enableSslAuth, sslPaths, ...connectionOptions } = dbConfig;
    if (enableSslAuth) {
      connectionOptions.password = undefined;
      connectionOptions.ssl = {
        key: readFileSync(sslPaths.key),
        cert: readFileSync(sslPaths.cert),
        ca: readFileSync(sslPaths.ca),
      };
    }
    return connectionOptions;
  }

  public isConnected(): boolean {
    return this.connection !== undefined;
  }

  public getStatusRepository(): StatusesRepository {
    return this.getRepository(StatusesRepository);
  }

  private getRepository<T>(repository: ObjectType<T>): T {
    if (!this.isConnected()) {
      const msg = 'failed to send request to database: no open connection';
      this.logger.error(msg);
      throw new Error(msg);
    } else {
      const connection = this.connection as Connection;
      return connection.getCustomRepository(repository);
    }
  }
}
