import { Request, Response, NextFunction } from "express";
import { errorHandler } from "./responseHandler";
import { logError } from "./logger";
import PrismaService from "../services/databaseServices/db";
import { TransactionClient } from "../types";

/**
 * Async handler wrapper to catch errors in async route handlers
 * Eliminates the need for try-catch blocks in every controller
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.log("error-->", error);
      const errorCode = error instanceof Error ? error.message : "E-001";
      logError(error);
      errorHandler(errorCode, res);
    }
  };
};

/**
 * Transaction handler wrapper for database transactions
 * Automatically handles transaction commit/rollback
 */
export const transactionHandler = (
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    tx: TransactionClient
  ) => Promise<unknown>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const prisma = PrismaService.getInstance();
    try {
      return await prisma.$transaction(
        async (tx) => {
          try {
            return await handler(req, res, next, tx as TransactionClient);
          } catch (error) {
            console.error("🔥 Error inside transaction block:", error);
            throw error;
          }
        },
        { timeout: 30000 }
      );
    } catch (error) {
      console.error("🔥 Transaction failed:", error);
      const errorCode = error instanceof Error ? error.message : "E-001";
      logError(error);
      return errorHandler(errorCode, res);
    }
  };
};
