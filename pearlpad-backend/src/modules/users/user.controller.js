import { logger } from "../../config/logger.config.js";
import { UserService } from "./user.service.js"
import { UserResponseDto } from "./dtos/userResponse.dto.js";

export class UserController {
    constructor() {
        this.userService = new UserService();
    };

    createUser = async (req, res, next) => {
        try {
            logger.info('User Registration Started');
            const data = req.body;
            const user = await this.userService.createUser(data);
            logger.info({ userId: user.id, email: user.email }, 'User Registered Successfully!');
            res.status(201).json({ data: UserResponseDto(user)});
        } catch (error) {
            next(error);
        };
    };

    updateUser = async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const user = await this.userService.updateUser(id, data);
            logger.info('User Updated!');
            res.status(201).json({ data: UserResponseDto(user)});
        } catch (error) {
            next(error);
        };
    };

    deleteUser = async (req, res, next) => {
        try {
            const { id } = req. params;
            await this.userService.deleteUser(id);
            logger.info('User Deleted Successfully!');
            res.status(200).json({ message: 'User Deletd Successfully'});
        } catch (error) {
            next(error);
        };
    };

    updatePassword = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { currentPassword, password } = req.body;
            await this.userService.updatePassword(id, currentPassword, password);
            logger.info('Password Updated Successfully!');
            res.status(200).json({ message: 'Password Updated Successfully!'});
        } catch (error) {
            next(error);
        };
    };
};