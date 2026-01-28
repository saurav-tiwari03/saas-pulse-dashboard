// API Response Types
export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: {
    [key: string]: T[];
    pagination: Pagination;
  };
}

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

// Cart Types
export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  size: string | null;
  color: string | null;
  product: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: string;
  itemCount: number;
}

// Address Types
export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

// Order Types
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderItem {
  id: string;
  orderId: string;
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
  addressId: string;
  status: OrderStatus;
  subtotal: string;
  shippingCost: string;
  tax: string;
  total: string;
  paymentMethod: string | null;
  paymentStatus: PaymentStatus;
  notes: string | null;
  items: OrderItem[];
  address: Address;
  createdAt: string;
}
