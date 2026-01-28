import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";
import { errorHandler } from "../utils/responseHandler";

/**
 * Authentication middleware
 * Validates JWT token and attaches user to request
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      errorHandler("E-006", res); // Token missing
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      errorHandler("E-003", res); // Invalid token
      return;
    }

    // TODO: Verify JWT token and extract user data
    // Example with jsonwebtoken:
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    // req.user = decoded;

    // After verification, attach user to request
    // req.user = { id: decoded.id, email: decoded.email, role: decoded.role };

    next();
  } catch {
    errorHandler("E-003", res); // Invalid token
  }
};

/**
 * Role-based authorization middleware
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      errorHandler("E-006", res); // Token missing
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      errorHandler("E-002", res); // Access denied
      return;
    }

    next();
  };
};
