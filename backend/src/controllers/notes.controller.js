import noteModel from "../models/note.model.js";
import logger from "../utils/logger.js";

export const createNote = async(req, res)=>{
try{
    const {title, description} = req.body;

    const note = await noteModel.create({
        user: req.user.id,
        title: title,
        description: description
    });

    res.status(201).json({
        message: "Note created",
        note
    })
    logger.info("Note created");
}

catch(err){
    logger.error(err.message, "Invalid request");
    res.status(400).json({
        message: "Invalid Request",
        error: err.message
    })
}   
}

export const getNotes = async(req, res)=>{
    try{
    const notes = await noteModel.find({
        user: req.user.id
    })

    logger.info("Notes returned successfully");
    return res.status(200).json({
        notes: notes
    })
}

catch(err){
    logger.error(err.message, "Invalid request");
    res.status(400).json({
        message: "Invalid request",
        error: err.message
    })
}
}

export const getNoteById = async(req, res)=>{
    try{
    const noteId = req.params.id;

    const note = await noteModel.findOne({
        _id: noteId,
        user: req.user.id
    });

    if(!note){
        logger.error("Note not found");
        return res.status(404).json({
            message: "Note not found"
        })
    }

    res.status(200).json({
        note: note
    })
    logger.info("Note returned successfully");
}

    catch(err){
        logger.error(err.message, "Invalid request");
        res.status(400).json({
            message: "Invalid request",
            error: err.message
        })
    }
}

export const editNote = async(req, res)=>{
    try{
        const noteId = req.params.id;
        
        const note = await noteModel.findOne({
            _id: noteId,
            user: req.user.id
        });

        if(!note){
            logger.error("Note not found");
            return res.status(404).json({
                message: "Note not found"
            })
        }

        const {title, description} = req.body;
        
        if(title !== undefined){
        note.title = title;
    }
        if(description !== undefined){
        note.description = description;
    }

        await note.save();
        res.status(200).json({
            message: "Note updated successfully",
            note: note
        })

        logger.info("Note updated successfully");
    }

    catch(err){
        logger.error(err.message, "Invalid request");
        res.status(400).json({
            message: "Invalid request",
            error: err.message
        })
    }

}

export const deleteNote = async(req, res)=>{
    try{
        const noteId = req.params.id;

        const note = await noteModel.deleteOne({
            _id: noteId,
            user: req.user.id
        })

        if(note.deletedCount === 0){
            logger.error("Note not found");
            return res.status(404).json({
                message: "Note not found"
            })
        }
        res.status(200).json({
            message: "Note deleted successfully"
        })
        logger.info("Note deleted successfully");
    }
    catch(err){
        logger.error(err.message, "Invalid request");
        return res.status(400).json({
            message: "Invalid request",
            error: err.message
        })
    }
}