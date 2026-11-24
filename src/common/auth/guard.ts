import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppError } from '../../pkj/error/appError.js';
import { NextFunction, Request,Response } from 'express';
import { env } from '../config/env';


export function guard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      throw new AppError("No token provided", 401);
    }

    const decoded = jwt.verify(token, env.jwt.secretKey);

    if (typeof decoded === "string" || !decoded.id) {
      throw new AppError("Invalid token", 401);
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    next(error);
  }
}