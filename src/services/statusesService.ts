import { injectable } from 'tsyringe';
import { UpdateResult, InsertResult, DeleteResult } from 'typeorm';
import { ConnectionManager } from '../DAL/connectionManager';
import { StatusesRepository } from '../DAL/statusesRepository';
import { StatusEntity } from '../entity/statusEntity';
import { NotFoundError } from '../exceptions/notFoundError';
import { StatusData } from '../models/statusData';
import { SearchOrder } from '../models/searchOptions';

@injectable()
export class StatusService {
  private repository?: StatusesRepository;
  public constructor(private readonly connectionManager: ConnectionManager) {}

  public async getAll(updatedTime : SearchOrder): Promise<StatusEntity[]> {
    const defaultValue : SearchOrder = "DESC";
    const options : SearchOrder[] = ["ASC", "DESC", 1, -1]; // eslint-disable-line
    if (!options.includes(updatedTime)) {
      updatedTime = defaultValue;
    }

    const repository: StatusesRepository = await this.getRepository();
    const statuses: StatusEntity[] = await repository.getAll(updatedTime);

    return statuses;
  }

  public async get(id: string): Promise<StatusEntity> {
    const repository: StatusesRepository = await this.getRepository();
    const status: StatusEntity | undefined = await repository.get(id);
    if (!status) {
      throw new NotFoundError(`Status ID "${id}" was not found`);
    }
    return status;
  }

  public async create(status: StatusData): Promise<InsertResult> {
    const repository: StatusesRepository = await this.getRepository();
    const insertedStatus: InsertResult = await repository.insert(status);
    return insertedStatus;
  }

  public async update(status: StatusData): Promise<UpdateResult> {
    const repository: StatusesRepository = await this.getRepository();
    const updatedStatus: UpdateResult = await repository.update(
      { taskId: status.taskId },
      status
    );
    return updatedStatus;
  }

  public async delete(taskId: string): Promise<DeleteResult> {
    const repository: StatusesRepository = await this.getRepository();
    const deletedStatus: DeleteResult = await repository.delete({ taskId });
    return deletedStatus;
  }

  private async getRepository(): Promise<StatusesRepository> {
    if (!this.repository) {
      if (!this.connectionManager.isConnected()) {
        await this.connectionManager.init();
      }
      this.repository = this.connectionManager.getStatusRepository();
    }
    return this.repository;
  }
}
