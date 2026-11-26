import { CreateUserRequestDto } from '../../modules/users/dtos/createUserRequest.dto.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (email) => {
    if (typeof email !== 'string') return false;
    const trimmed = email.trim();
    return trimmed.length <= 75 && EMAIL_REGEX.test(trimmed);
};

export const validateCreateUserDto = (data) => {
    const errors = {}
    Object.keys(CreateUserRequestDto).forEach(field => {
        if(!data[field]) {
            errors[field] = `${field} is required`;
        }
    })
    if(typeof data.first_name !== 'string') {
        errors.first_name = 'First Name must be a string!';
    }else if(data.first_name.length > 50) {
        errors.first_name = 'First Name must be less than 50 characters';
    }

    if(typeof data.last_name !== 'string') {
        errors.last_name = 'Last Name must be a string!';
    }else if(data.last_name.length > 50) {
        errors.last_name = 'Last Name must be less than 50 characters';
    }

    if (!errors.email && !isValidEmail(data.email)) {
        errors.email = 'Please provide a valid email address';
    }

    if(typeof data.password !== 'string') {
        errors.password = 'Password must be a string!';
    }else if(data.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
    }else if(data.password.length > 50) {
        errors.password = 'Password must not be more than 50 characters';
    }else if (Buffer.byteLength(data.password, 'utf8') > 72) {
        errors.password = 'Password must not exceed 72 bytes'
    }else if(!/[a-z]/.test(data.password)) {
        errors.password = 'Password must contain at least one lowercase character';
    }else if(!/[A-Z]/.test(data.password)) {
        errors.password = 'Password must contain at least one uppercase character';
    }else if(!/[0-9]/.test(data.password)) {
        errors.password = 'Password must contain at least one number';
    }else if(!/[^a-zA-Z0-9]/.test(data.password)) {
        errors.password = 'Password must contain at least one special character';
    }
    return {
        isValid: Object.keys(errors).length === 0, errors
    };
};