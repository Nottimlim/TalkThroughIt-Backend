import express from 'express';
import verifyToken from '../middleware/verify-token.js';
import { getProviderProfile, updateProviderProfile, getAllProviders } from '../controllers/provider.js';

const router = express.Router();

router.get('/:id', verifyToken, getProviderProfile);
router.put('/:id', verifyToken, updateProviderProfile);
router.get('/', getAllProviders);

export default router;
