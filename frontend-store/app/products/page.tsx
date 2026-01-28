"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import type { Product, Category, Pagination } from "@/lib/types";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  const categoryId = searchParams.get("categoryId") || "";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.getProducts({ categoryId, search, page, limit: 12 }),
          api.getCategories(),
        ]);
        setProducts(productsRes.data.products);
        setPagination(productsRes.data.pagination);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [categoryId, search, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/products"
                  className={`block py-1 ${!categoryId ? "text-blue-600 font-medium" : "text-gray-600"}`}
                >
                  All Products
                </a>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`/products?categoryId=${cat.id}`}
                    className={`block py-1 ${categoryId === cat.id ? "text-blue-600 font-medium" : "text-gray-600"}`}
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              {categoryId
                ? categories.find((c) => c.id === categoryId)?.name || "Products"
                : "All Products"}
            </h1>
            {pagination && (
              <span className="text-gray-500">
                {pagination.total} products
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <a
                      key={p}
                      href={`/products?${new URLSearchParams({
                        ...(categoryId && { categoryId }),
                        ...(search && { search }),
                        page: String(p),
                      })}`}
                      className={`px-4 py-2 rounded ${
                        p === pagination.page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
