import express from 'express';
import verifyToken from '../middleware/verify-token.js';
import { getClientProfile, updateClientProfile } from '../controllers/client.js';

const router = express.Router();

router.get('/:id', verifyToken, getClientProfile);
router.put('/:id', verifyToken, updateClientProfile);

export default router;
