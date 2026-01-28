import { Router } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import categoryRoutes from "./category.routes";
import productRoutes from "./product.routes";
import cartRoutes from "./cart.routes";
import orderRoutes from "./order.routes";

const router = Router();

// Mount route modules
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);

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
