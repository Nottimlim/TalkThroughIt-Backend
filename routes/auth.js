import express from 'express';
import { registerClient, registerProvider, login } from '../controllers/auth.js';

const router = express.Router();

router.post('/register/client', registerClient);
router.post('/register/provider', registerProvider);
router.post('/login', login);

export default router;
