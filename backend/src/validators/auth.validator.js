import validator from 'validator';
import ApiError from '../utils/api.error.js';
import logger from '../utils/logger.js';

export const validateLogin = (req, res, next) => {
    const {email, password} = req.body;

    if(typeof email !== "string"){
       logger.error("Invalid email");
       return next(
           new ApiError(400, "Invalid email")
        ); 
    }

    if(!validator.isEmail(email)){
       logger.error("Invalid email");
       return next(
           new ApiError(400, "Invalid email")
        );
    }
    if(typeof password !== "string"){
        logger.error("Invalid password");
        return next(
            new ApiError(400, "Invalid password")
        );
    }
    
    if(password.trim().length == 0){
        logger.error("Password length should be 8 or more characters");
        return next(
            new ApiError(400, "Password should be 8 or more characters")
        );
    }
    if(password.length < 8){
        logger.error("Password length should be 8 or more characters");
        return next(
            new ApiError(400, "Password should be 8 or more characters")
        );
    }
    next();
}

export const validateRegister = (req, res, next) =>{
    const {username, email, password} = req.body;

    if(typeof email !== "string"){
        logger.error("Invalid email");
        return next(
            new ApiError(400, "Invalid email")
        );
    }
    
    if(!validator.isEmail(email)){
        logger.error("Invalid email");
        return next(
            new ApiError(400, "Invalid email")
        );
    }
    if(typeof username !== "string"){
        logger.error("Invalid username");
        return next(
            new ApiError(400, "Invalid username")
        );
    }
    if(username.trim().length == 0){
        logger.error("Invalid username");
        return next(
            new ApiError(400, "Invalid username")
        );
    }

    if(typeof password !== "string"){
        logger.error("Invalid password");
        return next(
            new ApiError(400, "Invalid password")
        );
    }
    if(password.trim().length == 0){
        logger.error("Password should be 8 or more characters");
        return next(
            new ApiError(400, "Password should be 8 or more characters")
        );
    }
    
    if(password.length < 8){
        logger.error("Password should be 8 or more characters");
        return next(
            new ApiError(400, "Password should be 8 or more characters")
        );
    }
    next();
}
