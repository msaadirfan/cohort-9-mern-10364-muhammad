import validator from 'validator';
import ApiError from '../utils/api.error.js';

export const validateLogin = async(req, res, next) => {
    const {email, password} = req.body;

    if(!validator.isEmail(email)){
       return next(
        new ApiError(400, "Invalid email")
       );
    }
    if(typeof password !== "string"){
        return next(
            new ApiError(400, "Invalid password")
        );
    }
    
    if(password.trim().length == 0){
        return next(
            new ApiError(400, "Password should be 8 or more characters")
        );
    }
    if(password.length < 8){
        return next(
            new ApiError(400, "Password should be 8 or more characters")
        );
    }
    next();
}

export const validateRegister = async(req, res, next) =>{
    const {username, email, password} = req.body;

    if(!validator.isEmail(email)){
        return next(
            new ApiError(400, "Invalid email")
        );
    }
    if(typeof username !== "string"){
        return next(
            new ApiError(400, "Invalid username")
        );
    }
    if(username.trim().length == 0){
        return next(
            new ApiError(400, "Invalid username")
        );
    }

    if(typeof password !== "string"){
        return next(
            new ApiError(400, "Invalid password")
        );
    }
    if(password.trim().length == 0){
        return next(
            new ApiError(400, "Password should be 8 or more characters")
        );
    }

    if(password.length < 8){
        return next(
            new ApiError(400, "Password should be 8 or more characters")
        );
    }
    next();
}
