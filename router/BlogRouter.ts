import express from "express";

import { authMiddleware } from "../middlewares/AuthCheck.js";
import {
  CreateBlog,
  DeleteBlog,
  GetAllBlogs,
  GetBlog,
  UpdatedBlog,
} from "../controller/BlogController.js";

export const BlogRouter = express.Router();

BlogRouter.get("/", GetAllBlogs);
BlogRouter.post("/", authMiddleware, CreateBlog);
BlogRouter.get("/blog/:blogId", GetBlog);
BlogRouter.patch("/blog/:blogId", authMiddleware, UpdatedBlog);
BlogRouter.delete("/blog/:blogId", authMiddleware, DeleteBlog);
