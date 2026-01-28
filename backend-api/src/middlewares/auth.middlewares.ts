import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";
import { errorHandler } from "../utils/responseHandler";
import { authService } from "../services/modelServices/auth.services";

/**
 * Authentication middleware
 * Validates session token and attaches user to request
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

    // Find session with valid token
    const session = await authService.findByToken(token);

    if (!session || !session.user) {
      errorHandler("E-003", res); // Invalid token
      return;
    }

    // Check if user is active
    if (!session.user.isActive) {
      errorHandler("E-122", res); // User inactive
      return;
    }

    // Attach user to request
    req.user = {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
    };

    next();
  } catch {
    errorHandler("E-003", res); // Invalid token
  }
};

/**
 * Role-based authorization middleware
 */
export const authorize = (...allowedRoles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
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

/**
 * Optional authentication middleware
 * Does not fail if no token provided, but attaches user if valid token exists
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      if (token) {
        const session = await authService.findByToken(token);

        if (session && session.user && session.user.isActive) {
          req.user = {
            id: session.user.id,
            email: session.user.email,
            role: session.user.role,
          };
        }
      }
    }

    next();
  } catch {
    // Continue without authentication
    next();
  }
};
