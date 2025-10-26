import { Router } from 'express';
import { generateContent } from '../controllers/contentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);
router.post('/generator', authenticate, generateContent);

export default router;
