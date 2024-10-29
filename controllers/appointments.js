import Appointment from '../models/Appointment.js';

export const createAppointment = async (req, res) => {
    try {
        const appointment = new Appointment({
            ...req.body,
            client: req.user._id
        });
        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            [req.user.type === 'client' ? 'client' : 'provider']: req.user._id
        })
        .populate('provider', 'firstName lastName email')
        .populate('client', 'firstName lastName email')
        .sort({ datetime: 1 });

        res.json({ appointments });
    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndUpdate(
            {
                _id: req.params.id,
                [req.user.type === 'client' ? 'client' : 'provider']: req.user._id
            },
            req.body,
            { new: true }
        );
        
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        
        res.json(appointment);
    } catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndUpdate(
            {
                _id: req.params.id,
                [req.user.type === 'client' ? 'client' : 'provider']: req.user._id
            },
            { status: 'cancelled' },
            { new: true }
        );
        
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        
        res.json(appointment);
    } catch (error) {
        console.error('Cancel appointment error:', error);
        res.status(500).json({ error: error.message });
    }
};
