import express from 'express';
import { searchProviders, getSpecialtyCategories } from '../controllers/search.js';

const router = express.Router();

// Search providers with enhanced specialty filtering
router.get('/providers', searchProviders);

// Get all specialty categories
router.get('/specialty-categories', getSpecialtyCategories);

export default router;
