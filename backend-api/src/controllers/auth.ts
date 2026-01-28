import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { responseHandler, errorHandler } from "../utils/responseHandler";
import {
  authService,
  userAuthService,
} from "../services/modelServices/auth.services";

// Register new user
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name, phone } = req.body;

  // Check if email exists
  const existingUser = await userAuthService.findByEmail(email);
  if (existingUser) {
    return errorHandler("E-102a", res);
  }

  // Create user
  const user = await userAuthService.createUser({
    email,
    password,
    name,
    phone,
  });

  // Create session
  const session = await authService.createSession(user.id);

  return responseHandler(
    {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token: session.token,
      expiresAt: session.expiresAt,
    },
    res,
    201
  );
});

// Login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user
  const user = await userAuthService.findByEmail(email);
  if (!user) {
    return errorHandler("E-101", res);
  }

  // Check password
  if (!authService.verifyPassword(password, user.password)) {
    return errorHandler("E-101", res);
  }

  // Check if user is active
  if (!user.isActive) {
    return errorHandler("E-122", res);
  }

  // Create session
  const session = await authService.createSession(user.id);

  return responseHandler(
    {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token: session.token,
      expiresAt: session.expiresAt,
    },
    res
  );
});

// Logout
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (token) {
    await authService.deleteSession(token);
  }

  return responseHandler({ message: "Logged out successfully" }, res);
});

// Get current user
export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return errorHandler("E-003", res);
  }

  return responseHandler(user, res);
});

// Update profile
export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { name, phone } = req.body;

    if (!userId) {
      return errorHandler("E-003", res);
    }

    const user = await userAuthService.update({
      where: { id: userId },
      data: { name, phone },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
      },
    });

    return responseHandler(user, res);
  }
);

// Change password
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return errorHandler("E-003", res);
    }

    const user = await userAuthService.findOne({ where: { id: userId } });
    if (!user) {
      return errorHandler("E-104", res);
    }

    // Verify current password
    if (!authService.verifyPassword(currentPassword, user.password)) {
      return errorHandler("E-101", res);
    }

    // Check if same password
    if (authService.verifyPassword(newPassword, user.password)) {
      return errorHandler("E-108", res);
    }

    // Update password
    await userAuthService.update({
      where: { id: userId },
      data: { password: authService.hashPassword(newPassword) },
    });

    // Delete all sessions
    await authService.deleteUserSessions(userId);

    // Create new session
    const session = await authService.createSession(userId);

    return responseHandler(
      {
        message: "Password changed successfully",
        token: session.token,
        expiresAt: session.expiresAt,
      },
      res
    );
  }
);

// ============================================
// ADMIN ENDPOINTS
// ============================================

// Get all users (Admin)
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "20", role, isActive, search } = req.query;

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const take = parseInt(limit as string);

  const users = await userAuthService.findAllUsers({
    role: role as "USER" | "ADMIN" | undefined,
    isActive: isActive ? isActive === "true" : undefined,
    search: search as string,
    skip,
    take,
  });

  const total = await userAuthService.count({
    where: role ? { role: role as "USER" | "ADMIN" } : undefined,
  });

  return responseHandler(
    {
      users,
      pagination: {
        page: parseInt(page as string),
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    },
    res
  );
});

// Update user (Admin)
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name, phone, role, isActive } = req.body;

  const user = await userAuthService.findOne({ where: { id } });
  if (!user) {
    return errorHandler("E-104", res);
  }

  const updatedUser = await userAuthService.update({
    where: { id },
    data: { name, phone, role, isActive },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      isActive: true,
    },
  });

  return responseHandler(updatedUser, res);
});

// Delete user (Admin)
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const user = await userAuthService.findOne({ where: { id } });
  if (!user) {
    return errorHandler("E-104", res);
  }

  await userAuthService.delete({ where: { id } });
  return responseHandler({ message: "User deleted successfully" }, res);
});
