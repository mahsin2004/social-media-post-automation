import { Router } from 'express';
import { generateImage } from '../controllers/imageController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);
router.post('/generator', authenticate, generateImage);

export default router;

