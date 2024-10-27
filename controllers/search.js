import Provider from '../models/Provider.js';
import Specialty from '../models/Specialty.js';

export const searchProviders = async (req, res) => {
    try {
        const {
            location,
            insurance,
            specialty,
            specialtyCategory,  // New parameter
            language,
            sessionType,
            page = 1,
            limit = 10
        } = req.query;

        // Build query
        const query = {};

        // Location search
        if (location) {
            query.location = { $regex: location.trim(), $options: 'i' };
        }

        // Insurance search
        if (insurance) {
            query.insuranceAccepted = { 
                $in: [new RegExp(insurance.trim(), 'i')] 
            };
        }

        // Specialty search
        if (specialty) {
            // Find specialty by name or ID
            const specialtyDoc = await Specialty.findOne({
                $or: [
                    { _id: specialty },
                    { name: { $regex: specialty, $options: 'i' }}
                ]
            });
            if (specialtyDoc) {
                query.specialties = specialtyDoc._id;
            }
        }

        // Specialty category search
        if (specialtyCategory) {
            const specialtiesInCategory = await Specialty.find({
                category: specialtyCategory
            });
            const specialtyIds = specialtiesInCategory.map(s => s._id);
            query.specialties = { $in: specialtyIds };
        }

        // Language search
        if (language) {
            query.languages = { 
                $in: [new RegExp(language.trim(), 'i')] 
            };
        }

        // Session type filter
        if (sessionType) {
            if (sessionType === 'telehealth') {
                query.telehealth = true;
            } else if (sessionType === 'inPerson') {
                query.inPerson = true;
            }
        }

        console.log('Search Query:', query);

        // Execute search with pagination
        const providers = await Provider.find(query)
            .populate('specialties') // Include specialty details
            .select('-password')
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ lastName: 1, firstName: 1 });

        // Get total count for pagination
        const total = await Provider.countDocuments(query);

        // Format providers with prominent specialty display
        const formattedProviders = providers.map(provider => ({
            id: provider._id,
            name: `${provider.firstName} ${provider.lastName}`,
            credentials: provider.credentials,
            bio: provider.bio,
            location: provider.location,
            specialties: provider.specialties.map(s => ({
                id: s._id,
                name: s.name,
                category: s.category
            })),
            specialtyCategories: [...new Set(provider.specialties.map(s => s.category))],
            insuranceAccepted: provider.insuranceAccepted,
            languages: provider.languages,
            sessionTypes: {
                telehealth: provider.telehealth,
                inPerson: provider.inPerson
            },
            yearsOfExperience: provider.yearsOfExperience
        }));

        res.json({
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            totalResults: total,
            providers: formattedProviders,
            filters: {
                applied: {
                    location,
                    insurance,
                    specialty,
                    specialtyCategory,
                    language,
                    sessionType
                }
            }
        });

    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).json({ 
            message: 'Error searching providers', 
            error: error.message 
        });
    }
};

// Get all specialty categories
export const getSpecialtyCategories = async (req, res) => {
    try {
        const categories = await Specialty.distinct('category');
        res.json(categories);
    } catch (error) {
        console.error('Get Categories Error:', error);
        res.status(500).json({ 
            message: 'Error retrieving specialty categories', 
            error: error.message 
        });
    }
};