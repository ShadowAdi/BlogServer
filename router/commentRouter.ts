import express from "express";

import { authMiddleware } from "../middlewares/AuthCheck.js";
import {
  CreateComment,
  DeleteComment,
  GetAllComments,
  UpdateComment,
} from "../controller/CommentController.js";

export const CommentRouter = express.Router();

CommentRouter.get("/:blogId", GetAllComments);
CommentRouter.post("/:blogId", authMiddleware, CreateComment);
CommentRouter.delete("/comment/:commentId",authMiddleware,DeleteComment)
CommentRouter.patch("/comment/:commentId",authMiddleware,UpdateComment)