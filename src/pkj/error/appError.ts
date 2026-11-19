export class AppError extends Error {
  public readonly statusCode: number;
public readonly isOptional : boolean;
  constructor(message:string,statusCode:number ) {



    super(message);

    this.statusCode = statusCode;
    this.isOptional = true;
    Error.captureStackTrace(this,this.constructor)
  }
}