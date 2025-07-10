import { NextFunction, Request, Response } from "express";
import { CustomTryCatch } from "../utils/CustomTryCatch.js";
import { AppError } from "../utils/AppError.js";
import { logger } from "../utils/logger.js";
import { prismaClient } from "../db/prisma.js";

export const GetAllComments = CustomTryCatch(
  async (request: Request, response: Response, next: NextFunction) => {
    const { blogId } = request.params;

    if (!blogId) {
      logger.error(`Blog ID Not Found`);
      return next(new AppError(`Blog ID Not Found`, 401));
    }
    const isBlogExist = await prismaClient.blog.findFirst({
      where: {
        id: Number(blogId),
      },
    });
    if (!isBlogExist) {
      logger.error("Failed to find Blog");
      return next(new AppError("Failed to find Blog", 404));
    }
    const allComments = await prismaClient.comment.findMany({
      where: {
        blogId: Number(blogId),
      },
    });
    return response.status(200).json({
      message: "All Comments have been fetched",
      success: true,
      allComments,
    });
  }
);

export const CreateComment = CustomTryCatch(
  async (request: Request, response: Response, next: NextFunction) => {
    const user = request.user;
    const { blogId } = request.params;

    if (!blogId) {
      logger.error(`Blog ID Not Found`);
      return next(new AppError(`Blog ID Not Found`, 401));
    }
    const isBlogExist = await prismaClient.blog.findFirst({
      where: {
        id: Number(blogId),
      },
    });
    if (!isBlogExist) {
      logger.error("Failed to find Blog");
      return next(new AppError("Failed to find Blog", 404));
    }

    if (!user) {
      logger.error(`Failed to get the authenticated user ${user}`);
      console.log(`Failed to get the authenticated user ${user}`);
      return next(
        new AppError(`Failed to get the authenticated user ${user}`, 404)
      );
    }
    const { sub } = user;
    if (!sub) {
      logger.error(`Failed to get the authenticated user ${sub}`);
      console.log(`Failed to get the authenticated user ${sub}`);
      return next(
        new AppError(`Failed to get the authenticated user ${sub}`, 404)
      );
    }
    const userFound = await prismaClient.user.findUnique({
      where: { id: sub },
    });
    if (!userFound) {
      logger.error(`User With Id Do Not Exist: ${sub}`);
      console.log(`User With Id Do Not Exist: ${sub}`);
      return next(new AppError(`User With Id Do Not Exist: ${sub}`, 404));
    }

    const data = request.body;

    const createdComment = await prismaClient.comment.create({
      data: {
        content: data.content,
        authorId: user.sub,
        blogId: Number(blogId),
      },
    });
    return response.status(200).json({
      message: "New Comment Has Been Created",
      success: true,
      createdComment,
    });
  }
);

export const DeleteComment = CustomTryCatch(
  async (request: Request, response: Response, next: NextFunction) => {
    const user = request.user;
    const { commentId } = request.params;

    if (!commentId) {
      logger.error(`Comment ID Not Found`);
      return next(new AppError(`Blog ID Not Found`, 401));
    }
    const isCommentExist = await prismaClient.comment.findFirst({
      where: {
        id: Number(commentId),
      },
    });
    if (!isCommentExist) {
      logger.error("Failed to find Comment");
      return next(new AppError("Failed to find Comment", 404));
    }

    if (!user) {
      logger.error(`Failed to get the authenticated user ${user}`);
      console.log(`Failed to get the authenticated user ${user}`);
      return next(
        new AppError(`Failed to get the authenticated user ${user}`, 404)
      );
    }
    const { sub } = user;
    if (!sub) {
      logger.error(`Failed to get the authenticated user ${sub}`);
      console.log(`Failed to get the authenticated user ${sub}`);
      return next(
        new AppError(`Failed to get the authenticated user ${sub}`, 404)
      );
    }
    const userFound = await prismaClient.user.findUnique({
      where: { id: sub },
    });
    if (!userFound) {
      logger.error(`User With Id Do Not Exist: ${sub}`);
      console.log(`User With Id Do Not Exist: ${sub}`);
      return next(new AppError(`User With Id Do Not Exist: ${sub}`, 404));
    }

    if (userFound.id !== isCommentExist.authorId) {
      logger.error(`You are not allowed to delete comment`);
      console.log(`You are not allowed to delete comment`);
      return next(new AppError(`You are not allowed to delete comment`, 404));
    }

    await prismaClient.comment.delete({
      where: {
        id: Number(commentId),
      },
    });
    return response.status(200).json({
      message: "Comment Has Been Deleted",
      success: true,
    });
  }
);

export const UpdateComment = CustomTryCatch(
  async (request: Request, response: Response, next: NextFunction) => {
    const user = request.user;
    const { commentId } = request.params;

    if (!commentId) {
      logger.error(`Comment ID Not Found`);
      return next(new AppError(`Blog ID Not Found`, 401));
    }
    const isCommentExist = await prismaClient.comment.findFirst({
      where: {
        id: Number(commentId),
      },
    });
    if (!isCommentExist) {
      logger.error("Failed to find Comment");
      return next(new AppError("Failed to find Comment", 404));
    }

    if (!user) {
      logger.error(`Failed to get the authenticated user ${user}`);
      console.log(`Failed to get the authenticated user ${user}`);
      return next(
        new AppError(`Failed to get the authenticated user ${user}`, 404)
      );
    }
    const { sub } = user;
    if (!sub) {
      logger.error(`Failed to get the authenticated user ${sub}`);
      console.log(`Failed to get the authenticated user ${sub}`);
      return next(
        new AppError(`Failed to get the authenticated user ${sub}`, 404)
      );
    }
    const userFound = await prismaClient.user.findUnique({
      where: { id: sub },
    });
    if (!userFound) {
      logger.error(`User With Id Do Not Exist: ${sub}`);
      console.log(`User With Id Do Not Exist: ${sub}`);
      return next(new AppError(`User With Id Do Not Exist: ${sub}`, 404));
    }

    if (userFound.id !== isCommentExist.authorId) {
      logger.error(`You are not allowed to delete comment`);
      console.log(`You are not allowed to delete comment`);
      return next(new AppError(`You are not allowed to delete comment`, 404));
    }

    const data = request.body;

    const updatedComment = await prismaClient.comment.update({
      where: {
        id: Number(commentId),
      },
      data,
    });
    return response.status(200).json({
      message: "Comment Has Been Updated",
      success: true,
      updatedComment,
    });
  }
);
