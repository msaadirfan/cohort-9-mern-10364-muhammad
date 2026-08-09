import ApiError from "../utils/api.error.js";
import mongoose from "mongoose";
import logger from "../utils/logger.js";

export const noteCreate = async(req, res, next)=>{

    const {title, description} = req.body;

    if (typeof title !== "string"){
        logger.error("Invalid title");
        return next(
            new ApiError(400, "Invalid title")
        );
    }
    if (title.trim().length === 0){
        logger.error("Invalid title");
        return next(
            new ApiError(400, "Invalid title")
        );
    }

    if (typeof description !== "string"){
        logger.error("Invalid description");
        return next(
            new ApiError(400, "Invalid description")
        );
    }

    if (description.trim().length === 0){
        logger.error("Invalid description");
        return next(
            new ApiError(400, "Invalid description")
        );
    }

    next();
}

export const noteEdit = async(req, res, next)=>{
    const noteId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(noteId)){
            logger.error("Invalid ID");
            return next(
                new ApiError(400, "Invalid ID")
            );
        }

    const {title, description} = req.body;

    if(!title && !description){
        logger.error("Invalid request");
        return next(
            new ApiError(400, "Invalid request")
        );
    }

       
    if(title !== undefined){
        if(typeof title !== "string" || title.trim().length === 0){
            logger.error("Invalid title");
            return next(
                new ApiError(400, "Invalid title")
            );
        }
    }
        if(description !== undefined){
        if(typeof description !== "string" || description.trim().length === 0){
            logger.error("Invalid description");
            return next(
                new ApiError(400, "Invalid description")
            );
        }
    }
    next();
}

export const noteId = async(req, res, next)=>{
    const noteId = req.params.id;
     if (!mongoose.Types.ObjectId.isValid(noteId)){
        logger.error("Invalid ID");
        return next(
            new ApiError(400, "Invalid ID")
        );
    }
    next();
}
