import cors from 'cors';

const allowedOrigins = [
    'https://talkthroughit.netlify.app',
    'https://talkthroughit-backend-c427d84ad4cc.herokuapp.com',
    'http://localhost:5173',
    'http://localhost:3000'
];

// Simple middleware to add required CORS headers
const addCorsHeaders = (req, res, next) => {
    const origin = req.headers.origin;
    
    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.setHeader('Access-Control-Max-Age', '3600');
    }

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
};

export default addCorsHeaders;
