import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    try {
        // Log the entire headers object
        console.log('All Headers:', req.headers);
        
        // Log the authorization header specifically
        console.log('Auth Header:', req.headers.authorization);
        
        const token = req.headers.authorization?.split(' ')[1];
        console.log('Extracted Token:', token);
        
        if (!token) {
            return res.status(401).json({ message: 'Authentication token required' });
        }

        // Log JWT secret to make sure it exists (remove in production)
        console.log('JWT Secret exists:', !!process.env.JWT_SECRET);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token Verification Error:', error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default verifyToken;
