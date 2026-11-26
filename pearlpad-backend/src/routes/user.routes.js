import { Router } from "express";
import { UserController } from '../modules/users/user.controller.js';
import { validate } from "../middlewares/validation.middleware.js";
import { validateCreateUserDto } from "../middlewares/users/validateCreateUserRequest.middleware.js";
import { validateUpdateUserDto } from "../middlewares/users/validateUpdateUserRequest.middleware.js";
import { validateUpdatePasswordDto } from "../middlewares/users/validateUpdatePasswordRequest.middleware.js";

const router = new Router();
const userController = new UserController();

router.post('/', validate(validateCreateUserDto), userController.createUser); // will be removed after auth integration
router.patch('/update/:id', validate(validateUpdateUserDto), userController.updateUser);
router.patch('/updatepass/:id', validate(validateUpdatePasswordDto), userController.updatePassword);
router.delete('/delete/:id', userController.deleteUser);

export default router;