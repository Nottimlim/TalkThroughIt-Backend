import Client from '../models/Client.js';

export const getClientProfile = async (req, res) => { /* ... */ };
export const updateClientProfile = async (req, res) => { /* ... */ };

export const getSavedProviders = async (req, res) => {
    try {
        console.log('Fetching saved providers for user:', req.user._id);
        
        const client = await Client.findById(req.user._id)
            .populate('savedProviders', 'firstName lastName location insuranceProvider');
        
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        
        console.log('Found saved providers:', client.savedProviders);
        res.json({ savedProviders: client.savedProviders });
    } catch (error) {
        console.error('Error fetching saved providers:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getClientAppointments = async (req, res) => {
    try {
        console.log('Fetching appointments for user:', req.user._id);
        
        const client = await Client.findById(req.user._id)
            .populate({
                path: 'appointments',
                populate: {
                    path: 'provider',
                    select: 'firstName lastName'
                }
            });
        
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        
        console.log('Found appointments:', client.appointments);
        res.json({ appointments: client.appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
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
