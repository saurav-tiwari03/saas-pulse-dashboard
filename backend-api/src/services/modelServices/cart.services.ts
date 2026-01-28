import Dal from "../databaseServices/dal";
import PrismaService from "../databaseServices/db";

const prisma = PrismaService.getInstance();

class CartService extends Dal<typeof prisma.cart> {
  constructor() {
    super(prisma.cart, "cart");
  }

  async findByUserId(userId: string) {
    return this.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async getOrCreateCart(userId: string) {
    let cart = await this.findByUserId(userId);
    if (!cart) {
      cart = await this.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: { category: true },
              },
            },
          },
        },
      });
    }
    return cart;
  }

  async clearCart(userId: string) {
    const cart = await this.findFirst({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return cart;
  }
}

class CartItemService extends Dal<typeof prisma.cartItem> {
  constructor() {
    super(prisma.cartItem, "cartItem");
  }

  async findByCartAndProduct(
    cartId: string,
    productId: string,
    size?: string,
    color?: string
  ) {
    return this.findFirst({
      where: { cartId, productId, size: size || null, color: color || null },
    });
  }

  async addItem(
    cartId: string,
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) {
    const existing = await this.findByCartAndProduct(
      cartId,
      productId,
      size,
      color
    );

    if (existing) {
      return this.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true },
      });
    }

    return this.create({
      data: {
        cartId,
        productId,
        quantity,
        size: size || null,
        color: color || null,
      },
      include: { product: true },
    });
  }

  async updateQuantity(id: string, quantity: number) {
    return this.update({
      where: { id },
      data: { quantity },
      include: { product: true },
    });
  }

  async removeItem(id: string) {
    return this.delete({ where: { id } });
  }

  async getCartItemsByCartId(cartId: string) {
    return this.findMany({
      where: { cartId },
      include: { product: true },
    });
  }
}

export const cartService = new CartService();
export const cartItemService = new CartItemService();
