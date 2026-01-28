import Dal from "../databaseServices/dal";
import PrismaService from "../databaseServices/db";

const prisma = PrismaService.getInstance();

class CategoryService extends Dal<typeof prisma.category> {
  constructor() {
    super(prisma.category, "category");
  }

  async findByName(name: string) {
    return this.findFirst({ where: { name } });
  }

  async findActiveCategories() {
    return this.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }

  async findWithProducts(id: string) {
    return this.findOne({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async countProducts(id: string) {
    return prisma.product.count({
      where: { categoryId: id },
    });
  }
}

export default new CategoryService();
