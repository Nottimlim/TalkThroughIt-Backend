import Client from '../models/Client.js';
import Appointment from '../models/Appointment.js';

export const getClientProfile = async (req, res) => { /* ... */ };
export const updateClientProfile = async (req, res) => { /* ... */ };

export const getSavedProviders = async (req, res) => {
    try {
        console.log('Getting saved providers for user:', req.user._id);
        
        const client = await Client.findById(req.user._id)
            .populate('savedProviders');
        
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.json({ savedProviders: client.savedProviders || [] });
    } catch (error) {
        console.error('Error in getSavedProviders:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getClientAppointments = async (req, res) => {
    try {
        console.log('Fetching appointments for client:', req.user._id);

        // Find appointments directly from Appointment model
        const appointments = await Appointment.find({
            client: req.user._id
        })
        .populate('provider', 'firstName lastName email')
        .sort({ datetime: 1 }); // Sort by date ascending

        console.log('Found appointments:', appointments);
        res.json({ appointments });
    } catch (error) {
        console.error('Error in getClientAppointments:', error);
        res.status(500).json({ error: error.message });
    }
};

// Add a function to save a provider
export const saveProvider = async (req, res) => {
    try {
        const { providerId } = req.body;
        
        const client = await Client.findById(req.user._id);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Check if provider is already saved
        if (client.savedProviders.includes(providerId)) {
            return res.status(400).json({ error: 'Provider already saved' });
        }

        client.savedProviders.push(providerId);
        await client.save();

        res.json({ message: 'Provider saved successfully', client });
    } catch (error) {
        console.error('Error saving provider:', error);
        res.status(500).json({ error: error.message });
    }
};
