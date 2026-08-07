import {Router} from 'express';
import * as notesController from '../controllers/notes.controller.js';
import auth from '../middleware/auth.middleware.js';

const notesRouter = Router();

notesRouter.post("/", auth, notesController.createNote);

notesRouter.get("/", auth, notesController.getNotes);

notesRouter.get("/:id", auth, notesController.getNoteById);

notesRouter.patch("/:id", auth, notesController.editNote);

notesRouter.delete("/:id", auth, notesController.deleteNote);


export default notesRouter;