import winston from 'winston';

const { combine, timestamp, printf } = winston.format;

const msgFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

export const logger = winston.createLogger({
    format: combine(timestamp(), msgFormat),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' })
    ]
});