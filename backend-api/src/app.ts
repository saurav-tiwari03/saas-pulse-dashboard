import express, { Application, Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import v1Routes from "./routes/v1/index.routes";

const app: Application = express();

// ============================================
// MIDDLEWARE
// ============================================

// CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    "http://localhost:3000", // Next.js frontend
    "http://localhost:5173", // Vite admin panel
    "http://localhost:5174",
  ];
  
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  
  next();
});

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// API DOCUMENTATION (Protected)
// ============================================

const isDevEnvironment = process.env.NODE_ENV !== "production";
const swaggerEnabled = process.env.SWAGGER_ENABLED === "true" || isDevEnvironment;

// Basic auth middleware for Swagger
const swaggerAuth = (req: Request, res: Response, next: NextFunction): void => {
  // Skip auth in development
  if (isDevEnvironment) {
    next();
    return;
  }

  // Check basic auth in production
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", 'Basic realm="API Documentation"');
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("utf8");
  const [username, password] = credentials.split(":");

  const validUsername = process.env.SWAGGER_USERNAME || "admin";
  const validPassword = process.env.SWAGGER_PASSWORD;

  if (!validPassword) {
    res.status(403).json({ message: "Swagger disabled - no password configured" });
    return;
  }

  if (username === validUsername && password === validPassword) {
    next();
    return;
  }

  res.setHeader("WWW-Authenticate", 'Basic realm="API Documentation"');
  res.status(401).json({ message: "Invalid credentials" });
};

// Swagger UI - only if enabled
if (swaggerEnabled) {
  app.use(
    "/api-docs",
    swaggerAuth,
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Analytic Tool API Docs",
    })
  );

  // Swagger JSON endpoint
  app.get("/api-docs.json", swaggerAuth, (_req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

// ============================================
// ROUTES
// ============================================

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// API v1 routes
app.use("/api/v1", v1Routes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    code: 404,
    message: "Route not found",
  });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err.message);

  res.status(500).json({
    code: 500,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

export default app;
