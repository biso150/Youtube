import express from "express";
import {logout, getEdit, postEdit, remove, see, startGithubLogin, finishGithubLogin, getChangePassword, postChangePassword} from "../controllers/userController"
import { protectorMiddleware, publicOnlyMiddleware, avatarUpload } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter.route("/editProfile").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"), postEdit);
userRouter.get("/remove", remove);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin)
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin)
userRouter.route("/changePassword").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/:id", see);  // (\\d+)

export default userRouter;