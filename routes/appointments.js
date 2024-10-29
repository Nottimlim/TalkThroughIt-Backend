import express from 'express';
import verifyToken from '../middleware/verify-token.js';
import { 
    createAppointment,
    getAppointments,
    updateAppointment,
    cancelAppointment 
} from '../controllers/appointments.js';

const router = express.Router();

router.post('/', verifyToken, createAppointment);
router.get('/', verifyToken, getAppointments);
router.put('/:id', verifyToken, updateAppointment);
router.delete('/:id', verifyToken, cancelAppointment);

export default router;
