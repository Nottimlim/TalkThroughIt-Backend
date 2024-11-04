import cors from 'cors';

const addCorsHeaders = (req, res, next) => {
    // Always allow talkthroughit.netlify.app
    res.header('Access-Control-Allow-Origin', 'https://talkthroughit.netlify.app');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
};

export default addCorsHeaders;
