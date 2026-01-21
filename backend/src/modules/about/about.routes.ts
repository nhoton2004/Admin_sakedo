import { Router } from 'express';
import { AboutController } from './about.controller';

const router = Router();
const controller = new AboutController();

router.get('/', controller.get);
router.put('/', controller.update);

export default router;
