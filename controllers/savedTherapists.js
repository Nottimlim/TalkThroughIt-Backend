import SavedProvider from "../models/SavedProvider.js";
import Provider from "../models/Provider.js";

/**
 * SavedTherapists Controller
 * Handles saving, retrieving, and managing categorized saved therapist relationships
 */

/**
 * Save a provider to client's saved list with category
 * @route POST /api/saved-therapists
 * @access Private - Client only
 */
export const saveProvider = async (req, res) => {
  try {
    const clientId = req.user._id;
    const { providerId, category, notes } = req.body;

    // Check if provider exists
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Check if already saved
    const existingSave = await SavedProvider.findOne({ clientId, providerId });
    if (existingSave) {
      return res.status(400).json({ message: "Provider already saved" });
    }

    // Create new saved relationship with category
    const savedProvider = new SavedProvider({
      clientId,
      providerId,
      category,
      notes,
    });

    await savedProvider.save();

    res.status(201).json({
      message: "Provider saved successfully",
      savedProvider,
    });
  } catch (error) {
    console.error("Save Provider Error:", error);
    res
      .status(500)
      .json({ message: "Error saving provider", error: error.message });
  }
};

/**
 * Get all saved providers for a client, optionally filtered by category
 * @route GET /api/saved-therapists
 * @query {string} category - Optional category filter
 * @access Private - Client only
 */
export const getSavedProviders = async (req, res) => {
  try {
      const clientId = req.user._id;
      console.log("Getting saved providers for client:", clientId);

      // Find all saved relationships and populate provider details
      const savedProviders = await SavedProvider.find({ clientId })
          .populate({
              path: 'providerId',
              select: 'firstName lastName credentials location specialties languages insuranceAccepted sessionTypes bio acceptingClients',
              model: 'Provider'
          })
          .lean(); // Add this to convert to plain JavaScript object

      console.log("Full provider data:", JSON.stringify(savedProviders, null, 2));

      res.json(savedProviders);
  } catch (error) {
      console.error("Get Saved Providers Error:", error);
      res.status(500).json({ 
          message: "Error retrieving saved providers", 
          error: error.message 
      });
  }
};


/**
 * Update saved provider category or notes
 * @route PUT /api/saved-therapists/:savedId
 * @access Private - Client only
 */
export const updateSavedProvider = async (req, res) => {
  try {
    const clientId = req.user._id;
    // Trim the savedId to remove any whitespace or newlines
    const savedId = req.params.savedId.trim();
    const { category, notes } = req.body;

    console.log("Update Request Details:", {
      savedId,
      clientId,
      category,
      notes,
      userType: req.user.type,
    });

    // Try to find the document and log what we find
    const savedProvider = await SavedProvider.findById(savedId);
    console.log("Found saved provider:", savedProvider);

    if (!savedProvider) {
      return res.status(404).json({
        message: "Saved provider not found",
        providedId: savedId,
      });
    }

    // Verify ownership
    if (savedProvider.clientId.toString() !== clientId.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Update the fields
    if (category) savedProvider.category = category;
    if (notes !== undefined) savedProvider.notes = notes;

    const updatedProvider = await savedProvider.save();
    console.log("Successfully updated provider:", updatedProvider);

    res.json({
      message: "Saved provider updated",
      savedProvider: updatedProvider,
    });
  } catch (error) {
    console.error("Update Error Details:", {
      error: error.message,
      stack: error.stack,
      savedId: req.params.savedId,
    });
    res.status(500).json({
      message: "Error updating saved provider",
      error: error.message,
    });
  }
};

/**
 * Remove a provider from client's saved list
 * @route DELETE /api/saved-therapists/:savedId
 * @access Private - Client only
 */
export const removeSavedProvider = async (req, res) => {
  try {
    const clientId = req.user._id;
    const { savedId } = req.params;

    const savedProvider = await SavedProvider.findOne({
      _id: savedId,
      clientId,
    });

    if (!savedProvider) {
      return res.status(404).json({ message: "Saved provider not found" });
    }

    await SavedProvider.findByIdAndDelete(savedId);

    res.json({ message: "Provider removed from saved list" });
  } catch (error) {
    console.error("Remove Saved Provider Error:", error);
    res
      .status(500)
      .json({ message: "Error removing saved provider", error: error.message });
  }
};
