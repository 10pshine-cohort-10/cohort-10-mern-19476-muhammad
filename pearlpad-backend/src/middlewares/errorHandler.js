import { logger } from "../config/logger.config.js";

export const errorHandler = (err, req, res, next) => {
    const isMalformedJson = 
        err.type === 'entity.parse.failed' ||
        (err instanceof SyntaxError && (err.status === 400 || err.statusCode === 400) && 'body' in err);
    const safePath = req.originalUrl.split('?')[0];
    const rawStatus = err.statusCode ?? err.status;
    const isValidHttpErrorStatus = 
        Number.isInteger(rawStatus) &&  rawStatus >= 400 && rawStatus <= 599;
    const statusCode = isMalformedJson ? 400 : (isValidHttpErrorStatus ? rawStatus : 500);
    // Server-side log keeps real error details (except malformed JSON)
    const logMessage = isMalformedJson
    ? 'Invalid JSON payload' : (err.message ||'Internal Server Error');
    // Client response hides internal details for any 5xx error
    const responseMessage = isMalformedJson
    ? 'Invalid JSON payload'
    : (statusCode >= 500 ? 'Internal Server Error' : (err.message || 'Request failed'));


    const safeErr = {
        name: err.name,
        logMessage,
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
    }, isMalformedJson ? 'Malformed JSOn request rejected' : 'Exception caught in global handler');

    if (res.headersSent) {
        return  next(err);
    };

    res.status(statusCode).json({
        success: false,
        responseMessage,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
};