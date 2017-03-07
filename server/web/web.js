import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import cors from 'express-cors'
import compression from 'compression'

import {stream} from '../common/logger'
import errorHandler from '../common/errorHandler'
import webConfig from '../config'
import setupRoutes from './routes'
import {NotFound} from "../common/errors";

let web = express();
web.use(cors(webConfig.Cors));
web.use(compression());

web.use(morgan('short', {"stream": stream}));
web.use(bodyParser.json({limit: '20mb'}));
web.use(bodyParser.urlencoded({extended: true}));
web.use(express.static('public', {maxAge: '100d'}));

//Require routes
setupRoutes(web);

// catch 404 and forward to error handler
web.use((req, res, next) => {
    next(new NotFound('Not Found'));
});

web.use(errorHandler(webConfig.ErrorHandler, express));

export default web;