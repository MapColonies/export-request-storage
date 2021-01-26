import { createConnection, Connection, ObjectType } from 'typeorm';
import config from 'config';
import { delay, inject, injectable } from 'tsyringe';
import { MCLogger } from '@map-colonies/mc-logger';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { StatusesRepository } from './statusesRepository';
import { promises as FsPromises } from 'fs';
import { TlsOptions } from 'tls';

@injectable()
export class ConnectionManager {
  private connection?: Connection;

  public constructor(
    @inject(delay(() => MCLogger)) private readonly logger: MCLogger
  ) {}

  private async initSSLConnection(connectionConfig : PostgresConnectionOptions): Promise<void> {
    const tlsConfigurations = connectionConfig.ssl as TlsOptions;
    if (
      tlsConfigurations !== undefined &&
      tlsConfigurations.ca &&
      tlsConfigurations.cert &&
      tlsConfigurations.key
    ) {
      const encoding = 'utf-8';
      const sslFiles = await Promise.all([
        FsPromises.readFile(tlsConfigurations.ca as string, encoding),
        FsPromises.readFile(tlsConfigurations.cert as string, encoding),
        FsPromises.readFile(tlsConfigurations.key as string, encoding),
      ]);
      tlsConfigurations.ca =  sslFiles[0],
      tlsConfigurations.cert = sslFiles[1],
      tlsConfigurations.key = sslFiles[2] 
    }
  }

  public async init(): Promise<void> {
    const connectionConfig = config.get<PostgresConnectionOptions>('typeOrm');
    this.logger.info(
      `connection to database ${connectionConfig.database as string} on ${
        connectionConfig.host as string
      }`
    );
    try {
      await this.initSSLConnection(connectionConfig);
      this.connection = await createConnection(connectionConfig);
    } catch (err) {
      const errString = JSON.stringify(err);
      this.logger.error(`failed to connect to database: ${errString}`);
      throw err;
    }
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
