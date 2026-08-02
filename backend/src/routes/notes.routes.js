import {Router} from 'express';
import * as notesController from '../controllers/notes.controller.js';

const notesRouter = Router();

notesRouter.post("/create", notesController.create);

notesRouter.post("/edit/:id", notesController.edit);

notesRouter.post("/delete/:id", notesController.delete);

notesRouter.get("/get", notesController.get);

notesRouter.get("/getById/:id", notesController.getById);

notesRouter.get("/getByTitle/:title", notesController.getByTitle);

export default notesRouter;