import express from 'express';
import verifyToken from '../middleware/verify-token.js';
import { 
    getProviderProfile, 
    updateProviderProfile, 
    searchProviders,
    getProviderClients,
    getProviderAppointments,
    getProviderAvailability,
    updateProviderAvailability 
} from '../controllers/provider.js';

const router = express.Router();

router.get('/dashboard/clients', verifyToken, getProviderClients);
router.get('/dashboard/appointments', verifyToken, getProviderAppointments);
router.get('/dashboard/availability', verifyToken, getProviderAvailability);
router.post('/dashboard/availability', verifyToken, updateProviderAvailability);
router.get('/:id', verifyToken, getProviderProfile);
router.put('/:id', verifyToken, updateProviderProfile);
router.get('/', searchProviders);


export default router;
