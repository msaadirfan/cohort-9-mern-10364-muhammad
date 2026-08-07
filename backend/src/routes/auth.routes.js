import {Router} from 'express';
import * as authController from "../controllers/auth.controller.js";
import auth from "../middleware/auth.middleware.js";
import * as authValidator from "../validators/auth.validator.js";

const authRouter = Router();

authRouter.post("/register", authValidator.validateRegister, authController.register);

authRouter.post("/login", authValidator.validateLogin, authController.login);

authRouter.get("/me", auth, authController.getMe);

authRouter.post("/refresh-token", authController.refreshToken);

authRouter.post("/logout", authController.logout);

authRouter.post("/logout-all", authController.logoutAll);


export default authRouter;