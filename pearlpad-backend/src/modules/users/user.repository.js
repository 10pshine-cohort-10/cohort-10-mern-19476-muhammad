import pool from '../../config/db.config.js';

export class UserRepository {
    async createUser(data) {
        const { first_name, last_name, email, password } = data;
        const result =  await pool.query(
            'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *', [first_name, last_name, email, password]
        );
        return result.rows[0];
    };

    async getUserById(userId) {
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1', [userId]
        );
        return result.rows[0];
    };

    async getUserByEmail(email) {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1', [email]
        );
        return result.rows[0];
    };

    async updateUser(userId, data) {
        const values = [];
        const fields = [];
        let counter = 1;

        if(data.first_name !== undefined) {
            fields.push(`first_name = $${counter++}`);
            values.push(data.first_name);
        }
        if(data.last_name !== undefined) {
            fields.push(`last_name = $${counter++}`);
            values.push(data.last_name);
        }
        values.push(userId);
        const result = await pool.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = $${counter} RETURNING *`,
            values
        );
        return result.rows[0];
    };

    async deleteUser(userId) {
        await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING *', [userId]
        );
    };

    async updatePassword(userId, newPassword, currentPassword) {
        const result = await pool.query(
            'UPDATE users SET password = $1 WHERE id = $2 AND password = $3 RETURNING id', [newPassword, userId, currentPassword]
        );
        return result.rows[0];
    };
}