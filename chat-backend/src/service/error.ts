import { Request, Response } from 'express';

export const errors = (
  error: any,
  _eq: Request,
  res: Response,
) => {
  console.log('dsnfdasfasdfl>>>>>>>>', error);
  return res.status(error.statusCode).json({
    statusCode: error.statusCode,
    message: error.message,
  });
};

export class ApiError {
  message: string;

  statusCode: number;

  constructor(message: string, statusCode: number) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
