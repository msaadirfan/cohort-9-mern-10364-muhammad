import {Router} from 'express';
import * as notesController from '../controllers/notes.controller.js';
import auth from '../middleware/auth.middleware.js';
import * as noteValidator from '../validators/note.validator.js';

const notesRouter = Router();

notesRouter.post("/", auth, noteValidator.noteCreate, notesController.createNote);

notesRouter.get("/", auth, notesController.getNotes);

notesRouter.get("/:id", auth, noteValidator.noteId, notesController.getNoteById);

notesRouter.patch("/:id", auth, noteValidator.noteEdit, notesController.editNote);

notesRouter.delete("/:id", auth, noteValidator.noteId, notesController.deleteNote);


export default notesRouter;