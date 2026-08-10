import logger from "../utils/logger.js";

const errorMiddleware = (err, req, res, next) => {
    const status = err.statusCode ?? err.status ?? 500;

    const message = status >= 500
        ? "Internal server error"
        : err.message || "Bad Request";

    logger.error(
        {
            err,
            status: status,
            message: message
        },
        "Request Failed"
    );

    if (res.headersSent) {
        return next(err);
    }

    return res.status(status).json({
        success: "fail",
        message: message
    });
};

export default errorMiddleware;