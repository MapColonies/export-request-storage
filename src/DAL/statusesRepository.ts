import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';
import { container } from 'tsyringe';
import { MCLogger } from '@map-colonies/mc-logger';
import config from 'config';
import { StatusEntity } from '../entity/statusEntity';

@EntityRepository(StatusEntity)
export class StatusesRepository extends Repository<StatusEntity> {
  private readonly mcLogger: MCLogger; //don't override internal repository logger.
  private readonly defaultSearchPageSize: number;

  public constructor() {
    super();
    this.mcLogger = container.resolve(MCLogger); //direct injection don't work here due to being initialized by typeOrm
    this.defaultSearchPageSize = config.get<number>('search.defaultPageSize');
  }

  public async getAll(): Promise<StatusEntity[]> {
    return this.find({
      order: {
        updatedTime: "ASC"
      }
    });
  }

  public async get(id: string): Promise<StatusEntity | undefined> {
    return this.findOne({ taskId: id });
  }

  public async exists(taskId: string): Promise<boolean> {
    return (await this.get(taskId) !== undefined);
  }
}
