import express from 'express';
import verifyToken from '../middleware/verify-token.js';
import { isProvider } from '../middleware/roleCheck.js';
import {
    getProviderAvailability,
    updateAvailability,
    getDayAvailability
} from '../controllers/availability.js';

const router = express.Router();

// Get provider's full availability
router.get('/provider/:providerId', getProviderAvailability);

// Get specific day's availability
router.get('/provider/:providerId/day/:dayOfWeek', getDayAvailability);

// Update provider's availability (protected route)
router.put('/update', verifyToken, isProvider, updateAvailability);

export default router;
