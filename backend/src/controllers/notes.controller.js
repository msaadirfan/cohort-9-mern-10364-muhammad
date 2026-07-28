import noteModel from "../models/note.model.js";


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
}

catch(err){
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

    return res.status(200).json({
        notes: notes
    })
}

catch(err){
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
        return res.status(404).json({
            message: "Note not found"
        })
    }

    res.status(200).json({
        note: note
    })
}

    catch(err){
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
            return res.status(404).json({
                message: "Not not found"
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
            note: {
                title: note.title,
                description: note.description
            }
        })
    }

    catch(err){
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
            return res.status(404).json({
                message: "Note not found"
            })
        }
        res.status(200).json({
            message: "Note deleted successfully"
        })

    }
    catch(err){
        return res.status(400).json({
            message: "Invalid request",
            error: err.message
        })
    }
}


