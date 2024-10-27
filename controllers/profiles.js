import express from 'express';
import verifyToken from '../middleware/verify-token.js';
import Client from '../models/Client.js';
import Provider from '../models/Provider.js';
import User from '../models/user.js';

const router = express.Router();

// Original user profile route
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.params.userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404);
            throw new Error('Profile not found.');
        }
        res.json({ user });
    } catch (error) {
        if (res.statusCode === 404) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Client profile routes
router.get('/clients/:id', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.params.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const client = await Client.findById(req.params.id);
        if (!client) {
            res.status(404);
            throw new Error('Client profile not found.');
        }
        res.json({ client });
    } catch (error) {
        if (res.statusCode === 404) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

router.put('/clients/:id', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.params.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const client = await Client.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!client) {
            res.status(404);
            throw new Error('Client profile not found.');
        }
        res.json({ client });
    } catch (error) {
        if (res.statusCode === 404) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Provider profile routes
router.get('/providers/:id', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.params.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const provider = await Provider.findById(req.params.id);
        if (!provider) {
            res.status(404);
            throw new Error('Provider profile not found.');
        }
        res.json({ provider });
    } catch (error) {
        if (res.statusCode === 404) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

router.put('/providers/:id', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.params.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const provider = await Provider.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!provider) {
            res.status(404);
            throw new Error('Provider profile not found.');
        }
        res.json({ provider });
    } catch (error) {
        if (res.statusCode === 404) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

export default router;
