import Appointment from '../models/Appointment.js';

export const createAppointment = async (req, res) => {
    try {
        const appointment = new Appointment({
            ...req.body,
            client: req.user.type === 'client' ? req.user._id : req.body.client,
            provider: req.user.type === 'provider' ? req.user._id : req.body.provider
        });

        await appointment.save();

        // If it's a video appointment, generate meeting link
        if (appointment.meetingType === 'video') {
            await appointment.generateMeetingLink();
        }

        res.status(201).json({ appointment });
    } catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            _id: req.params.id,
            $or: [
                { client: req.user._id },
                { provider: req.user._id }
            ]
        })
        .populate('client', 'firstName lastName email')
        .populate('provider', 'firstName lastName email');

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.json({ appointment });
    } catch (error) {
        console.error('Get appointment error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getUpcomingAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            [req.user.type === 'client' ? 'client' : 'provider']: req.user._id,
            datetime: { $gte: new Date() },
            status: { $ne: 'cancelled' }
        })
        .populate('client', 'firstName lastName email')
        .populate('provider', 'firstName lastName email')
        .sort({ datetime: 1 });

        res.json({ appointments });
    } catch (error) {
        console.error('Get upcoming appointments error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            _id: req.params.id,
            $or: [
                { client: req.user._id },
                { provider: req.user._id }
            ]
        });

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        // Check cancellation policy if status is being changed to cancelled
        if (req.body.status === 'cancelled' && !appointment.canCancel()) {
            return res.status(400).json({ 
                error: 'Cannot cancel appointment with less than 24 hours notice' 
            });
        }

        Object.assign(appointment, req.body);
        await appointment.save();

        res.json({ appointment });
    } catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            _id: req.params.id,
            $or: [
                { client: req.user._id },
                { provider: req.user._id }
            ]
        });

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        if (!appointment.canCancel()) {
            return res.status(400).json({ 
                error: 'Cannot cancel appointment with less than 24 hours notice' 
            });
        }

        appointment.status = 'cancelled';
        appointment.cancellationReason = req.body.reason;
        await appointment.save();

        res.json({ appointment });
    } catch (error) {
        console.error('Cancel appointment error:', error);
        res.status(500).json({ error: error.message });
    }
};
