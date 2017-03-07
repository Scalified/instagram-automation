import fs from 'fs'
import nconf from 'nconf'
import logger from './../common/logger.js'

let path = require('path');

nconf
    .argv()
    .env();

let configDir = path.resolve(__dirname);

let configFilePath = `${configDir}/${nconf.get('environment') || 'dev'}.json`;
logger.info(`Reading app configuration from ${configFilePath}`);
let configExists = fs.existsSync(configFilePath);
if (!configExists) {
    throw new Error('config file not found at path: ' + configFilePath)
}

nconf
    .file({file: configFilePath});

let rootConfig = nconf.get('app');
rootConfig.login = nconf.get('login');
rootConfig.pass = nconf.get('pass');

let dbHostKey = 'DB_HOST',
    dbHostValue = nconf.get(dbHostKey);

const format = `(${dbHostKey}) => \`${rootConfig.Mongo.address}\``; // external source
const formatAddress = eval.call(null, format); // indirect eval
rootConfig.Mongo.address = formatAddress(dbHostValue || 'localhost');

export default rootConfig;