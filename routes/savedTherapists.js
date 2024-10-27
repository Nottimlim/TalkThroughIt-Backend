import express from 'express';
import verifyToken from '../middleware/verify-token.js';
import { isClient } from '../middleware/roleCheck.js';
import { 
    saveProvider, 
    getSavedProviders, 
    updateSavedProvider,
    removeSavedProvider 
} from '../controllers/savedTherapists.js';

const router = express.Router();

/**
 * SavedTherapists Routes
 * Handles all routes related to saving and managing categorized saved therapist relationships
 */

// Save a provider with optional category
router.post('/', 
    verifyToken,
    isClient,
    saveProvider
);

// Get all saved providers (with optional category filter)
router.get('/', 
    verifyToken,
    isClient,
    getSavedProviders
);

// Update saved provider category/notes
router.put('/:savedId',
    verifyToken,
    isClient,
    updateSavedProvider
);

// Remove a saved provider
router.delete('/:savedId',
    verifyToken,
    isClient,
    removeSavedProvider
);

export default router;
