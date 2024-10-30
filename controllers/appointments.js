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
            provider: req.user._id 
        });

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        if (req.body.status === 'cancelled' && !appointment.canCancel()) {
            return res.status(400).json({ 
                error: 'Cannot cancel appointment with less than 24 hours notice' 
            });
        }

        appointment.status = req.body.status;
        await appointment.save();

        res.json({ appointment });
    } catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const cancelAppointment = async (req, res) => {
    try {
        console.log('Cancel appointment request:', {
            appointmentId: req.params.id,
            userId: req.user._id,
            userType: req.user.type,
            reason: req.body.reason
        });

        const appointment = await Appointment.findOne({
            _id: req.params.id,
            $or: [
                { client: req.user._id },
                { provider: req.user._id }
            ]
        });

        console.log('Found appointment:', appointment);

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        if (!appointment.canCancel()) {
            return res.status(400).json({ 
                error: 'Cannot cancel appointment with less than 24 hours notice' 
            });
        }

        appointment.status = 'cancelled';
        appointment.cancellationReason = `Cancelled by ${req.user.type}: ${req.body.reason || 'No reason provided'}`;
        await appointment.save();

        console.log('Appointment cancelled successfully');

        res.json({ 
            appointment,
            message: `Appointment cancelled successfully`
        });
    } catch (error) {
        console.error('Cancel appointment error:', error);
        res.status(500).json({ error: error.message });
    }
};



export const getProviderAppointments = async (req, res) => {
    try {
        const { 
            status, 
            page = 1, 
            limit = 10, 
            timeframe = 'all',
            startDate,
            endDate 
        } = req.query;
        
        const skip = (page - 1) * parseInt(limit);

        // Build query
        let query = {
            provider: req.user._id
        };

        // Status filter
        if (status && status !== 'all') {
            query.status = status;
        } else {
            query.status = { $ne: 'cancelled' };
        }

        // Date filters
        const dateQuery = {};
        if (startDate) {
            dateQuery.$gte = new Date(startDate);
        }
        if (endDate) {
            dateQuery.$lte = new Date(endDate);
        }
        if (Object.keys(dateQuery).length > 0) {
            query.datetime = dateQuery;
        } else {
            // Timeframe filter (only if date range not specified)
            const now = new Date();
            if (timeframe === 'upcoming') {
                query.datetime = { $gte: now };
            } else if (timeframe === 'past') {
                query.datetime = { $lt: now };
            }
        }

        const appointments = await Appointment.find(query)
            .populate({
                path: 'client',
                select: 'firstName lastName email location insuranceProvider therapyGoals'
            })
            .sort({ datetime: timeframe === 'upcoming' ? 1 : -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Appointment.countDocuments(query);

        res.json({
            appointments,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get provider appointments error:', error);
        res.status(500).json({ error: error.message });
    }
};

