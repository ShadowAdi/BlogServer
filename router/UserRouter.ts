import express from "express";
import {
  AuthenticatedUser,
  CreateUser,
  DeleteUser,
  GetAllUsers,
  GetSingleUser,
  LoginUser,
  UpdateUser,
} from "../controller/UserController.js";
import { authMiddleware } from "../middlewares/AuthCheck.js";

export const UserRouter = express.Router();

UserRouter.get("/", GetAllUsers);
UserRouter.post("/", CreateUser);
UserRouter.post("/login/", LoginUser);
UserRouter.get("/user/:userId", GetSingleUser);
UserRouter.patch("/user/:userId", authMiddleware, UpdateUser);
UserRouter.get("/user/:userId", authMiddleware, AuthenticatedUser);
UserRouter.delete("/user/:userId", authMiddleware, DeleteUser);
