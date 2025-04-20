import winston from 'winston';

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4
    }
};

// Añadiendo colores correctamente
winston.addColors({
    fatal: 'red',
    error: 'magenta',
    warning: 'yellow',
    info: 'blue',
    debug: 'white'
});

const logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    ]
});

export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
};

export default logger; 