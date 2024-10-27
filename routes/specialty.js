import express from 'express';
import verifyToken from '../middleware/verify-token.js';
import { isProvider } from '../middleware/roleCheck.js';
import {
    getAllSpecialties,
    getSpecialty,
    createSpecialty,
    updateProviderSpecialties,
    getProvidersBySpecialty
} from '../controllers/specialty.js';

const router = express.Router();

// Public routes
router.get('/', getAllSpecialties);
router.get('/:id', getSpecialty);
router.get('/:specialtyId/providers', getProvidersBySpecialty);

// Protected routes
router.put('/provider/update', verifyToken, isProvider, updateProviderSpecialties);

// Admin routes (to be protected with admin middleware)
router.post('/', createSpecialty);

export default router;
