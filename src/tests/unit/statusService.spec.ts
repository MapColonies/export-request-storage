//this import must be called before the first import of tsyring
import 'reflect-metadata';
import { ConflictError } from '../../exceptions/conflictError';
import { ConnectionManager } from '../../DAL/connectionManager';
import { StatusService } from '../../services/statusesService';

describe('Image service test', () => {
  it('create should throw if ONLY taskid already exists', async () => {
    const statusService = new StatusService(({
      isConnected: () => true,
      getStatusRepository: () => {
        return {
          taskIdExists: () => true,
          filePathExists: () => false,
          insert: jest.fn(),
        };
      },
    } as unknown) as ConnectionManager);
    await expect(async () => {
      await statusService.create({
        taskId: 'fec0c3f9-7d7d-4795-86b8-b590cfc1d000',
      });
    }).rejects.toThrow(ConflictError);
  });

  it('create should throw if ONLY file path already exists', async () => {
    const statusService = new StatusService(({
      isConnected: () => true,
      getStatusRepository: () => {
        return {
          taskIdExists: () => false,
          filePathExists: () => true,
          insert: jest.fn(),
        };
      },
    } as unknown) as ConnectionManager);

    await expect(async () => {
      await statusService.create({
        taskId: 'fec0c3f9-7d7d-4795-86b8-b590cfc1d000',
      });
    }).rejects.toThrow(ConflictError);
  });

  it('create should throw if both file path and taskid already exists', async () => {
    const statusService = new StatusService(({
      isConnected: () => true,
      getStatusRepository: () => {
        return {
          taskIdExists: () => true,
          filePathExists: () => true,
          insert: jest.fn(),
        };
      },
    } as unknown) as ConnectionManager);

    await expect(async () => {
      await statusService.create({
        taskId: 'fec0c3f9-7d7d-4795-86b8-b590cfc1d000',
      });
    }).rejects.toThrow(ConflictError);
  });

  it('create should work', async () => {
    const statusService = new StatusService(({
      isConnected: () => true,
      getStatusRepository: () => {
        return {
          taskIdExists: () => false,
          filePathExists: () => false,
          insert: jest.fn(),
        };
      },
    } as unknown) as ConnectionManager);

    await expect(
      statusService.create({ taskId: 'fec0c3f9-7d7d-4795-86b8-b590cfc1d000' })
    ).resolves.not.toThrow();
  });
});
