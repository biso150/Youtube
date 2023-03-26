import express from "express";
import { watch, getEdit, postEdit, remove, getUpload, postUpload } from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter.route("/upload").all(protectorMiddleware).get(getUpload).post(videoUpload.fields([{ name: "video", maxCount: 1 }, { name: "thumb", maxCount: 1 }]), postUpload);  // videoRouter.get("/upload", getUpload); videoRouter.get("/upload", postUpload); 와 같다
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.get("/:id([0-9a-f]{24})/remove", protectorMiddleware, remove);


export default videoRouter;