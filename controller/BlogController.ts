import { NextFunction, request, Request, Response } from "express";
import { CustomTryCatch } from "../utils/CustomTryCatch.js";
import { prismaClient } from "../db/prisma.js";
import { logger } from "../utils/logger.js";
import { AppError } from "../utils/AppError.js";

export const GetAllBlogs = CustomTryCatch(
  async (req: Request, response: Response, next: NextFunction) => {
    const { blogTitle } = req.query;
    const title = typeof blogTitle === "string" ? blogTitle : undefined;
    const blogs = await prismaClient.blog.findMany({
      where: { title },
      select: {
        blogImage: true,
        title: true,
        id: true,
        createdAt: true,
        content: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            likes: true,
            dislikes: true,
            comments: true,
          },
        },
      },
    });
    return response.status(200).json({
      blogs,
      success: true,
      message: "All Blogs Found",
    });
  }
);

export const GetBlog = CustomTryCatch(
  async (req: Request, response: Response, next: NextFunction) => {
    const { blogId } = req.params;
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
    const singleBlog = await prismaClient.blog.findFirst({
      where: { id: Number(blogId) },
      select: {
        blogImage: true,
        title: true,
        id: true,
        createdAt: true,
        content: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        likes: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        dislikes: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        comments: {
          select: {
            content: true,
            createdAt: true,
            id: true,
            author: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            dislikes: true,
            comments: true,
          },
        },
      },
    });
    return response.status(200).json({
      singleBlog,
      success: true,
      message: `Blog with id ${blogId} is found`,
    });
  }
);

export const CreateBlog = CustomTryCatch(
  async (req: Request, response: Response, next: NextFunction) => {
    const user = req.user;
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

    const data = req.body;
    const { content, title } = data;
    if (!content || !title) {
      logger.error(
        `Content and title are not provided. Failed to created Blog`
      );
    }

    const createdBlog = await prismaClient.blog.create({
      data: {
        content,
        title,
        authorId: sub,
        blogImage: data?.blogImage || null,
      },
    });
    return response.status(201).json({
      messaged: "Blog Created",
      success: true,
      createdBlog,
    });
  }
);

export const UpdatedBlog = CustomTryCatch(
  async (request: Request, response: Response, next: NextFunction) => {
    const user = request.user;
    const {blogId} = request.params;

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

    if (isBlogExist.authorId !== sub) {
      logger.error("You are not authorised to update the blog");
      return next(
        new AppError("You are not authorised to update the blog", 404)
      );
    }

    const data = request.body;
    const updatedBlog = await prismaClient.blog.update({
      where: {
        id: isBlogExist.id,
      },
      data: data,
    });
    return response.status(200).json({
      messaged: "Blog Successfully Updated",
      status: true,
      updatedBlog,
    });
  }
);

export const DeleteBlog = CustomTryCatch(
  async (request: Request, response: Response, next: NextFunction) => {
    const user = request.user;
    const blogId = request.params;

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

    if (isBlogExist.authorId !== sub) {
      logger.error("You are not authorised to delete the blog");
      return next(
        new AppError("You are not authorised to delete the blog", 404)
      );
    }

    await prismaClient.blog.delete({
      where: {
        id: isBlogExist.id,
      },
    });
    return response.status(200).json({
      messaged: "Blog Successfully Deleted",
      status: true,
    });
  }
);

