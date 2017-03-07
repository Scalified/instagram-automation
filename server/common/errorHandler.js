'use strict';
import logger from './logger'

function getMongoErrorsCode(code) {
    let codes = {
        "11000": 409 //conflict. The field already exists and its unique
    };

    return codes[code] || 500;
}

/**
 * Takes a route handling function and returns
 * a function that wraps it in a `try/catch`. Caught
 * exceptions are forwarded to the `next` handler.
 */
export function async(routeHandler) {
    return async function (req, res, next) {
        try {
            await routeHandler(req, res, next);
        } catch (err) {
            next(err);
        }
    }
}

export default function (config, express) {
    express.response.wrappedJson = function (data) {
        express.response.json.call(this, {data: data});
    };

    return (err, req, res, next) => {
        var statusCode = err.status || 500;
        if (statusCode === 500) logger.error(err);
        else logger.warn(err);

        var validationErrors;

        //Mongoose specific errors
        switch (err.name) {
            case "ValidationError":
                statusCode = 400;
                logger.warn(err.message, err.errors);
                validationErrors = err.errors;
                break;
            case "CastError":
                statusCode = 400;
                logger.warn(err, err.path);
                //It isn't a validation/cast error to user. Let's considerate that this id doesn't exists at all.
                if (err.kind === "ObjectId" && err.path === "_id") {
                    err.name = 'Not Found';
                    err.message = 'Invalid identifier passed.';
                    statusCode = 404;
                }
                break;
            case "MongoError":
                statusCode = getMongoErrorsCode(err.code);
                break;
        }

        let response = {
            status: statusCode,
            message: err.message,
            type: err.name,
            err: err.path,
            validation: validationErrors
        };
        if (config.stackTrace) {
            response.stack = err.stack
        }
        res.status(response.status).json(response);
    };
};