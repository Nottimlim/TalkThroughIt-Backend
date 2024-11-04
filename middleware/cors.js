const allowedOrigins = [
    'https://talkthroughit.netlify.app',
    'https://talkthroughit-backend-c427d84ad4cc.herokuapp.com',
    'http://localhost:5173',
    'http://localhost:3000'
];

const addCorsHeaders = (req, res, next) => {
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        // Set CORS headers
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Max-Age', '3600');
    }

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }

    next();
};

export default addCorsHeaders;
