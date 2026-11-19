import { AppError } from "../../../pkj/error/appError";

export function userExist() {
  throw new AppError("User exist", 409);
}

export const userNotExist = (): never => {
  const error = new Error("User does not exist");

  Object.assign(error, {
    statusCode: 404
  });

  throw error;
};


export function userAlreadyVerified() {
  throw new AppError("User is Verified", 400);
}

export function userNotVerified() {
  throw new AppError("User is not verified", 403);
}
