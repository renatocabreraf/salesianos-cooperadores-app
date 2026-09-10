import Constants from "expo-constants";

const API_URL =
  Constants.expoConfig?.extra?.apiUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  "http://localhost:3000";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Documents
  async getDocuments(params?: {
    category?: string;
    type?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.type) searchParams.set("type", params.type);
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize));

    const query = searchParams.toString();
    return this.request(`/api/documents${query ? `?${query}` : ""}`);
  }

  async getDocument(slug: string) {
    return this.request(`/api/documents/${slug}`);
  }

  // Categories
  async getCategories() {
    return this.request("/api/categories");
  }

  // PVA
  async getPvaSections() {
    return this.request("/api/pva");
  }

  async getPvaSection(slug: string) {
    return this.request(`/api/pva/${slug}`);
  }

  // Bible
  async getBibleBooks() {
    return this.request("/api/bible");
  }

  async getBibleBook(id: string) {
    return this.request(`/api/bible/${id}`);
  }

  async getBibleChapter(id: string) {
    return this.request(`/api/bible/chapter/${id}`);
  }

  async searchBible(query: string) {
    return this.request(`/api/bible/search?q=${encodeURIComponent(query)}`);
  }

  // Search
  async search(query: string) {
    return this.request(`/api/search?q=${encodeURIComponent(query)}`);
  }

  // Favorites
  async getFavorites(deviceId: string) {
    return this.request(`/api/favorites/${deviceId}`);
  }

  async addFavorite(deviceId: string, itemType: string, itemId: string) {
    return this.request("/api/favorites", {
      method: "POST",
      body: JSON.stringify({ deviceId, itemType, itemId }),
    });
  }

  async removeFavorite(id: string) {
    return this.request(`/api/favorites/${id}`, { method: "DELETE" });
  }

  // News
  async getNews() {
    return this.request("/api/news");
  }

  // Device
  async registerDevice(deviceId: string, province?: string, center?: string) {
    return this.request("/api/devices", {
      method: "POST",
      body: JSON.stringify({ deviceId, province, center }),
    });
  }
}

export const api = new ApiClient(API_URL);
export default api;
