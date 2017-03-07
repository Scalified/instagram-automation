import fs from 'fs'
import assert from 'assert'
import minimist from 'minimist'
import nconf from 'nconf'

let argv = minimist(process.argv.slice(2));
let configFilePath = argv.config;
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath);

let config = nconf
    .argv()
    .env()
    .file({file: configFilePath});

let apiConfig = config.get('api');
let mongoConfig = config.get('mongo');

console.log(apiConfig);

export default {host: apiConfig.host, mongo: mongoConfig}