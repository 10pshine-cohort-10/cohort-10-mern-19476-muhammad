import { HashingService } from "../hashing/hashing.service.js";

const hashingService = new HashingService();

export const notExists = (param, name) => {
    if(param === undefined || param === null || !param) {
        const err = new Error(`${name} Does Not Exists!`);
        err.statusCode = 400;
        throw err;
    };
    return param;
};

export const notFound = (param, name) => {
    if(!param) {
        const err = new Error(`${name} Not Found!`);
        err.statusCode = 404;
        throw err;
    };
};

export const validateIntegerValues = (id, name) => {
    if(!id || id < 0 || !Number.isInteger(Number(id))) {
        const err = new Error(`Invalid ${name}!`);
        err.statusCode = 400;
        throw err;
    };
};

export const assertValidPassword =  (isMatch) => {
    if(!isMatch) {
        const err = new Error('Invalid Password');
        err.statusCode = 401;
        throw err;
    };
};