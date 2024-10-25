const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verifyToken = require('../middleware/verify-token');

router.get('/:userId', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.params.userId){
            return res.status(401).json({ error: "Unauthorized"})
        }
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404)
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

module.exports = router;