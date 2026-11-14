import pg from 'pg';
import dotenv from 'dotenv';
import { createUserTable } from '../modules/user.entity.js';

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
        console.log(`Database connection error`);
    } else {
        console.log('Database Connected successfully!');
        release();
    }
});

export const initDB = async () => {
    try {
        await pool.query(createUserTable);
        console.log('Tables initialized');
    } catch (error) {
        console.log('Error initiazing the database');
    }
};