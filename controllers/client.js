import Client from '../models/Client.js';
import Appointment from '../models/Appointment.js';

export const getClientProfile = async (req, res) => {
    try {
        console.log('Getting profile for client:', req.user._id);

        const client = await Client.findById(req.user._id)
            .select('-password') // Exclude password from the response
            .populate('savedProviders', 'firstName lastName credentials location'); // Include basic provider info

        if (!client) {
            return res.status(404).json({ message: 'Client profile not found' });
        }

        res.json({
            profile: {
                _id: client._id,
                email: client.email,
                firstName: client.firstName,
                lastName: client.lastName,
                location: client.location,
                insuranceProvider: client.insuranceProvider,
                therapyGoals: client.therapyGoals,
                savedProviders: client.savedProviders,
                createdAt: client.createdAt,
                updatedAt: client.updatedAt
            }
        });

    } catch (error) {
        console.error('Error in getClientProfile:', error);
        res.status(500).json({ 
            message: 'Error retrieving client profile',
            error: error.message 
        });
    }
};

export const updateClientProfile = async (req, res) => {
    try {
        console.log('Updating profile for client:', req.user._id);
        
        // Fields that are allowed to be updated
        const allowedUpdates = [
            'firstName',
            'lastName',
            'location',
            'insuranceProvider',
            'therapyGoals'
        ];

        // Filter out any fields that aren't in allowedUpdates
        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        // Validation
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ 
                message: 'No valid fields to update' 
            });
        }

        // Find and update the client
        const client = await Client.findOneAndUpdate(
            { _id: req.user._id },
            { $set: updates },
            { 
                new: true, // Return the updated document
                runValidators: true, // Run model validators
                select: '-password' // Exclude password from the response
            }
        );

        if (!client) {
            return res.status(404).json({ 
                message: 'Client profile not found' 
            });
        }

        // Format the response
        res.json({
            message: 'Profile updated successfully',
            profile: {
                _id: client._id,
                email: client.email,
                firstName: client.firstName,
                lastName: client.lastName,
                location: client.location,
                insuranceProvider: client.insuranceProvider,
                therapyGoals: client.therapyGoals,
                updatedAt: client.updatedAt
            }
        });

    } catch (error) {
        console.error('Error in updateClientProfile:', error);
        
        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation Error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({ 
            message: 'Error updating client profile',
            error: error.message 
        });
    }
};

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
