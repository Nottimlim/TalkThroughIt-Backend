/**
 * Middleware to verify user roles
 * Used to restrict certain routes to specific user types
 */

// Verify user is a client
export const isClient = (req, res, next) => {
    if (req.user.type !== 'client') {
        return res.status(403).json({ 
            message: 'Access denied. Clients only.' 
        });
    }
    next();
};

// Verify user is a provider
export const isProvider = (req, res, next) => {
    if (req.user.type !== 'provider') {
        return res.status(403).json({ 
            message: 'Access denied. Providers only.' 
        });
    }
    next();
};
