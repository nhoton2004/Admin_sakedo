import { Router } from 'express';
import { HomeController } from './home.controller';

const router = Router();
const controller = new HomeController();

router.get('/video', controller.getVideo);
router.put('/video', controller.updateVideo);

export default router;
