import PinoHttp from "pino-http";
import { logger } from "../config/logger.config.js";

const getSafePath = (req) => {
    const rawUrl = req.originalUrl || req.url || '';
    return rawUrl.split('?')[0];
};

export const httpLogger = PinoHttp({
    logger,
    serializers: {
        req: function (req) {
            return {
                id: req.id,
                method: req.method,
                url: getSafePath(req)
            };
        },
        res: function (res) {
            return {
                statusCode: res.statusCode
            };
        },
    },

    customLogLevel: function (req, res, err) {
        if (res.statusCode >= 500 || err) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
    },

    customSuccessMessage: function(req, res) {
        return `${req.method} ${getSafePath(req)} completed with status ${res.statusCode}`;
    },

    customErrorMessage: function(req, res, err) {
        return `${req.method} ${getSafePath(req)} failed with status ${res.statusCode}: ${err.message}`;
    }
});