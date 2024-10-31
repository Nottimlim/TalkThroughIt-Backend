import express from 'express';
import verifyToken from '../middleware/verify-token.js';
import { 
    getClientProfile, 
    updateClientProfile,
    getSavedProviders,
    getClientAppointments,
    saveProvider,
    updateSavedProvider
} from '../controllers/client.js';

const router = express.Router();

// Dashboard routes
router.get('/dashboard/saved-providers', verifyToken, getSavedProviders);
router.get('/dashboard/appointments', verifyToken, getClientAppointments);

// Profile routes - Using these instead of /:id routes for security
router.get('/profile', verifyToken, getClientProfile);
router.put('/profile', verifyToken, updateClientProfile);

// Provider interaction routes
router.post('/save-provider', verifyToken, saveProvider);
router.put('/save-provider', verifyToken, updateSavedProvider);


export default router;
