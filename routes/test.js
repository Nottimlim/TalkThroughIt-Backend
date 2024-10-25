import express from 'express';
import verifyToken from '../middleware/verify-token.js';

const router = express.Router();

// Public test route
router.get('/public', (req, res) => {
    res.json({ message: 'This is a public endpoint' });
});

// Protected test route
router.get('/protected', verifyToken, (req, res) => {
    res.json({ 
        message: 'This is a protected endpoint',
        user: req.user 
    });
});

export default router;
