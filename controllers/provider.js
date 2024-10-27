import Provider from '../models/Provider.js';

export const getProviderProfile = async (req, res) => {
    try {
        if (req.user._id.toString() !== req.params.id) {
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
};

export const updateProviderProfile = async (req, res) => {
    try {
        if (req.user._id.toString() !== req.params.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const updatedProvider = await Provider.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                password: undefined,
                email: undefined
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedProvider) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        res.json({ provider: updatedProvider });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
