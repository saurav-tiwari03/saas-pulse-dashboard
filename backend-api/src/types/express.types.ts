import { Request } from "express";
import { TokenPayload } from "./user.types";

/**
 * Extended Express Request with authenticated user
 */
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

/**
 * Extend Express namespace for global type augmentation
 */
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
