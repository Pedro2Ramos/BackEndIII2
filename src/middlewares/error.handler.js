import logger from '../utils/logger.js';

export const errorHandler = (error, req, res, next) => {
    logger.error(`Error: ${error.message}`);
    
    switch (error.code) {
        case 'AUTHENTICATION_ERROR':
            res.status(401).json({ status: 'error', error: error.message });
            break;
        case 'AUTHORIZATION_ERROR':
            res.status(403).json({ status: 'error', error: error.message });
            break;
        case 'NOT_FOUND':
            res.status(404).json({ status: 'error', error: error.message });
            break;
        case 'INVALID_PARAMS':
            res.status(400).json({ status: 'error', error: error.message });
            break;
        default:
            res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
}; 