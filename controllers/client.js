import Client from '../models/Client.js';

export const getClientProfile = async (req, res) => {
    try {
        console.log('User from token:', req.user);
        console.log('Requested ID:', req.params.id);
        
        if (req.user._id.toString() !== req.params.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const client = await Client.findById(req.params.id);
        console.log('Found client:', client);

        if (!client) {
            res.status(404);
            throw new Error('Client profile not found.');
        }
        res.json({ client });
    } catch (error) {
        console.error('Profile fetch error:', error);
        if (res.statusCode === 404) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

export const updateClientProfile = async (req, res) => {
    try {
        if (req.user._id.toString() !== req.params.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const updatedClient = await Client.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                password: undefined,
                email: undefined
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json({ client: updatedClient });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
