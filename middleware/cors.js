import cors from 'cors';

const allowedOrigins = [
    'https://talkthroughit.netlify.app',    // Production frontend
    'http://localhost:5173',                // Vite dev server
    'http://localhost:3000'                 // Local backend
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

const corsMiddleware = cors(corsOptions);

const handleCors = (req, res, next) => {
    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.header('Access-Control-Max-Age', '86400'); // 24 hours
        return res.status(200).json({});
    }

    corsMiddleware(req, res, next);
};

export default handleCors
