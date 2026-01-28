import { Router } from "express";
import userRoutes from "./user.routes";

const router = Router();

// Mount route modules
router.use("/users", userRoutes);

/**
 * @swagger
 * /api/v1:
 *   get:
 *     summary: API v1 base endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API version info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API v1
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 */
router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "API v1",
    version: "1.0.0",
  });
});

export default router;
