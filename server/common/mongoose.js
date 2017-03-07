import mongoose from 'mongoose'
import logger from './logger.js'
import bluebird from 'bluebird'

//mongoose.Promise = global.Promise;
mongoose.Promise = bluebird;
//mongoose.set('debug', true);

export function connect(config, onceOpen) {
    var reconnect;
    //Used to reconnect when application starts first time.
    let connectWithRetry = function () {
        return mongoose.connect(config.address, config.options, function (err) {
            if (err) {
                logger.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
                reconnect = setTimeout(connectWithRetry, 5000);
            }
        });
    };
    connectWithRetry();
    mongoose.connection
        .once('open', function () {
            logger.info('Mongoose default connection open to ' + config.address);
            if (onceOpen instanceof Function) onceOpen();
        })
        .on('connecting', function () {
            logger.info('Connecting to MongoDB...')
        })
        .on('connected', function () {
            logger.info('Connection established to MongoDB');
            clearTimeout(reconnect);
        })
        .on('error', logger.error)
        .on('disconnecting', function () {
            logger.info('Disconnecting MongoDB...')
        })
        .on('disconnected', function () {
            logger.error('Connection to MongoDB has been disconnected.');
        })
        .on('reconnected', function () {
            logger.info('Reconnected to MongoDB');
        });

    function gracefulExit() {
        mongoose.connection.close(function () {
            console.log('Mongoose default connection with DB :' + config.address + ' is disconnected through app termination');
            process.exit(0);
        });
    }

    process
        .on('SIGINT', gracefulExit)
        .on('SIGTERM', gracefulExit);

    return mongoose.connection;
}