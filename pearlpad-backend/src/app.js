import dotenv from 'dotenv';
import express from 'express';
import { initDB } from './config/db.config.js';
import { httpLogger } from './middlewares/httpLogger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './config/logger.config.js';

dotenv.config();

const app = express();

app.use(httpLogger);
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Pearl Pad API is running' })
});

//All app routes will be initiated over here

app.use((req, res, next) => {
    const safePath = req.originalUrl.split('?')[0];
    const err = new Error (`Route${safePath} not found`);
    err.statusCode = 404;
    next(err);
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await initDB();
        app.listen(PORT, () => {
            logger.info(`Server Running on port ${PORT}`);
        });
    } catch (error) {
        logger.error({err: error}, 'Failed to start the server due to database initialization error');
        process.exit(1);
    }
};

startServer();