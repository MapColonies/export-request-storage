import { injectable } from 'tsyringe';
import { ConnectionManager } from '../DAL/connectionManager';
import { StatusesRepository } from '../DAL/statusesRepository';
import { StatusEntity } from '../entity/StatusEntity';
import { NotFoundError } from '../exceptions/notFoundError';

@injectable()
export class StatusService {
  private repository?: StatusesRepository;
  public constructor(private readonly connectionManager: ConnectionManager) {}

  public async get(id: string): Promise<StatusEntity> {
    const repository : StatusesRepository = await this.getRepository();
    const status : StatusEntity | undefined = await repository.get(id);
    if (!status) {
      throw new NotFoundError(`Status ID "${id}" was not fond`);
    }
    return status;
  }

  private async getRepository() : Promise<StatusesRepository> {
    if (!this.repository) {
      if (!this.connectionManager.isConnected()) {
        await this.connectionManager.init();
      }
      this.repository = this.connectionManager.getStatusRepository();
    }
    return this.repository;
  }
}
