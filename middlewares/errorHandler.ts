import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { logger } from "../utils/logger.js";

export const CustomErrorHandler = (
  err: AppError,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  logger.error(
    `Failed to get the error the status code is ${err.status} and the message is ${err.message}`
  );
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    success: false,
  });
};
