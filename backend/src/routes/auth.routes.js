import {Router} from 'express';
import * as authController from "../controllers/auth.controller.js";
import auth from "../middleware/auth.middleware.js"
const authRouter = Router();

authRouter.post("/register", authController.register);

authRouter.post("/login", authController.login);

authRouter.get("/me", auth, authController.getMe);

authRouter.post("/refresh-token", authController.refreshToken);

authRouter.post("/logout", authController.logout);

authRouter.post("/logout-all", authController.logoutAll);

authRouter.post("/refresh-token", authController.refreshToken);

export default authRouter;