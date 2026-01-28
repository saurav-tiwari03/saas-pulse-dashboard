import { Response } from "express";
import errorCodes from "../constants/errorCodes";

export const responseHandler = <T>(
  data: T,
  res: Response,
  httpStatus: number = 200
): Response => {
  return res.status(httpStatus).json({ data });
};

export const errorHandler = (
  errorCode: string,
  res: Response,
  message: string | null = null
): Response => {
  const error = errorCodes[errorCode];
  if (error) {
    return res.status(error.httpStatus).json({
      code: error.httpStatus,
      message: message || error.message,
    });
  } else {
    return res.status(500).json({
      code: 500,
      message: "An unknown error occurred.",
    });
  }
};

export const validatorErrorHandler = (
  httpStatus: number,
  res: Response,
  message: string | null
): Response => {
  return res.status(httpStatus).json({
    code: httpStatus,
    message: message ? message.replace(/["']/g, "") : "An unknown error occurred.",
  });
};
