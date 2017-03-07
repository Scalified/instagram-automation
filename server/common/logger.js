import winston from 'winston'
import fs from 'fs'

winston.emitErrs = true;

let logDirectory = './.logs';

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

let logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: logDirectory + '/all-logs.log',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'info',
            humanReadableUnhandledException: true,
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

export default logger;

export let stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};