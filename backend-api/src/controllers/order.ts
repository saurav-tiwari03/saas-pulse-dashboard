import { Request, Response } from "express";
import { asyncHandler, transactionHandler } from "../utils/asyncHandler";
import { responseHandler, errorHandler } from "../utils/responseHandler";
import {
  orderService,
  addressService,
} from "../services/modelServices/order.services";
import { cartService } from "../services/modelServices/cart.services";
import productService from "../services/modelServices/product.services";
import { TransactionClient } from "../types";
import { OrderStatus } from "@prisma/client";

// Get user's orders
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { page = "1", limit = "10" } = req.query;

  if (!userId) {
    return errorHandler("E-003", res);
  }

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const take = parseInt(limit as string);

  const orders = await orderService.findByUserId(userId, skip, take);
  const total = await orderService.count({ where: { userId } });

  return responseHandler(
    {
      orders,
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

// Get single order
export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const id = req.params.id as string;

  if (!userId) {
    return errorHandler("E-003", res);
  }

  const order = await orderService.findWithDetails(id);

  if (!order) {
    return errorHandler("E-2001", res);
  }

  // Check if user owns the order or is admin
  if (order.userId !== userId && req.user?.role !== "ADMIN") {
    return errorHandler("E-002", res);
  }

  return responseHandler(order, res);
});

// Create order from cart
export const createOrder = transactionHandler(
  async (req: Request, res: Response, _next, tx: TransactionClient) => {
    const userId = req.user?.id;
    const { addressId, paymentMethod, notes } = req.body;

    if (!userId) {
      return errorHandler("E-003", res);
    }

    // Check address
    if (!addressId) {
      return errorHandler("E-2004", res);
    }

    const address = await addressService.findOne({ where: { id: addressId } });
    if (!address || address.userId !== userId) {
      return errorHandler("E-2005", res);
    }

    // Get cart
    const cart = await cartService.findByUserId(userId);
    if (!cart || !cart.items || cart.items.length === 0) {
      return errorHandler("E-1903", res);
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of cart.items) {
      const product = await productService.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        return errorHandler("E-1701", res);
      }

      if (product.stock < item.quantity) {
        return errorHandler("E-1704", res);
      }

      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        size: item.size,
        color: item.color,
      });

      // Reduce stock
      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const shippingCost = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shippingCost + tax;

    // Generate order number
    const orderNumber = await orderService.generateOrderNumber();

    // Create order
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId,
        addressId,
        subtotal,
        shippingCost,
        tax,
        total,
        paymentMethod,
        notes,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: { include: { product: true } },
        address: true,
      },
    });

    // Clear cart
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return responseHandler(order, res, 201);
  }
);

// Cancel order
export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const id = req.params.id as string;

  if (!userId) {
    return errorHandler("E-003", res);
  }

  const order = await orderService.findWithDetails(id);

  if (!order) {
    return errorHandler("E-2001", res);
  }

  // Check if user owns the order
  if (order.userId !== userId && req.user?.role !== "ADMIN") {
    return errorHandler("E-002", res);
  }

  // Can only cancel pending orders
  if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
    return errorHandler("E-2002", res);
  }

  // Restore stock
  for (const item of order.items) {
    await productService.updateStock(item.productId, item.quantity);
  }

  const updatedOrder = await orderService.updateStatus(id, "CANCELLED");

  return responseHandler(updatedOrder, res);
});

// ============================================
// ADMIN ENDPOINTS
// ============================================

// Get all orders (Admin)
export const getAllOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const { page = "1", limit = "20", status, search } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const orders = await orderService.findAllOrders({
      status: status as OrderStatus | undefined,
      search: search as string,
      skip,
      take,
    });

    const total = await orderService.count({
      where: status ? { status: status as OrderStatus } : undefined,
    });

    return responseHandler(
      {
        orders,
        pagination: {
          page: parseInt(page as string),
          limit: take,
          total,
          totalPages: Math.ceil(total / take),
        },
      },
      res
    );
  }
);

// Update order status (Admin)
export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body;

    const order = await orderService.findOne({ where: { id } });
    if (!order) {
      return errorHandler("E-2001", res);
    }

    const validStatuses: OrderStatus[] = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!validStatuses.includes(status)) {
      return errorHandler("E-2003", res);
    }

    const updatedOrder = await orderService.updateStatus(id, status);
    return responseHandler(updatedOrder, res);
  }
);

// Get order stats (Admin)
export const getOrderStats = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await orderService.getOrderStats();
    return responseHandler(stats, res);
  }
);

// ============================================
// ADDRESS ENDPOINTS
// ============================================

// Get user's addresses
export const getAddresses = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return errorHandler("E-003", res);
    }

    const addresses = await addressService.findByUserId(userId);
    return responseHandler(addresses, res);
  }
);

// Create address
export const createAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { name, phone, street, city, state, zipCode, country, isDefault } =
      req.body;

    if (!userId) {
      return errorHandler("E-003", res);
    }

    // If this is the first address or isDefault, set as default
    const existingAddresses = await addressService.findByUserId(userId);
    const shouldBeDefault = existingAddresses.length === 0 || isDefault;

    if (shouldBeDefault && existingAddresses.length > 0) {
      await addressService.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await addressService.create({
      data: {
        userId,
        name,
        phone,
        street,
        city,
        state,
        zipCode,
        country: country || "USA",
        isDefault: shouldBeDefault,
      },
    });

    return responseHandler(address, res, 201);
  }
);

// Update address
export const updateAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const id = req.params.id as string;
    const { name, phone, street, city, state, zipCode, country, isDefault } =
      req.body;

    if (!userId) {
      return errorHandler("E-003", res);
    }

    const existing = await addressService.findOne({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return errorHandler("E-804", res);
    }

    if (isDefault) {
      await addressService.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await addressService.update({
      where: { id },
      data: { name, phone, street, city, state, zipCode, country, isDefault },
    });

    return responseHandler(address, res);
  }
);

// Delete address
export const deleteAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const id = req.params.id as string;

    if (!userId) {
      return errorHandler("E-003", res);
    }

    const existing = await addressService.findOne({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return errorHandler("E-804", res);
    }

    await addressService.delete({ where: { id } });
    return responseHandler({ message: "Address deleted successfully" }, res);
  }
);
