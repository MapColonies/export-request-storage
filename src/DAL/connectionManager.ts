import { promises as FsPromises } from 'fs';
import { TlsOptions } from 'tls';
import { createConnection, Connection, ObjectType } from 'typeorm';
import config from 'config';
import { delay, inject, injectable } from 'tsyringe';
import { MCLogger } from '@map-colonies/mc-logger';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { StatusesRepository } from './statusesRepository';

@injectable()
export class ConnectionManager {
  private connection?: Connection;

  public constructor(
    @inject(delay(() => MCLogger)) private readonly logger: MCLogger
  ) {}

  public async init(): Promise<void> {
    const connectionConfig = config.get<unknown>(
      'typeOrm'
    ) as PostgresConnectionOptions;
    this.logger.info(
      `connection to database ${connectionConfig.database as string} on ${
        connectionConfig.host as string
      }`
    );
    try {
      // We do it in order to override the readonly for SSL property
      const duplicateConfig = { ...connectionConfig };
      await this.initSSLConnection(duplicateConfig);
      this.connection = await createConnection(duplicateConfig);
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

  private async initSSLConnection(
    connectionConfig: PostgresConnectionOptions
  ): Promise<void> {
    const tlsConfigurations = connectionConfig.ssl as TlsOptions;
    if (
      Boolean(tlsConfigurations.ca) &&
      Boolean(tlsConfigurations.cert) &&
      Boolean(tlsConfigurations.key)
    ) {
      const encoding = 'utf-8';
      const sslFiles = await Promise.all([
        FsPromises.readFile(tlsConfigurations.ca as string, encoding),
        FsPromises.readFile(tlsConfigurations.cert as string, encoding),
        FsPromises.readFile(tlsConfigurations.key as string, encoding),
      ]);
      tlsConfigurations.ca = sslFiles[0];
      tlsConfigurations.cert = sslFiles[1];
      tlsConfigurations.key = sslFiles[2];
      this.logger.info(`Succesfully loaded SSL configurations`);
    } else {
      (connectionConfig.ssl as boolean) = false;
      this.logger.info(`No SSL configurations received`);
    }
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
