import pg from 'pg';
import dotenv from 'dotenv';
import { createUserTable } from '../modules/user.entity.js';
import { logger } from './logger.config.js';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

pool.connect((err, client, release) => {
    if (err) {
        logger.error(`Database connection error`);
    } else {
        logger.info('Database Connected successfully!');
        release();
    }
});

export const initDB = async () => {
    try {
        await pool.query(createUserTable);
        logger.info('Tables initialized');
    } catch (error) {
        logger.error('Error initiazing the database');
    }
};