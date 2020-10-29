import { Router } from 'express';
import { StatusRouter } from './statuses';
import { swaggerRouter } from './swagger';

const globalRouter = Router();
globalRouter.use(swaggerRouter);
globalRouter.use('/statuses', StatusRouter);

export { globalRouter };
