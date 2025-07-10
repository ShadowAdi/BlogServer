import { NextFunction, Request, Response } from "express";
import { CustomTryCatch } from "../utils/CustomTryCatch.js";
import { AppError } from "../utils/AppError.js";
import { logger } from "../utils/logger.js";
import { prismaClient } from "../db/prisma.js";

export const GetAllComments = CustomTryCatch(
  async (request: Request, response: Response, next: NextFunction) => {
    const blogId = request.params;

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
