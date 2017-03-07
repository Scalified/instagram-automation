'use strict';

import webApp from './web'
import logger from '../common/logger';
import http from 'http';
import config from '../config/index';
import * as db from '../common/mongoose'
import rabbit  from '../common/jackrabbit';

let port = normalizePort(process.env.port || config.PORT || 3000);
webApp.set('port', port);

function normalizePort(val) {
    let port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
}

export let server = http.Server(webApp);

server.listen(port, () => logger.info('listening on *:' + webApp.get("port")));
server.on('error', onError);
server.on('listening', onListening);

db.connect(config.Mongo, () => logger.info('connected to Mongo'));

rabbit.connect(config.RabbitMQ, () => logger.info('WEB: connected to RabbitMQ'));

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    logger.debug('Listening on ' + bind);
}
