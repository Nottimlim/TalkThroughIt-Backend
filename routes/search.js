import express from 'express';
import { searchProviders } from '../controllers/search.js';

const router = express.Router();

console.log('Search routes registered');  // Debug log

// Public route - anyone can search for providers
router.get('/providers', (req, res, next) => {
    console.log('Provider search route hit');
    searchProviders(req, res, next);
});

export default router;
