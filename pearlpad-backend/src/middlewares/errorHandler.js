import { logger } from "../config/logger.config.js";

export const errorHandler = (err, req, res, next) => {
    const isMalformedJson = 
        err.type === 'entity.parse.failed' ||
        (err instanceof SyntaxError && (err.status === 400 || err.statusCode === 400) && 'body' in err);
        const safePath = req.originalUrl.split('?')[0];
    const statusCode = isMalformedJson ? 400 : (err.statusCode || err.status || 500);
    const message = isMalformedJson
    ? 'Internal JSON payload' : (err.message ||'Internal Server Error');

    const safeErr = {
        name: err.name,
        message: isMalformedJson ? 'Invalid JSON payload' : err.message,
        type: err.type,
        code: err.code,
        ...(process.env.NODE_ENV !== 'production' && !isMalformedJson && { stack: err.stack }),
    };

    logger.error({
        err: safeErr,
        reqId: req.id,
        path: safePath,
        method: req.method,
        statusCode,
    }, `Exception caught in global handler: ${message}`);

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
};