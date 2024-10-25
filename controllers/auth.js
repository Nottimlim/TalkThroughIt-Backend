import jwt from 'jsonwebtoken';
import Client from '../models/Client.js';
import Provider from '../models/Provider.js';

export const registerClient = async (req, res) => {
    try {
        const { email, password, firstName, lastName, location, insuranceProvider, therapyGoals } = req.body;

        // Check if client already exists
        const existingClient = await Client.findOne({ email });
        if (existingClient) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create new client
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

        // Generate JWT token
        const token = jwt.sign(
            { id: client._id, type: 'client' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: client._id,
                email: client.email,
                firstName: client.firstName,
                lastName: client.lastName,
                type: 'client'
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error registering client', error: error.message });
    }
};

export const registerProvider = async (req, res) => {
    try {
        const { 
            email, 
            password, 
            firstName, 
            lastName, 
            credentials, 
            bio, 
            location, 
            insuranceAccepted 
        } = req.body;

        // Check if provider already exists
        const existingProvider = await Provider.findOne({ email });
        if (existingProvider) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create new provider
        const provider = new Provider({
            email,
            password,
            firstName,
            lastName,
            credentials,
            bio,
            location,
            insuranceAccepted
        });

        await provider.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: provider._id, type: 'provider' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: provider._id,
                email: provider.email,
                firstName: provider.firstName,
                lastName: provider.lastName,
                type: 'provider'
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error registering provider', error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, userType } = req.body;

        // Determine model based on userType
        const Model = userType === 'client' ? Client : Provider;

        // Find user
        const user = await Model.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, type: userType },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                type: userType
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};
