import express from 'express';
import verifyToken from '../middleware/verify-token.js';
import { isProvider } from '../middleware/roleCheck.js';
import {
    getProviderAvailability,
    updateAvailability,
    getDayAvailability,
    getPublicAvailability,
} from '../controllers/availability.js';

const router = express.Router();

// Public routes (no auth needed)
router.get('/provider/:providerId', getProviderAvailability);  // Get all availability
router.get('/provider/:providerId/day/:dayOfWeek', getDayAvailability);  // Get specific day
router.get('/provider/:providerId/public', getPublicAvailability);  // Get formatted public view

// Protected routes (provider only)
router.put('/update', verifyToken, isProvider, updateAvailability);  // Update availability
export default router;
