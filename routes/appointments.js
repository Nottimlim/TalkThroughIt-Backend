import express from 'express';
import verifyToken from '../middleware/verify-token.js';
import {
    createAppointment,
    getAppointment,
    getUpcomingAppointments,
    updateAppointment,
    cancelAppointment,
    getProviderAppointments
} from '../controllers/appointments.js';

const router = express.Router();

router.post('/', verifyToken, createAppointment);
router.get('/provider', verifyToken, getProviderAppointments);
router.get('/upcoming', verifyToken, getUpcomingAppointments);
router.get('/:id', verifyToken, getAppointment);
router.put('/:id', verifyToken, updateAppointment);
router.post('/:id/cancel', verifyToken, cancelAppointment);

export default router;
