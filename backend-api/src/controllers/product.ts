import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { responseHandler, errorHandler } from "../utils/responseHandler";
import productService from "../services/modelServices/product.services";

// Get all products with filters
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const {
    categoryId,
    search,
    minPrice,
    maxPrice,
    sizes,
    colors,
    page = "1",
    limit = "12",
  } = req.query;

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const take = parseInt(limit as string);

  const products = await productService.findActiveProducts({
    categoryId: categoryId as string,
    search: search as string,
    minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
    sizes: sizes ? (sizes as string).split(",") : undefined,
    colors: colors ? (colors as string).split(",") : undefined,
    skip,
    take,
  });

  const total = await productService.countActiveProducts(
    categoryId as string | undefined
  );

  return responseHandler(
    {
      products,
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

// Get featured products
export const getFeaturedProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit = "8" } = req.query;
    const products = await productService.findFeaturedProducts(
      parseInt(limit as string)
    );
    return responseHandler(products, res);
  }
);

// Get single product
export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const product = await productService.findWithCategory(id);

  if (!product) {
    return errorHandler("E-1701", res);
  }

  return responseHandler(product, res);
});

// Create product (Admin only)
export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      description,
      price,
      comparePrice,
      sku,
      stock,
      images,
      sizes,
      colors,
      categoryId,
      isFeatured,
    } = req.body;

    // Check if SKU exists
    const existing = await productService.findBySku(sku);
    if (existing) {
      return errorHandler("E-1702", res);
    }

    const product = await productService.create({
      data: {
        name,
        description,
        price,
        comparePrice,
        sku,
        stock: stock || 0,
        images: images || [],
        sizes: sizes || [],
        colors: colors || [],
        categoryId,
        isFeatured: isFeatured || false,
      },
      include: { category: true },
    });

    return responseHandler(product, res, 201);
  }
);

// Update product (Admin only)
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const {
      name,
      description,
      price,
      comparePrice,
      sku,
      stock,
      images,
      sizes,
      colors,
      categoryId,
      isActive,
      isFeatured,
    } = req.body;

    const existing = await productService.findOne({ where: { id } });
    if (!existing) {
      return errorHandler("E-1701", res);
    }

    // Check if SKU is taken by another product
    if (sku && sku !== existing.sku) {
      const skuExists = await productService.findBySku(sku);
      if (skuExists) {
        return errorHandler("E-1702", res);
      }
    }

    const product = await productService.update({
      where: { id },
      data: {
        name,
        description,
        price,
        comparePrice,
        sku,
        stock,
        images,
        sizes,
        colors,
        categoryId,
        isActive,
        isFeatured,
      },
      include: { category: true },
    });

    return responseHandler(product, res);
  }
);

// Delete product (Admin only)
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const existing = await productService.findOne({ where: { id } });
    if (!existing) {
      return errorHandler("E-1701", res);
    }

    await productService.delete({ where: { id } });
    return responseHandler({ message: "Product deleted successfully" }, res);
  }
);

// Get all products for admin (including inactive)
export const getAdminProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const { page = "1", limit = "20", search, categoryId } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { sku: { contains: search as string, mode: "insensitive" } },
      ];
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const products = await productService.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });

    const total = await productService.count({ where });

    return responseHandler(
      {
        products,
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
