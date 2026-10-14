function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    const status = Number.isInteger(err.status)
        ? err.status
        : 500;

    const body = {
        error:
            status === 500
                ? 'Internal server error'
                : err.message
    };

    if (err.details) {
        body.details = err.details;
    }

    if (status === 500) {
        console.error(err);
    }

    res.status(status).json(body);
}

module.exports = { errorHandler };