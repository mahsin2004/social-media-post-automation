import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { createPost, listPosts, updatePost, deletePost } from '../controllers/postsController.js';

const router = express.Router();

router.use(authenticate);
router.post('/', createPost);
router.get('/', listPosts);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;
