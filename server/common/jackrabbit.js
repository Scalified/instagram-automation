import jackrabbit from "jackrabbit";
import logger from "./logger.js";

function Rabbit() {
    let self = this;

    var _config, _onceOpen;

    let connectWithRetry = function () {
        let onError = function (err) {
            if (err) {
                self.connection.close(() => console.log('RabbitMQ: connection closed'));
                logger.error('Failed to connect to RabbitMQ - retrying in 5 sec', err);
                setTimeout(connectWithRetry, 5000);
            }
        };

        let onConnected = function () {
            logger.info('RabbitMQ connection:' + _config.address + ' is opened.');
            if (_onceOpen instanceof Function) _onceOpen();
            self.connection.getInternals().connection
                .on('error', () => {
                    logger.warn('RabbitMQ connection:' + _config.address + ' is closed due to network error.');
                })
        };

        self.connection = jackrabbit(_config.address)
            .on('connected', onConnected)
            .on('error', onError)
            .on('disconnected', () => logger.warn('RabbitMQ: disconnected'))
    };

    let gracefulExit = function () {
        self.connection.close(() => {
            console.log('RabbitMQ connection:' + _config.address + ' is disconnected through app termination');
            process.exit(0);
        });
    };

    self.connect = function (config, onceOpen) {
        _config = config;
        _onceOpen = onceOpen;
        connectWithRetry();
        process
            .on('SIGINT', gracefulExit)
            .on('SIGTERM', gracefulExit);
    };

}

let rabbit = new Rabbit();

export default rabbit;

