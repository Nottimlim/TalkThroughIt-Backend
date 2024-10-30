import jwt from 'jsonwebtoken';
import Client from '../models/Client.js';
import Provider from '../models/Provider.js';

export const registerClient = async (req, res) => {
    try {
        const { email, password, firstName, lastName, location, insuranceProvider, therapyGoals } = req.body;

        const existingClient = await Client.findOne({ email });
        if (existingClient) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const client = new Client({
            email,
            password,
            firstName,
            lastName,
            location,
            insuranceProvider,
            therapyGoals
        });

        await client.save();

        const token = jwt.sign(
            { 
                _id: client._id.toString(),
                type: 'client' 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('New Client ID:', client._id);
        console.log('Generated Token Payload:', { _id: client._id.toString(), type: 'client' });

        res.status(201).json({
            token,
            user: {
                _id: client._id,
                email: client.email,
                firstName: client.firstName,
                lastName: client.lastName,
                type: 'client'
            }
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Error registering client', error: error.message });
    }
};

export const registerProvider = async (req, res) => {
    try {
        console.log('Provider registration request:', {
            ...req.body,
            password: '[HIDDEN]'
        });

        // Validate required fields
        const requiredFields = [
            'email',
            'password',
            'firstName',
            'lastName',
            'credentials',
            'bio',
            'location',
            'insuranceAccepted',
            'specialties',
            'yearsOfExperience',
            'languages',
            'licensureState',
            'licenseNumber',
            'sessionTypes'
        ];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ 
                    error: `${field} is required`,
                    receivedData: field === 'password' ? '[HIDDEN]' : req.body[field]
                });
            }
        }

        // Check if provider already exists
        const existingProvider = await Provider.findOne({ email: req.body.email });
        if (existingProvider) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create new provider
        const provider = new Provider(req.body);
        await provider.save();

        // Create JWT token
        const token = jwt.sign(
            { 
                _id: provider._id,
                type: 'provider'
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return success response
        res.status(201).json({
            message: 'Provider registered successfully',
            token,
            provider: {
                _id: provider._id,
                email: provider.email,
                firstName: provider.firstName,
                lastName: provider.lastName,
                type: 'provider'
            }
        });

    } catch (error) {
        console.error('Provider registration error:', error);
        res.status(500).json({ 
            error: 'Registration failed',
            details: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, userType } = req.body;
        
        const Model = userType === 'client' ? Client : Provider;
        
        const user = await Model.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { 
                _id: user._id.toString(),
                type: userType 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Login User ID:', user._id);
        console.log('Generated Token Payload:', { _id: user._id.toString(), type: userType });

        res.json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                type: userType
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};
