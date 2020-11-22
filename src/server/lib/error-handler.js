export default function handleErrors(error) {
    switch (error.code) {
        case 404:
            return error;

        default:
            return new OperationError('Operation failed');
    }
}

class OperationError extends Error {
    code = 500;

    constructor(message) { 
        super(message);
    }
}

export class NotFoundError extends Error {
    code = 404;

    constructor(message) { 
        super(message);
    }
}