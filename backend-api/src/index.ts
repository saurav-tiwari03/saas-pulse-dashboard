import path from "path";
import dotenv from "dotenv";

// Load environment-specific .env file
const envFile = process.env.NODE_ENV === "production" ? ".env.prod" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

console.log(`📁 Loaded config from: ${envFile}`);

import app from "./app";
import PrismaService from "./services/databaseServices/db";

const PORT = process.env.PORT || 5005;

async function main() {
  // Connect to database
  await PrismaService.connect();

  // Start server
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  });

  // ============================================
  // GRACEFUL SHUTDOWN
  // ============================================

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    server.close(async () => {
      console.log("✅ HTTP server closed");
      await PrismaService.disconnect();
      process.exit(0);
    });

    // Force exit after 10 seconds
    setTimeout(() => {
      console.error("❌ Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

main().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});
