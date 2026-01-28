import type {
  AuthResponse,
  Cart,
  Category,
  Product,
  Address,
  Order,
  User,
  Pagination,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Request failed");
    }

    return response.json();
  }

  // Auth
  async register(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<{ data: AuthResponse }> {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string): Promise<{ data: AuthResponse }> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<void> {
    await this.request("/auth/logout", { method: "POST" });
    this.setToken(null);
  }

  async getMe(): Promise<{ data: User }> {
    return this.request("/auth/me");
  }

  async updateProfile(data: {
    name?: string;
    phone?: string;
  }): Promise<{ data: User }> {
    return this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Categories
  async getCategories(): Promise<{ data: Category[] }> {
    return this.request("/categories");
  }

  async getCategory(id: string): Promise<{ data: Category & { products: Product[] } }> {
    return this.request(`/categories/${id}`);
  }

  // Products
  async getProducts(params?: {
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sizes?: string;
    colors?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: { products: Product[]; pagination: Pagination } }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request(`/products${query ? `?${query}` : ""}`);
  }

  async getFeaturedProducts(limit?: number): Promise<{ data: Product[] }> {
    return this.request(`/products/featured${limit ? `?limit=${limit}` : ""}`);
  }

  async getProduct(id: string): Promise<{ data: Product }> {
    return this.request(`/products/${id}`);
  }

  // Cart
  async getCart(): Promise<{ data: Cart }> {
    return this.request("/cart");
  }

  async addToCart(data: {
    productId: string;
    quantity?: number;
    size?: string;
    color?: string;
  }): Promise<{ data: Cart }> {
    return this.request("/cart", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCartItem(
    itemId: string,
    quantity: number
  ): Promise<{ data: Cart }> {
    return this.request(`/cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId: string): Promise<{ data: Cart }> {
    return this.request(`/cart/items/${itemId}`, {
      method: "DELETE",
    });
  }

  async clearCart(): Promise<void> {
    await this.request("/cart/clear", { method: "DELETE" });
  }

  // Addresses
  async getAddresses(): Promise<{ data: Address[] }> {
    return this.request("/orders/addresses");
  }

  async createAddress(data: Omit<Address, "id" | "userId">): Promise<{ data: Address }> {
    return this.request("/orders/addresses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateAddress(
    id: string,
    data: Partial<Address>
  ): Promise<{ data: Address }> {
    return this.request(`/orders/addresses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteAddress(id: string): Promise<void> {
    await this.request(`/orders/addresses/${id}`, { method: "DELETE" });
  }

  // Orders
  async getOrders(params?: {
    page?: number;
    limit?: number;
  }): Promise<{ data: { orders: Order[]; pagination: Pagination } }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request(`/orders${query ? `?${query}` : ""}`);
  }

  async getOrder(id: string): Promise<{ data: Order }> {
    return this.request(`/orders/${id}`);
  }

  async createOrder(data: {
    addressId: string;
    paymentMethod?: string;
    notes?: string;
  }): Promise<{ data: Order }> {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async cancelOrder(id: string): Promise<{ data: Order }> {
    return this.request(`/orders/${id}/cancel`, { method: "POST" });
  }
}

export const api = new ApiClient();
