import type {
  AuthResponse,
  Category,
  Product,
  Order,
  User,
  Pagination,
  OrderStats,
  OrderStatus,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("admin_token", token);
    } else {
      localStorage.removeItem("admin_token");
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    this.token = localStorage.getItem("admin_token");
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

  // Users
  async getUsers(params?: {
    role?: string;
    isActive?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: { users: User[]; pagination: Pagination } }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request(`/auth/users${query ? `?${query}` : ""}`);
  }

  async updateUser(
    id: string,
    data: Partial<User>
  ): Promise<{ data: User }> {
    return this.request(`/auth/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.request(`/auth/users/${id}`, { method: "DELETE" });
  }

  // Categories
  async getCategories(): Promise<{ data: Category[] }> {
    return this.request("/categories");
  }

  async createCategory(data: {
    name: string;
    description?: string;
    image?: string;
  }): Promise<{ data: Category }> {
    return this.request("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCategory(
    id: string,
    data: Partial<Category>
  ): Promise<{ data: Category }> {
    return this.request(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<void> {
    await this.request(`/categories/${id}`, { method: "DELETE" });
  }

  // Products
  async getProducts(params?: {
    categoryId?: string;
    search?: string;
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
    return this.request(`/products/admin${query ? `?${query}` : ""}`);
  }

  async getProduct(id: string): Promise<{ data: Product }> {
    return this.request(`/products/${id}`);
  }

  async createProduct(data: {
    name: string;
    description?: string;
    price: number;
    comparePrice?: number;
    sku: string;
    stock?: number;
    images?: string[];
    sizes?: string[];
    colors?: string[];
    categoryId: string;
    isFeatured?: boolean;
  }): Promise<{ data: Product }> {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProduct(
    id: string,
    data: Partial<Product>
  ): Promise<{ data: Product }> {
    return this.request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string): Promise<void> {
    await this.request(`/products/${id}`, { method: "DELETE" });
  }

  // Orders
  async getOrders(params?: {
    status?: OrderStatus;
    search?: string;
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
    return this.request(`/orders/admin${query ? `?${query}` : ""}`);
  }

  async getOrder(id: string): Promise<{ data: Order }> {
    return this.request(`/orders/${id}`);
  }

  async updateOrderStatus(
    id: string,
    status: OrderStatus
  ): Promise<{ data: Order }> {
    return this.request(`/orders/admin/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async getOrderStats(): Promise<{ data: OrderStats }> {
    return this.request("/orders/admin/stats");
  }
}

export const api = new ApiClient();
