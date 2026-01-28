import Dal from "../databaseServices/dal";
import PrismaService from "../databaseServices/db";

const prisma = PrismaService.getInstance();

class ProductService extends Dal<typeof prisma.product> {
  constructor() {
    super(prisma.product, "product");
  }

  async findBySku(sku: string) {
    return this.findFirst({ where: { sku } });
  }

  async findActiveProducts(options?: {
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sizes?: string[];
    colors?: string[];
    skip?: number;
    take?: number;
  }) {
    const where: any = { isActive: true };

    if (options?.categoryId) {
      where.categoryId = options.categoryId;
    }

    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: "insensitive" } },
        { description: { contains: options.search, mode: "insensitive" } },
      ];
    }

    if (options?.minPrice !== undefined || options?.maxPrice !== undefined) {
      where.price = {};
      if (options?.minPrice !== undefined) {
        where.price.gte = options.minPrice;
      }
      if (options?.maxPrice !== undefined) {
        where.price.lte = options.maxPrice;
      }
    }

    if (options?.sizes && options.sizes.length > 0) {
      where.sizes = { hasSome: options.sizes };
    }

    if (options?.colors && options.colors.length > 0) {
      where.colors = { hasSome: options.colors };
    }

    return this.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: options?.skip,
      take: options?.take,
    });
  }

  async findFeaturedProducts(limit: number = 8) {
    return this.findMany({
      where: { isActive: true, isFeatured: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async findWithCategory(id: string) {
    return this.findOne({
      where: { id },
      include: { category: true },
    });
  }

  async countActiveProducts(categoryId?: string) {
    const where: any = { isActive: true };
    if (categoryId) {
      where.categoryId = categoryId;
    }
    return this.count({ where });
  }

  async updateStock(id: string, quantity: number) {
    return this.update({
      where: { id },
      data: { stock: { increment: quantity } },
    });
  }
}

export default new ProductService();
