import { NextFunction, Request, Response } from "express";
import { AppError } from "./appError";



export function globalErrorHandler      (err:AppError, req:Request, res:Response, next:NextFunction) {
   
  if (err.isOptional) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,

    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });

}


