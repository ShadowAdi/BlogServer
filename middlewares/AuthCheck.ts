import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import { NextFunction, Request, Response } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return next(new AppError('No token provided', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (typeof decoded !== 'string' && decoded.sub && decoded.email) {
      req.user = {
        sub: typeof decoded.sub === 'string' ? parseInt(decoded.sub, 10) : decoded.sub,
        email: decoded.email
      };
      return next();
    } else {
      return next(new AppError('Invalid token payload', 401));
    }
  } catch (error: unknown) {
    console.error(error);
    return next(new AppError('Invalid or expired token', 401));
  }
};
