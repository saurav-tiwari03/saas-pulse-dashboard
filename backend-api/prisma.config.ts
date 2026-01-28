import path from "path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Load environment-specific .env file
const envFile = process.env.NODE_ENV === "production" ? ".env.prod" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",

  // Database URL for Prisma CLI (migrations, generate, etc.)
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
