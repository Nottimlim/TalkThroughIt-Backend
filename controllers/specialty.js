import Specialty from '../models/Specialty.js';
import Provider from '../models/Provider.js';

/**
 * Specialty Management Controller
 * Handles creating, assigning, and managing provider specialties
 */

// Get all specialties
export const getAllSpecialties = async (req, res) => {
    try {
        const specialties = await Specialty.find().sort({ name: 1 });
        res.json({
            count: specialties.length,
            specialties
        });
    } catch (error) {
        console.error('Get Specialties Error:', error);
        res.status(500).json({ message: 'Error retrieving specialties', error: error.message });
    }
};

// Get single specialty
export const getSpecialty = async (req, res) => {
    try {
        const specialty = await Specialty.findById(req.params.id);
        if (!specialty) {
            return res.status(404).json({ message: 'Specialty not found' });
        }
        res.json(specialty);
    } catch (error) {
        console.error('Get Specialty Error:', error);
        res.status(500).json({ message: 'Error retrieving specialty', error: error.message });
    }
};

// Add new specialty (admin only)
export const createSpecialty = async (req, res) => {
    try {
        const { name, description, category } = req.body;

        // Check if specialty already exists
        const existingSpecialty = await Specialty.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') } 
        });
        
        if (existingSpecialty) {
            return res.status(400).json({ message: 'Specialty already exists' });
        }

        const specialty = new Specialty({
            name,
            description,
            category
        });

        await specialty.save();
        res.status(201).json({
            message: 'Specialty created successfully',
            specialty
        });
    } catch (error) {
        console.error('Create Specialty Error:', error);
        res.status(500).json({ message: 'Error creating specialty', error: error.message });
    }
};

// Update provider specialties
export const updateProviderSpecialties = async (req, res) => {
    try {
        const providerId = req.user._id;
        const { specialties } = req.body;

        // Verify all specialties exist
        const specialtyIds = await Specialty.find({
            _id: { $in: specialties }
        }).select('_id');

        if (specialtyIds.length !== specialties.length) {
            return res.status(400).json({ message: 'One or more specialties not found' });
        }

        const provider = await Provider.findByIdAndUpdate(
            providerId,
            { specialties },
            { new: true }
        ).populate('specialties');

        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        res.json({
            message: 'Provider specialties updated',
            specialties: provider.specialties
        });
    } catch (error) {
        console.error('Update Provider Specialties Error:', error);
        res.status(500).json({ message: 'Error updating specialties', error: error.message });
    }
};

// Get providers by specialty
export const getProvidersBySpecialty = async (req, res) => {
    try {
        const { specialtyId } = req.params;
        const providers = await Provider.find({
            specialties: specialtyId,
            acceptingClients: true
        })
        .select('-password')
        .populate('specialties');

        res.json({
            count: providers.length,
            providers
        });
    } catch (error) {
        console.error('Get Providers by Specialty Error:', error);
        res.status(500).json({ message: 'Error retrieving providers', error: error.message });
    }
};
