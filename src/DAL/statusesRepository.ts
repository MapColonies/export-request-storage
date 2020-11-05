import { Repository, EntityRepository, LessThan, DeleteResult } from 'typeorm';
import { container } from 'tsyringe';
import { MCLogger } from '@map-colonies/mc-logger';
import config from 'config';
import { StatusEntity } from '../entity/statuses';
import { SearchOrder } from '../models/searchOptions';

@EntityRepository(StatusEntity)
export class StatusesRepository extends Repository<StatusEntity> {
  private readonly mcLogger: MCLogger; //don't override internal repository logger.
  private readonly defaultSearchPageSize: number;

  public constructor() {
    super();
    this.mcLogger = container.resolve(MCLogger); //direct injection don't work here due to being initialized by typeOrm
    this.defaultSearchPageSize = config.get<number>('search.defaultPageSize');
  }

  public async getAll(updatedTimeOrder: SearchOrder): Promise<StatusEntity[]> {
    return this.find({
      order: {
        updatedTime: updatedTimeOrder,
      },
    });
  }

  public async get(id: string): Promise<StatusEntity | undefined> {
    return this.findOne({ taskId: id });
  }

  public async statusesByUserId(
    userId: string,
    updatedTimeOrder: SearchOrder
  ): Promise<StatusEntity[]> {
    return this.find({
      where: {
        userId,
      },
      order: {
        updatedTime: updatedTimeOrder,
      },
    });
  }

  public async statusesBeforeExpiredDate(
    date: string
  ): Promise<StatusEntity[]> {
    return this.find({
      where: {
        expirationTime: LessThan(date),
      },
    });
  }

  public async deleteByTaskIds(taskIds: string[]): Promise<DeleteResult> {
    return this.createQueryBuilder()
      .delete()
      .from(StatusEntity)
      .where('taskId IN (:...ids)', { ids: taskIds })
      .execute();
  }

  public async taskIdExists(taskId: string) : Promise<boolean> {
    const statuses = await this.findOne({
      where: { taskId }
    });
    return Boolean(statuses);
  }


  public async filePathExists(fileName: string, directoryName: string) : Promise<boolean> {
    const statuses = await this.findOne({
      where: { fileName, directoryName }
    });
    return Boolean(statuses);
  }
}
