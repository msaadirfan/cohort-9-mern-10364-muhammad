import ApiError from "../utils/api.error.js";
import mongoose from "mongoose";


export const noteCreate = async(req, res, next)=>{

    const {title, description} = req.body;

    if (typeof title !== "string"){
        return next(
            new ApiError(400, "Invalid title")
        );
    }
    if (title.trim().length === 0){
        return next(
            new ApiError(400, "Invalid title")
        );
    }

    if (typeof description !== "string"){
        return next(
            new ApiError(400, "Invalid description")
        );
    }

    if (description.trim().length === 0){
        return next(
            new ApiError(400, "Invalid description")
        );
    }

    next();
}

export const noteEdit = async(req, res, next)=>{
    const noteId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(noteId)){
            return next(
                new ApiError(400, "Invalid ID")
            );
        }

    const {title, description} = req.body;

    if(!title && !description){
        return next(
            new ApiError(400, "Invalid request")
        );
    }

       
    if(title !== undefined){
        if(typeof title !== "string" || title.trim().length === 0){
            return next(
                new ApiError(400, "Invalid title")
            );
        }
    }
        if(description !== undefined){
        if(typeof description !== "string" || description.trim().length === 0){
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
        return next(
            new ApiError(400, "Invalid ID")
        );
    }
    next();
}
