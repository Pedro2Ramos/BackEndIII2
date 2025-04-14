import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import adoptionRouter from './routes/adoption.router.js';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';

import { addLogger } from './utils/logger.js';
import { errorHandler } from './middlewares/error.handler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Solo conectar a la base de datos si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err));
}

app.use(express.json());
app.use(cookieParser());

app.use(addLogger);

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);

app.use('*', (req, res, next) => {
    const error = new Error(`Ruta ${req.originalUrl} no encontrada`);
    error.code = 'NOT_FOUND';
    next(error);
});

app.use(errorHandler);

// Solo iniciar el servidor si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
