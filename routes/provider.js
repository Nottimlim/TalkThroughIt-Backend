import express from 'express';
import verifyToken from '../middleware/verify-token.js';
import { getProviderProfile, updateProviderProfile } from '../controllers/provider.js';

const router = express.Router();

router.get('/:id', verifyToken, getProviderProfile);
router.put('/:id', verifyToken, updateProviderProfile);

export default router;
