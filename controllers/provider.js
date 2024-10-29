import Provider from '../models/Provider.js';
import Appointment from '../models/Appointment.js';

export const getAllProviders = async (req, res) => {
    try {
      const providers = await Provider.find(); // Fetch all providers
      res.json(providers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

export const getProviderProfile = async (req, res) => {
    try {
        if (req.user._id.toString() !== req.params.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const provider = await Provider.findById(req.params.id);
        if (!provider) {
            res.status(404);
            throw new Error('Provider profile not found.');
        }
        res.json({ provider });
    } catch (error) {
        if (res.statusCode === 404) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

export const updateProviderProfile = async (req, res) => {
    try {
        if (req.user._id.toString() !== req.params.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const updatedProvider = await Provider.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                password: undefined,
                email: undefined
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedProvider) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        res.json({ provider: updatedProvider });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProviderClients = async (req, res) => {
    try {
        console.log('Fetching clients for provider:', req.user._id);

        // Find all appointments for this provider
        const appointments = await Appointment.find({ 
            provider: req.user._id 
        }).populate('client', 'firstName lastName email');

        // Get unique clients
        const clientsMap = new Map();
        appointments.forEach(apt => {
            if (apt.client) {
                clientsMap.set(apt.client._id.toString(), apt.client);
            }
        });

        const clients = Array.from(clientsMap.values());
        console.log('Found clients:', clients);

        res.json({ clients });
    } catch (error) {
        console.error('Error in getProviderClients:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getProviderAppointments = async (req, res) => {
    try {
        console.log('Fetching appointments for provider:', req.user._id);

        const appointments = await Appointment.find({
            provider: req.user._id,
            datetime: { $gte: new Date() } // Only future appointments
        })
        .populate('client', 'firstName lastName email')
        .sort({ datetime: 1 });

        console.log('Found appointments:', appointments);

        res.json({ appointments });
    } catch (error) {
        console.error('Error in getProviderAppointments:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getProviderAvailability = async (req, res) => {
    try {
        console.log('Fetching availability for provider:', req.user._id);

        const provider = await Provider.findById(req.user._id)
            .select('availability');

        console.log('Found availability:', provider?.availability);

        res.json({ 
            availability: provider?.availability || []
        });
    } catch (error) {
        console.error('Error in getProviderAvailability:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updateProviderAvailability = async (req, res) => {
    try {
        console.log('Updating availability for provider:', req.user._id);
        console.log('New availability data:', req.body);

        const provider = await Provider.findByIdAndUpdate(
            req.user._id,
            { $set: { availability: req.body.availability } },
            { new: true }
        ).select('availability');

        console.log('Updated availability:', provider.availability);

        res.json({ 
            availability: provider.availability 
        });
    } catch (error) {
        console.error('Error in updateProviderAvailability:', error);
        res.status(500).json({ error: error.message });
    }
};