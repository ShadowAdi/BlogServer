import express from "express";

import { authMiddleware } from "../middlewares/AuthCheck.js";
import {
  CreateComment,
  GetAllComments,
} from "../controller/CommentController.js";

export const CommentRouter = express.Router();

CommentRouter.get("/:blogId", GetAllComments);
CommentRouter.post("/:blogId", authMiddleware, CreateComment);
