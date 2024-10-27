import Provider from '../models/Provider.js';
import Specialty from '../models/Specialty.js';

export const searchProviders = async (req, res) => {
    console.log('Search endpoint hit');
    console.log('Query params:', req.query);
    
    try {
        const {
            location,
            insurance,
            specialty,
            acceptingClients,
            name,
            credentials,
            language,
            sessionType,
            page = 1,
            limit = 10
        } = req.query;

        // Build query
        let query = {};

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

        // Language search
        if (language) {
            query.languages = { 
                $in: [new RegExp(language.trim(), 'i')] 
            };
        }

        // Name search (searches both first and last name)
        if (name) {
            const nameRegex = new RegExp(name.trim(), 'i');
            query.$or = [
                { firstName: nameRegex },
                { lastName: nameRegex }
            ];
        }

        // Session type filter
        if (sessionType) {
            if (sessionType === 'telehealth') {
                query.telehealth = true;
            } else if (sessionType === 'inPerson') {
                query.inPerson = true;
            }
        }

        console.log('Final MongoDB Query:', JSON.stringify(query, null, 2));

        // First get all providers to debug
        const allProviders = await Provider.find({});
        console.log('All Providers in DB:', allProviders.map(p => ({
            name: `${p.firstName} ${p.lastName}`,
            location: p.location,
            insurance: p.insuranceAccepted,
            languages: p.languages
        })));

        // Execute search with pagination
        const providers = await Provider.find(query)
            .select([
                'firstName',
                'lastName',
                'credentials',
                'bio',
                'location',
                'insuranceAccepted',
                'acceptingClients',
                'specialties',
                'yearsOfExperience',
                'languages',
                'therapyApproaches',
                'telehealth',
                'inPerson',
                'licensureState'
            ])
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ lastName: 1, firstName: 1 });

        console.log('Matching Providers:', providers.map(p => ({
            name: `${p.firstName} ${p.lastName}`,
            location: p.location,
            insurance: p.insuranceAccepted,
            languages: p.languages
        })));

        const total = providers.length;

        // Format response data
        const formattedProviders = providers.map(provider => ({
            id: provider._id,
            name: `${provider.firstName} ${provider.lastName}`,
            credentials: provider.credentials,
            bio: provider.bio,
            location: provider.location,
            insuranceAccepted: provider.insuranceAccepted,
            acceptingClients: provider.acceptingClients,
            yearsOfExperience: provider.yearsOfExperience,
            languages: provider.languages,
            therapyApproaches: provider.therapyApproaches,
            sessionTypes: {
                telehealth: provider.telehealth,
                inPerson: provider.inPerson
            },
            licensureState: provider.licensureState
        }));

        res.json({
            providers: formattedProviders,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            totalResults: total,
            filters: {
                applied: {
                    location: location?.trim(),
                    insurance: insurance?.trim(),
                    specialty,
                    acceptingClients,
                    name: name?.trim(),
                    credentials: credentials?.trim(),
                    language: language?.trim(),
                    sessionType
                }
            }
        });

    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).json({ 
            message: 'Error searching providers', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
