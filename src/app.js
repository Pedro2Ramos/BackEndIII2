import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

import adoptionRouter from './routes/adoption.router.js';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';
import loggerRouter from './routes/logger.router.js';

import { addLogger } from './utils/logger.js';
import { errorHandler } from './middlewares/error.handler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(addLogger);
app.use(express.static('public'));

// Swagger config
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de API de Adopciones',
            description: 'Documentación para API de sistema de adopciones',
            version: '1.0.0'
        }
    },
    apis: [`${process.cwd()}/src/docs/*.yaml`]
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Routes
app.use('/api/adoptions', adoptionRouter);
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);
app.use('/api', loggerRouter);

// Error handling
app.use(errorHandler);

// Database connection
try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
} catch (error) {
    console.error('Error connecting to MongoDB:', error);
}

// Server start
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
