import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { responseHandler } from "../utils/responseHandler";
import userService from "../services/modelServices/user.services";

/**
 * Get all users
 * GET /api/v1/users
 */
export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await userService.findActiveUsers();
  responseHandler(users, res);
});

/**
 * Get user by ID
 * GET /api/v1/users/:id
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await userService.findOne({ where: { id: id as string } });

  if (!user) {
    throw new Error("E-104"); // User not found
  }

  responseHandler(userService.sanitize(user), res);
});

/**
 * Create new user
 * POST /api/v1/users
 */
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  // Check if user already exists
  const existingUser = await userService.findByEmail(email);
  if (existingUser) {
    throw new Error("E-102a"); // User with email already exists
  }

  // TODO: Hash password before storing
  const user = await userService.create({
    data: {
      email,
      name,
      password, // Remember to hash this!
    },
  });

  responseHandler(userService.sanitize(user), res, 201);
});

/**
 * Update user
 * PUT /api/v1/users/:id
 */
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;

  // Check if user exists
  const existingUser = await userService.findOne({ where: { id: id as string } });
  if (!existingUser) {
    throw new Error("E-104"); // User not found
  }

  const user = await userService.update({
    where: { id: id as string },
    data: { name, email },
  });

  responseHandler(userService.sanitize(user), res);
});

/**
 * Delete user
 * DELETE /api/v1/users/:id
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if user exists
  const existingUser = await userService.findOne({ where: { id: id as string } });
  if (!existingUser) {
    throw new Error("E-104"); // User not found
  }

  await userService.delete({ where: { id: id as string } });

  responseHandler({ message: "User deleted successfully" }, res);
});
