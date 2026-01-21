import { Router } from 'express';
import { StatsController } from './stats.controller';

const router = Router();
const controller = new StatsController();

router.get('/', controller.getDashboardStats);

export default router;
