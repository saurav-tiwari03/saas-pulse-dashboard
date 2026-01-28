import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { responseHandler, errorHandler } from "../utils/responseHandler";
import categoryService from "../services/modelServices/category.services";

// Get all categories
export const getCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await categoryService.findActiveCategories();
    return responseHandler(categories, res);
  }
);

// Get single category
export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const category = await categoryService.findWithProducts(id);

  if (!category) {
    return errorHandler("E-1801", res);
  }

  return responseHandler(category, res);
});

// Create category (Admin only)
export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description, image } = req.body;

    // Check if category exists
    const existing = await categoryService.findByName(name);
    if (existing) {
      return errorHandler("E-1802", res);
    }

    const category = await categoryService.create({
      data: { name, description, image },
    });

    return responseHandler(category, res, 201);
  }
);

// Update category (Admin only)
export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { name, description, image, isActive } = req.body;

    const existing = await categoryService.findOne({ where: { id } });
    if (!existing) {
      return errorHandler("E-1801", res);
    }

    // Check if name is taken by another category
    if (name && name !== existing.name) {
      const nameExists = await categoryService.findByName(name);
      if (nameExists) {
        return errorHandler("E-1802", res);
      }
    }

    const category = await categoryService.update({
      where: { id },
      data: { name, description, image, isActive },
    });

    return responseHandler(category, res);
  }
);

// Delete category (Admin only)
export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const existing = await categoryService.findOne({ where: { id } });
    if (!existing) {
      return errorHandler("E-1801", res);
    }

    // Check if category has products
    const productCount = await categoryService.countProducts(id);
    if (productCount > 0) {
      return errorHandler("E-1803", res);
    }

    await categoryService.delete({ where: { id } });
    return responseHandler({ message: "Category deleted successfully" }, res);
  }
);
