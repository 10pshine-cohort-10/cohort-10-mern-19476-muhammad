export const validateUpdatePasswordDto = (data) => {
    const errors = {};

    if(!data || Object.keys(data).length === 0 ) {
        return {
            isValid: false,
            errors: { message: "At least one field is required to update"}
        };
    };

    if(data.currentPassword === undefined || data.currentPassword === null || data.currentPassword === '') {
        errors.currentPassword = 'Current Password is reuquired';
    }else if (typeof data.currentPassword !== 'string') {
        errors.currentPassword = 'Current password must be a string';
    }

    if(data.password === undefined || data.password === null) {
        errors.password = 'New password is required'
    }else if(typeof data.password !== 'string') {
        errors.password = 'Password must be a string'
    }else if(data.password.length === 0) {
        errors.password = 'Password cannot be empty';
    }else if(data.password.length < 8) {
        errors.password = 'Password should be atleast 8 characters';
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
    }else if(data.password !== data.confirmPass) {
        errors.password = "Passwords Doesn't Match!"
    }

    return {
        isValid: Object.keys(errors).length === 0, errors
    };
}