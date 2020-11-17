import { injectable } from 'tsyringe';
import { UpdateResult, InsertResult, DeleteResult } from 'typeorm';
import { ConnectionManager } from '../DAL/connectionManager';
import { StatusesRepository } from '../DAL/statusesRepository';
import { StatusEntity } from '../entity/statuses';
import { NotFoundError } from '../exceptions/notFoundError';
import { StatusData } from '../models/statusData';
import { SearchOrder } from '../models/searchOptions';
import { ConflictError } from '../exceptions/conflictError';

@injectable()
export class StatusService {
  private repository?: StatusesRepository;
  public constructor(private readonly connectionManager: ConnectionManager) {}

  public async getAll(updatedTimeOrder: SearchOrder): Promise<StatusEntity[]> {
    const defaultValue: SearchOrder = 'DESC';
    const options: SearchOrder[] = ['ASC', 'DESC'];
    if (!options.includes(updatedTimeOrder)) {
      updatedTimeOrder = defaultValue;
    }

    const repository: StatusesRepository = await this.getRepository();
    const statuses: StatusEntity[] = await repository.getAll(updatedTimeOrder);

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
    const taskIdExists = await repository.taskIdExists(status.taskId);

    const fileName = status.fileName!;
    const directoryName = status.directoryName!;

    if (!taskIdExists) {
      const filePathExists = await repository.filePathExists(
        fileName,
        directoryName
      );
      if (!filePathExists) {
        const insertedStatus: InsertResult = await repository.insert(status);
        return insertedStatus;
      } else {
        throw new ConflictError(
          `Could not create status. Path "${fileName}/${directoryName}" already exists.`
        );
      }
    } else {
      throw new ConflictError(
        `Could not create status. TaskID "${status.taskId}" already exists.`
      );
    }
  }

  public async update(status: StatusData): Promise<UpdateResult> {
    const repository: StatusesRepository = await this.getRepository();
    const updatedStatus: UpdateResult = await repository.update(
      { taskId: status.taskId },
      status
    );
    return updatedStatus;
  }

  public async delete(taskIds: string[]): Promise<DeleteResult> {
    const repository: StatusesRepository = await this.getRepository();
    const deletedStatuses = await repository.deleteByTaskIds(taskIds);
    return deletedStatuses;
  }

  public async statusesByUserId(
    userId: string,
    updatedTimeOrder: SearchOrder
  ): Promise<StatusEntity[]> {
    const repository: StatusesRepository = await this.getRepository();
    const statusesByUserId: StatusEntity[] = await repository.statusesByUserId(
      userId,
      updatedTimeOrder
    );
    return statusesByUserId;
  }

  public async statusesBeforeExpiredDate(
    date: string
  ): Promise<StatusEntity[]> {
    const repository: StatusesRepository = await this.getRepository();
    const statusesByUserId: StatusEntity[] = await repository.statusesBeforeExpiredDate(
      date
    );
    return statusesByUserId;
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
