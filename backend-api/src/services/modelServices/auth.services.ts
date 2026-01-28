import Dal from "../databaseServices/dal";
import PrismaService from "../databaseServices/db";
import crypto from "crypto";

const prisma = PrismaService.getInstance();

class AuthService extends Dal<typeof prisma.session> {
  constructor() {
    super(prisma.session, "session");
  }

  generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  async createSession(userId: string, expiresInDays: number = 7) {
    const token = this.generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    return this.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async findByToken(token: string) {
    return this.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
          },
        },
      },
    });
  }

  async deleteSession(token: string) {
    return this.deleteMany({
      where: { token },
    });
  }

  async deleteUserSessions(userId: string) {
    return this.deleteMany({
      where: { userId },
    });
  }

  async cleanExpiredSessions() {
    return this.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  }

  // Simple password hashing (in production, use bcrypt)
  hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
  }

  verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }
}

class UserAuthService extends Dal<typeof prisma.user> {
  constructor() {
    super(prisma.user, "user");
  }

  async findByEmail(email: string) {
    return this.findFirst({
      where: { email: email.toLowerCase() },
    });
  }

  async createUser(data: {
    email: string;
    password: string;
    name?: string;
    phone?: string;
  }) {
    const authService = new AuthService();
    return this.create({
      data: {
        email: data.email.toLowerCase(),
        password: authService.hashPassword(data.password),
        name: data.name,
        phone: data.phone,
      },
    });
  }

  async findActiveUsers(skip?: number, take?: number) {
    return this.findMany({
      where: { isActive: true },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  }

  async findAllUsers(options?: {
    role?: "USER" | "ADMIN";
    isActive?: boolean;
    search?: string;
    skip?: number;
    take?: number;
  }) {
    const where: any = {};

    if (options?.role) {
      where.role = options.role;
    }

    if (options?.isActive !== undefined) {
      where.isActive = options.isActive;
    }

    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: "insensitive" } },
        { email: { contains: options.search, mode: "insensitive" } },
      ];
    }

    return this.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: options?.skip,
      take: options?.take,
    });
  }
}

export const authService = new AuthService();
export const userAuthService = new UserAuthService();
