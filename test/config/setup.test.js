import mongoose from 'mongoose';
import { config } from 'dotenv';
import { expect } from 'chai';

config();

describe('Database Connection', () => {
    before(async function() {
        this.timeout(15000);
        try {
            console.log('Attempting to connect to:', process.env.MONGODB_URI);
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000
            });
        } catch (error) {
            console.error('Detailed connection error:', error);
        }
    });

    after(async function() {
        this.timeout(15000);
        if (mongoose.connection.readyState === 1) {
            try {
                await mongoose.connection.close();
            } catch (error) {
                console.error('Error closing connection:', error);
            }
        }
    });

    it('should connect to MongoDB', async () => {
        expect(mongoose.connection.readyState).to.equal(1);
    });
});

afterEach(async () => {
    // Limpiar las colecciones después de cada prueba
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
}); 