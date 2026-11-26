import bcrypt from 'bcrypt';

const MAX_BCRYPT_BYTES = 72;
const SALT_ROUNDS = 10; 

export class HashingService {
    hashPassword = async (password) => {
        if (typeof password !== 'string' || Buffer.byteLength(password, 'utf8') > MAX_BCRYPT_BYTES) {
            const err = new Error('Password must not exceed 72 bytes');
            err.statusCode = 400;
            throw err;
        }
        return bcrypt.hash(password, SALT_ROUNDS);
    };

    comparePlainPassword = async (plainPassword, hashedPassword) => {
        return bcrypt.compare(plainPassword, hashedPassword);
    };
};