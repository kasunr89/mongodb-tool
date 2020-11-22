export function setError(expressApp) {
    expressApp.use(
        (error, req, res, next) => {
            res.status(error.code).send({
                code: error.code,
                message: error.message
            });
        }
    );
}
