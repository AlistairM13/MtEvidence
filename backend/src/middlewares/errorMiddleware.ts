import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = res.statusCode ? res.statusCode : 500;
  const statusCode = status < 300 ? 400 : status;
  res.status(statusCode);
  console.log(err.message);
  res.json({
    message: err.message,
    stack: err.stack,
  });
};

export default errorHandler;
