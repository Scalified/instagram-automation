'use strict';

import logger from '../common/logger';
import config from '../config/index';
import rabbit  from '../common/jackrabbit';

rabbit.connect(config.RabbitMQ, () => {
    logger.info('WORKER: connected to RabbitMQ');
    let exchange = rabbit.connection.default();
    let usersQueue = exchange.queue({name: 'users', durable: true});

    usersQueue.consume(onMessage, {noAck: false});
});

function onMessage(data, ack) {
    //TODO: process and save results to MongoDB
    console.log('Instagram user processed:', data);
    ack();
}