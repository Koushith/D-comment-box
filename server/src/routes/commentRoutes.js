import express from 'express';
import * as commentController from '../controllers/commentController.js';

const router = express.Router();

router.get('/', commentController.getComments);
router.post('/', commentController.getComments);

export default router;
