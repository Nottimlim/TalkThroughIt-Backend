import Provider from '../models/Provider.js';
import Specialty from '../models/Specialty.js';

export const searchProviders = async (req, res) => {
    try {
        console.log('Received search request');
        console.log('Query params:', req.query);
        
        const {
            specialty,
            insurance,
            languages,
            sessionType,
            location,
            search
        } = req.query;

        let query = {};

        if (specialty) {
            query.specialties = specialty;
            console.log('Added specialty filter:', specialty);
        }
        
        if (insurance) {
            query.insuranceAccepted = insurance;
            console.log('Added insurance filter:', insurance);
        }

        if (languages) {
            query.languages = languages;
            console.log('Added language filter:', languages);
        }

        if (sessionType) {
            query.sessionTypes = sessionType;
            console.log('Added sessionType filter:', sessionType);
        }

        if (location) {
            query.location = new RegExp(location, 'i');
            console.log('Added location filter:', location);
        }

        if (search) {
            query.$or = [
                { firstName: new RegExp(search, 'i') },
                { lastName: new RegExp(search, 'i') },
                { location: new RegExp(search, 'i') }
            ];
            console.log('Added search filter:', search);
        }

        console.log('Final query:', query);

        const providers = await Provider.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        console.log(`Found ${providers.length} providers`);
        console.log('Sending response');

        res.json(providers);
    } catch (error) {
        console.error('Provider search error:', error);
        res.status(500).json({ error: error.message });
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