import 'dotenv/config';
import mongoose from 'mongoose';
import Specialty from '../models/Specialty.js';
import specialtiesData from '../data/specialties.json' assert { type: "json" };

const seedSpecialties = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📊 Connected to MongoDB');

        // Clear existing specialties
        await Specialty.deleteMany({});
        console.log('🗑️  Cleared existing specialties');

        // Insert new specialties
        const specialties = await Specialty.insertMany(specialtiesData.specialties);
        console.log(`🌱 Seeded ${specialties.length} specialties`);

        console.log('✅ Specialty seeding completed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedSpecialties();
