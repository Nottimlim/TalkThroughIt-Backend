import express from 'express';
import { registerClient, registerProvider, login, refreshToken } from '../controllers/auth.js';
import verifyToken from '../middleware/verify-token.js';

const router = express.Router();

router.post('/register/client', registerClient);
router.post('/register/provider', registerProvider);
router.post('/login', login);
router.post('/refresh-token', verifyToken, refreshToken);

export default router;
