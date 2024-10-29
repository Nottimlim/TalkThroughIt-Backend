import express from 'express';
import verifyToken from '../middleware/verify-token.js';
import { 
    getClientProfile, 
    updateClientProfile,
    getSavedProviders,
    getClientAppointments,
    saveProvider
} from '../controllers/client.js';

const router = express.Router();

router.get('/dashboard/saved-providers', verifyToken, getSavedProviders);
router.get('/dashboard/appointments', verifyToken, getClientAppointments);
router.post('/save-provider', verifyToken, saveProvider);
router.get('/:id', verifyToken, getClientProfile);
router.put('/:id', verifyToken, updateClientProfile);

export default router;
