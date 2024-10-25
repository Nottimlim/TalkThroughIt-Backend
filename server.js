import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';

// Import routes 
import userRoutes from './controllers/users.js';
import profileRoutes from './controllers/profiles.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// MongoDB Connection
try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/talkthrough', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
} catch (err) {
    console.error('MongoDB connection error:', err);
}

// Routes
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);

// Basic health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
