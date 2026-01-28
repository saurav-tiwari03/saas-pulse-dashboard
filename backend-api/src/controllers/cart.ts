import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { responseHandler, errorHandler } from "../utils/responseHandler";
import {
  cartService,
  cartItemService,
} from "../services/modelServices/cart.services";
import productService from "../services/modelServices/product.services";

// Get user's cart
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return errorHandler("E-003", res);
  }

  const cart = await cartService.getOrCreateCart(userId);

  // Calculate totals
  let subtotal = 0;
  if (cart.items) {
    for (const item of cart.items) {
      subtotal += Number(item.product.price) * item.quantity;
    }
  }

  return responseHandler(
    {
      ...cart,
      subtotal: subtotal.toFixed(2),
      itemCount: cart.items?.length || 0,
    },
    res
  );
});

// Add item to cart
export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { productId, quantity = 1, size, color } = req.body;

  if (!userId) {
    return errorHandler("E-003", res);
  }

  // Check if product exists and has stock
  const product = await productService.findOne({ where: { id: productId } });
  if (!product) {
    return errorHandler("E-1701", res);
  }

  if (product.stock < quantity) {
    return errorHandler("E-1704", res);
  }

  // Get or create cart
  const cart = await cartService.getOrCreateCart(userId);

  // Add item
  await cartItemService.addItem(cart.id, productId, quantity, size, color);

  // Return updated cart
  const updatedCart = await cartService.getOrCreateCart(userId);

  let subtotal = 0;
  if (updatedCart.items) {
    for (const item of updatedCart.items) {
      subtotal += Number(item.product.price) * item.quantity;
    }
  }

  return responseHandler(
    {
      ...updatedCart,
      subtotal: subtotal.toFixed(2),
      itemCount: updatedCart.items?.length || 0,
    },
    res,
    201
  );
});

// Update cart item quantity
export const updateCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const itemId = req.params.itemId as string;
    const { quantity } = req.body;

    if (!userId) {
      return errorHandler("E-003", res);
    }

    if (quantity < 1) {
      return errorHandler("E-1904", res);
    }

    // Check if item exists
    const item = await cartItemService.findOne({ where: { id: itemId } });
    if (!item) {
      return errorHandler("E-1902", res);
    }

    // Check stock
    const product = await productService.findOne({
      where: { id: item.productId },
    });
    if (product && product.stock < quantity) {
      return errorHandler("E-1704", res);
    }

    await cartItemService.updateQuantity(itemId, quantity);

    // Return updated cart
    const updatedCart = await cartService.getOrCreateCart(userId);

    let subtotal = 0;
    if (updatedCart.items) {
      for (const item of updatedCart.items) {
        subtotal += Number(item.product.price) * item.quantity;
      }
    }

    return responseHandler(
      {
        ...updatedCart,
        subtotal: subtotal.toFixed(2),
        itemCount: updatedCart.items?.length || 0,
      },
      res
    );
  }
);

// Remove item from cart
export const removeFromCart = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const itemId = req.params.itemId as string;

    if (!userId) {
      return errorHandler("E-003", res);
    }

    // Check if item exists
    const item = await cartItemService.findOne({ where: { id: itemId } });
    if (!item) {
      return errorHandler("E-1902", res);
    }

    await cartItemService.removeItem(itemId);

    // Return updated cart
    const updatedCart = await cartService.getOrCreateCart(userId);

    let subtotal = 0;
    if (updatedCart.items) {
      for (const item of updatedCart.items) {
        subtotal += Number(item.product.price) * item.quantity;
      }
    }

    return responseHandler(
      {
        ...updatedCart,
        subtotal: subtotal.toFixed(2),
        itemCount: updatedCart.items?.length || 0,
      },
      res
    );
  }
);

// Clear cart
export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return errorHandler("E-003", res);
  }

  await cartService.clearCart(userId);

  return responseHandler({ message: "Cart cleared successfully" }, res);
});
