"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/context";
import type { Order } from "@/lib/types";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function OrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadOrder() {
      try {
        const { data } = await api.getOrder(id as string);
        setOrder(data);
      } catch (error) {
        console.error("Failed to load order:", error);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id, user, router]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setCancelling(true);
    try {
      const { data } = await api.cancelOrder(order!.id);
      setOrder(data);
      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error("Failed to cancel order:", error);
      toast.error("Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/orders" className="text-blue-600 hover:text-blue-700 text-sm">
            ← Back to Orders
          </Link>
          <h1 className="text-2xl font-bold mt-2">{order.orderNumber}</h1>
        </div>
        <span className={`px-3 py-1 rounded-lg ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Order Items */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h2 className="font-medium mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {item.product.images[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  {(item.size || item.color) && (
                    <p className="text-sm text-gray-500">
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && " / "}
                      {item.color && `Color: ${item.color}`}
                    </p>
                  )}
                  <p className="text-sm">
                    ${parseFloat(item.price).toFixed(2)} x {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h2 className="font-medium mb-4">Shipping Address</h2>
            <p className="font-medium">{order.address.name}</p>
            <p className="text-gray-600">{order.address.phone}</p>
            <p className="text-gray-600">
              {order.address.street}, {order.address.city}, {order.address.state}{" "}
              {order.address.zipCode}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h2 className="font-medium mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${parseFloat(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {parseFloat(order.shippingCost) === 0
                    ? "Free"
                    : `$${parseFloat(order.shippingCost).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${parseFloat(order.tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>${parseFloat(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {(order.status === "PENDING" || order.status === "CONFIRMED") && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 disabled:opacity-50"
            >
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
