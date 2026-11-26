import { UserRepository } from "./user.repository.js";
import { HashingService } from "../../common/hashing/hashing.service.js";
import { validateIntegerValues, notExists, notFound, assertValidPassword } from "../../common/errors/commonErrors.js";

export class UserService {
    constructor() {
        this.userRepository = new UserRepository();
        this.hashingService = new HashingService();
    };

    async createUser(data) {
        const { first_name, last_name, email, password } = data;
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await this.userRepository.getUserByEmail(normalizedEmail);
        if (existingUser) {
            const err =  new Error('Email Already Exists!');
            err.statusCode = 409;
            throw err;
        }
        const hashedPass = await this.hashingService.hashPassword(password);
        try {
            const user = await this.userRepository.createUser({
                first_name: first_name.trim(), last_name: last_name.trim(), email: normalizedEmail, password: hashedPass
            });
            const { password: _, is_active, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            if (error.code === '23505') {
                const err = new Error('Email Already Exists!');
                err.statusCode = 409;
                throw err;
            };
            throw error;
        };
    };

    async updateUser(userId, data) {
        try {
            const parseId = Number(userId);
            validateIntegerValues(parseId, 'User ID');
            const updatedUser = await this.userRepository.updateUser(parseId, data);
            notFound(updatedUser, 'User');
            const { password: _, is_active, ...userWithoutPassword } = updatedUser;
            return userWithoutPassword;
        } catch (error) {
            throw error;
        };
    };

    async deleteUser(userId) {
        try {
            const parseId = Number(userId);
            validateIntegerValues(parseId, 'User ID');
            const user = await this.userRepository.getUserById(parseId);
            notFound(user, 'User');
            await this.userRepository.deleteUser(userId);
        } catch (error) {
            throw error;
        };
    };

    async updatePassword(userId, currentPassword, newPassword) {
        const parseId = Number(userId);
        validateIntegerValues(parseId, 'User ID');
        const user = await this.userRepository.getUserById(parseId);
        notFound(user, 'User');
        const isMatch = await this.hashingService.comparePlainPassword(currentPassword, user.password);
        assertValidPassword(isMatch);
        const hashedPass = await this.hashingService.hashPassword(newPassword);
        const updatedUser = await this.userRepository.updatePassword(parseId, hashedPass, user.password);
        if(!updatedUser) {
            const err = new Error('Passwords update conflict: account was modified or removed');
            err.statusCode = 409;
            throw err;
        }
        return { message: 'Password Updated Successfully!' };
    };
};