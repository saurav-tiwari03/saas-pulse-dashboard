import { User } from "@prisma/client";
import PrismaService from "../databaseServices/db";
import Dal from "../databaseServices/dal";
import { SafeUser, PaginationOptions } from "../../types";

/**
 * User Services
 * Extends DAL with user-specific business logic
 */
class UserServices extends Dal<typeof PrismaService extends { getInstance: () => infer P } ? P extends { user: infer U } ? U : never : never> {
  constructor() {
    const prisma = PrismaService.getInstance();
    super(prisma.user, "user");
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.findFirst({ where: { email } });
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await this.count({ where: { email } });
    return count > 0;
  }

  /**
   * Get user without password
   */
  sanitize(user: User): SafeUser {
    const { password: _, ...safeUser } = user;
    return safeUser as SafeUser;
  }

  /**
   * Find active users with pagination
   */
  async findActiveUsers(options?: PaginationOptions) {
    return this.findMany({
      where: { isActive: true },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      ...options,
    });
  }
}

export default new UserServices();
