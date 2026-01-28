import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * Singleton Prisma Service
 * Ensures single database connection across the application
 * Uses Prisma v7 with PostgreSQL adapter
 */
class PrismaService {
  private static instance: PrismaClient | null = null;
  private static pool: Pool | null = null;

  private constructor() {}

  static getInstance(): PrismaClient {
    if (!PrismaService.instance) {
      // Create PostgreSQL connection pool
      PrismaService.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });

      // Create Prisma adapter
      const adapter = new PrismaPg(PrismaService.pool);

      // Create Prisma client with adapter
      PrismaService.instance = new PrismaClient({
        adapter,
        log:
          process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
      });
    }
    return PrismaService.instance;
  }

  static async connect(): Promise<void> {
    const client = PrismaService.getInstance();
    try {
      await client.$connect();
      console.log("✅ Database connected successfully");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      process.exit(1);
    }
  }

  static async disconnect(): Promise<void> {
    if (PrismaService.instance) {
      await PrismaService.instance.$disconnect();
      PrismaService.instance = null;
    }
    if (PrismaService.pool) {
      await PrismaService.pool.end();
      PrismaService.pool = null;
    }
    console.log("🔌 Database disconnected");
  }
}

export default PrismaService;
