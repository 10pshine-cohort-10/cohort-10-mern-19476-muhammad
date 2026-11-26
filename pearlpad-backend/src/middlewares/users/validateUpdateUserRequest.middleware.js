export const validateUpdateUserDto = (data) => {
    const errors = {}
    
    if(!data || typeof data !== 'object' || 
        (data.first_name === undefined && data.last_name === undefined) 
    ) {
        return {
            isValid: false,
            errors: { message: "At least one field is required to update"}
        };
    };

    if(data.first_name !== undefined) {
        if(typeof data.first_name !== 'string') {
            errors.first_name = 'First Name must be a string!';
        } else if(data.first_name.length === 0) {
            errors.first_name = 'First Name cannot be empty'
        } else if(data.first_name.length > 50) {
            errors.first_name = 'First Name must be less than 50 characters';
        }
    }

    if(data.last_name !== undefined) {
        if(typeof data.last_name !== 'string') {
            errors.last_name = 'Last Name must be a string';
        } else if(data.last_name.length === 0) {
            errors.last_name = 'Last Name cannot be empty'
        } else if(data.last_name.length > 50) {
            errors.last_name = 'Last Name must be less than 50 characters';
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0, errors
    };
}