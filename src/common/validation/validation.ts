
import { ZodType } from "zod";
import { AppError } from "../../pkj/error/appError.js";
import { NextFunction, Request, Response } from "express";

export function validationBody(dto: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = dto.safeParse(req.body);

      if (!result.success) {
        const errorMessage = result.error.issues.map(
          (issue) => `${issue.path.join(".")}: ${issue.message}`
        );

        throw new AppError(errorMessage.join(", "), 400);
      }

      req.body = result.data;

      next();
    } catch (error) {
      next(error);
    }
  };
}





export function validationQuery(dto: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = dto.safeParse(req.query);

      if (!result.success) {
        const errors = result.error.issues.map(
          (issue) =>
            `${issue.path.join(".")}: ${issue.message}`
        );

        throw new AppError(errors.join(", "), 400);
      }

      // Express query is read-only in some typings.
      Object.assign(req.query, result.data);

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function validationParams(dto: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = dto.safeParse(req.params);

      if (!result.success) {
        const errors = result.error.issues.map(
          (issue) =>
            `${issue.path.join(".")}: ${issue.message}`
        );

        throw new AppError(errors.join(", "), 400);
      }

      Object.assign(req.params, result.data);

      next();
    } catch (error) {
      next(error);
    }
  };
}



