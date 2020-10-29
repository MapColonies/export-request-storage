import { Router } from 'express';
import { container } from 'tsyringe';
import { validate } from 'openapi-validator-middleware';
import { StatusController } from '../controllers/statusesController';

const statusRouter = Router();
const controller = container.resolve(StatusController);

statusRouter.get('/', validate, controller.getAll.bind(controller));
statusRouter.post('/', validate, controller.create.bind(controller));
statusRouter.put('/', validate, controller.update.bind(controller));
statusRouter.get('/:taskId', validate, controller.get.bind(controller));
statusRouter.delete('/:taskId', validate, controller.delete.bind(controller));
// statusRouter.get('/exists/:id', validate, controller.exists.bind(controller));
// statusRouter.post('/search', validate, controller.search.bind(controller));

export { statusRouter as StatusRouter };
