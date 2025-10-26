import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import * as socialController from '../controllers/socialController.js';

const router = express.Router();

router.get('/facebook/pages', socialController.getFacebookPages);
router.post('/facebook/select-page', socialController.selectFacebookPage);

router.get('/connected-platforms', authenticate, socialController.getConnectedPlatforms);

router.get('/:platform', authenticate, socialController.connectPlatform);
router.get('/callback/:platform', socialController.callbackPlatform);


router.use(authenticate);

export default router;
