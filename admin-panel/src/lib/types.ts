// API Response Types
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  phone?: string | null;
  role: "USER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  createdAt: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  comparePrice: string | null;
  sku: string;
  stock: number;
  images: string[];
  sizes: string[];
  colors: string[];
  categoryId: string;
  category?: Category;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

// Address Types
export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Order Types
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: string;
  size: string | null;
  color: string | null;
  product: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: { id: string; name: string | null; email: string };
  status: OrderStatus;
  subtotal: string;
  shippingCost: string;
  tax: string;
  total: string;
  paymentMethod: string | null;
  paymentStatus: string;
  items: OrderItem[];
  address: Address;
  createdAt: string;
}

// Stats Types
export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}
