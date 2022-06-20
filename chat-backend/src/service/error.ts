import { Request, Response, NextFunction } from 'express';

export const errors = (
  error: any,
  _: Request,
  res: Response,
  next:NextFunction,
) => {
  console.log('dsnfdasfasdfl>>>>>>>>', error);
  console.log(next);
  return res.status(error.statusCode).json({
    statusCode: error.statusCode,
    message: error.message,
  });
};

export class ApiError {
  message: string;

  statusCode: number;

  constructor(message: string, statusCode: number) {
    // console.log(message);

    this.message = message;
    this.statusCode = statusCode;
  }
}
