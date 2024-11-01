import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import corsMiddleware from './middleware/cors.js';

// Import routes
import authRoutes from './routes/auth.js';
import testRoutes from './routes/test.js';
import clientRoutes from './routes/client.js';
import providerRoutes from './routes/provider.js';
import searchRoutes from './routes/search.js';
import savedTherapistsRoutes from './routes/savedTherapists.js';
import messageRoutes from './routes/messages.js';
import specialtyRoutes from './routes/specialty.js';
import availabilityRoutes from './routes/availability.js';
import appointmentRoutes from './routes/appointments.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(corsMiddleware);

// MongoDB Connection
mongoose
    .connect(process.env.MONGODB_URI)
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    })
    
// The Routes
app.use('/auth', authRoutes);
app.use('/test', testRoutes);
app.use('/clients', clientRoutes);
app.use('/providers', providerRoutes);
app.use('/search', searchRoutes);
app.use('/saved-therapists', savedTherapistsRoutes);
app.use('/messages', messageRoutes);
app.use('/specialties', specialtyRoutes);
app.use('/availability', availabilityRoutes);
app.use('/appointments', appointmentRoutes);

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

const PORT = process.env.PORT || 3000;

mongoose.connection.on("connected", () => {
    console.log('📊 Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
})

export default app;
