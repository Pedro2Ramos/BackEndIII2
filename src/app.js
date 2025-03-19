import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';

import { addLogger } from './utils/logger.js';
import { errorHandler } from './middlewares/error.handler.js';

const app = express();
const PORT = process.env.PORT || 8080;

try {
    await mongoose.connect('mongodb+srv://adoptme_admin:pdr123@cluster0.p5h5y.mongodb.net/adoptme?retryWrites=true&w=majority');
    console.log('DB connected');
} catch (error) {
    console.log(error);
}

app.use(express.json());
app.use(cookieParser());

app.use(addLogger);

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);


app.use('*', (req, res, next) => {
    const error = new Error(`Ruta ${req.originalUrl} no encontrada`);
    error.code = 'NOT_FOUND';
    next(error);
});


app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
