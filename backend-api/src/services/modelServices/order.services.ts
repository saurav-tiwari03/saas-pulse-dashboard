import Dal from "../databaseServices/dal";
import PrismaService from "../databaseServices/db";
import { OrderStatus, PaymentStatus } from "@prisma/client";

const prisma = PrismaService.getInstance();

class OrderService extends Dal<typeof prisma.order> {
  constructor() {
    super(prisma.order, "order");
  }

  async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `ORD-${year}${month}${day}-${random}`;
  }

  async findByOrderNumber(orderNumber: string) {
    return this.findFirst({
      where: { orderNumber },
      include: {
        items: { include: { product: true } },
        address: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findByUserId(userId: string, skip?: number, take?: number) {
    return this.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
        address: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  }

  async findWithDetails(id: string) {
    return this.findOne({
      where: { id },
      include: {
        items: { include: { product: true } },
        address: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });
  }

  async findAllOrders(options?: {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    search?: string;
    skip?: number;
    take?: number;
  }) {
    const where: any = {};

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.paymentStatus) {
      where.paymentStatus = options.paymentStatus;
    }

    if (options?.search) {
      where.OR = [
        { orderNumber: { contains: options.search, mode: "insensitive" } },
        { user: { name: { contains: options.search, mode: "insensitive" } } },
        { user: { email: { contains: options.search, mode: "insensitive" } } },
      ];
    }

    return this.findMany({
      where,
      include: {
        items: { include: { product: true } },
        address: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: options?.skip,
      take: options?.take,
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    return this.update({
      where: { id },
      data: { status },
      include: {
        items: { include: { product: true } },
        address: true,
      },
    });
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
    return this.update({
      where: { id },
      data: { paymentStatus },
    });
  }

  async countByStatus(status?: OrderStatus) {
    const where: any = {};
    if (status) {
      where.status = status;
    }
    return this.count({ where });
  }

  async getOrderStats() {
    const [total, pending, processing, shipped, delivered, cancelled] =
      await Promise.all([
        this.count(),
        this.count({ where: { status: "PENDING" } }),
        this.count({ where: { status: "PROCESSING" } }),
        this.count({ where: { status: "SHIPPED" } }),
        this.count({ where: { status: "DELIVERED" } }),
        this.count({ where: { status: "CANCELLED" } }),
      ]);

    return { total, pending, processing, shipped, delivered, cancelled };
  }
}

class OrderItemService extends Dal<typeof prisma.orderItem> {
  constructor() {
    super(prisma.orderItem, "orderItem");
  }
}

class AddressService extends Dal<typeof prisma.address> {
  constructor() {
    super(prisma.address, "address");
  }

  async findByUserId(userId: string) {
    return this.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  }

  async findDefaultAddress(userId: string) {
    return this.findFirst({
      where: { userId, isDefault: true },
    });
  }

  async setDefaultAddress(userId: string, addressId: string) {
    // Remove default from all addresses
    await this.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    // Set new default
    return this.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }
}

export const orderService = new OrderService();
export const orderItemService = new OrderItemService();
export const addressService = new AddressService();
