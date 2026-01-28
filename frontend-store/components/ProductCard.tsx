"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const price = parseFloat(product.price);
  const comparePrice = product.comparePrice ? parseFloat(product.comparePrice) : null;
  const discount = comparePrice ? Math.round((1 - price / comparePrice) * 100) : 0;

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-square bg-gray-100 relative">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{discount}%
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 truncate">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{product.category?.name}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-bold text-gray-900">${price.toFixed(2)}</span>
            {comparePrice && (
              <span className="text-sm text-gray-400 line-through">
                ${comparePrice.toFixed(2)}
              </span>
            )}
          </div>
          {product.stock < 5 && product.stock > 0 && (
            <p className="text-sm text-orange-500 mt-1">Only {product.stock} left</p>
          )}
          {product.stock === 0 && (
            <p className="text-sm text-red-500 mt-1">Out of stock</p>
          )}
        </div>
      </div>
    </Link>
  );
}
