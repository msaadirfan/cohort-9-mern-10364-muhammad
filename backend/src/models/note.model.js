import mongoose from "mongoose";

const noteSchema = mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },

    title: {
        type: String,
        required: [true, "Title is required"]
    },

    description: {
        type: String,
        required: [true, "description is required"]
    }},
    {timestamps: true}
)

const noteModel = mongoose.model("Note", noteSchema);

export default noteModel;