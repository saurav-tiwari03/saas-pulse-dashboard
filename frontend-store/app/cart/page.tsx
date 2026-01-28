"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useCart } from "@/lib/context";

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const [updating, setUpdating] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <p className="text-gray-500 mb-4">Please login to view your cart</p>
        <Link href="/login" className="text-blue-600 hover:text-blue-700">
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <Link
          href="/products"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    setUpdating(itemId);
    try {
      await updateQuantity(itemId, quantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    setUpdating(itemId);
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {item.product.images[0] ? (
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}
            </div>

            <div className="flex-1">
              <Link
                href={`/products/${item.product.id}`}
                className="font-medium hover:text-blue-600"
              >
                {item.product.name}
              </Link>
              {(item.size || item.color) && (
                <p className="text-sm text-gray-500 mt-1">
                  {item.size && `Size: ${item.size}`}
                  {item.size && item.color && " / "}
                  {item.color && `Color: ${item.color}`}
                </p>
              )}
              <p className="font-bold mt-2">${parseFloat(item.product.price).toFixed(2)}</p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1 || updating === item.id}
                  className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock || updating === item.id}
                  className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                disabled={updating === item.id}
                className="text-red-500 text-sm hover:text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex justify-between text-lg font-bold">
          <span>Subtotal</span>
          <span>${parseFloat(cart.subtotal).toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Shipping and taxes calculated at checkout
        </p>
        <button
          onClick={() => router.push("/checkout")}
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
