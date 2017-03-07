import ExtendableError from 'es6-error';

export class BadRequest extends ExtendableError {
    constructor(message = 'Bad Request') {
        super(message);
        this.status = 400;
    }
}

export class Forbidden extends ExtendableError {
    constructor(message = 'Forbidden') {
        super(message);
        this.status = 403;
    }
}

export class NotFound extends ExtendableError {
    constructor(message = 'Not Found') {
        super(message);
        this.status = 404;
    }
}