import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { API_BASE_URL } from "./config";
import {
  User,
  Wine,
  Producer,
  Checkin,
  Venue,
  ApiResponse,
  PaginatedResponse,
  WineFilters,
  ProducerFilters,
  CreateCheckinForm,
} from "./types";

/**
 * API Client for Cloudy Natural Wine Tracking App
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    // Request interceptor for adding auth token
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== "undefined") {
          const token = sessionStorage.getItem("token");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("token");
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth Methods
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.client.post("/auth/login", { email, password });
    return response.data;
  }

  async register(data: {
    username: string;
    email: string;
    password: string;
    fullName: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.client.post("/auth/register", data);
    return response.data;
  }

  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("token");
    }
  }

  // User Methods
  async getUser(username: string): Promise<ApiResponse<User>> {
    const response = await this.client.get(`/users/${username}`);
    return response.data;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await this.client.get("/users/me");
    return response.data;
  }

  async updateUser(data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.client.patch("/users/me", data);
    return response.data;
  }

  async getUserCheckins(username: string, page = 1, limit = 20): Promise<PaginatedResponse<Checkin>> {
    const response = await this.client.get(`/users/${username}/checkins`, {
      params: { page, limit },
    });
    return response.data;
  }

  // Wine Methods
  async getWines(filters?: WineFilters, page = 1, limit = 20): Promise<PaginatedResponse<Wine>> {
    const response = await this.client.get("/wines", {
      params: { ...filters, page, limit },
    });
    return response.data;
  }

  async getWine(slug: string): Promise<ApiResponse<Wine>> {
    const response = await this.client.get(`/wines/${slug}`);
    return response.data;
  }

  async createWine(data: Partial<Wine>): Promise<ApiResponse<Wine>> {
    const response = await this.client.post("/wines", data);
    return response.data;
  }

  async updateWine(slug: string, data: Partial<Wine>): Promise<ApiResponse<Wine>> {
    const response = await this.client.patch(`/wines/${slug}`, data);
    return response.data;
  }

  async getWineCheckins(slug: string, page = 1, limit = 20): Promise<PaginatedResponse<Checkin>> {
    const response = await this.client.get(`/wines/${slug}/checkins`, {
      params: { page, limit },
    });
    return response.data;
  }

  // Producer Methods
  async getProducers(
    filters?: ProducerFilters,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Producer>> {
    const response = await this.client.get("/producers", {
      params: { ...filters, page, limit },
    });
    return response.data;
  }

  async getProducer(slug: string): Promise<ApiResponse<Producer>> {
    const response = await this.client.get(`/producers/${slug}`);
    return response.data;
  }

  async createProducer(data: Partial<Producer>): Promise<ApiResponse<Producer>> {
    const response = await this.client.post("/producers", data);
    return response.data;
  }

  async updateProducer(slug: string, data: Partial<Producer>): Promise<ApiResponse<Producer>> {
    const response = await this.client.patch(`/producers/${slug}`, data);
    return response.data;
  }

  async claimProducer(slug: string): Promise<ApiResponse<Producer>> {
    const response = await this.client.post(`/producers/${slug}/claim`);
    return response.data;
  }

  async getProducerWines(slug: string, page = 1, limit = 20): Promise<PaginatedResponse<Wine>> {
    const response = await this.client.get(`/producers/${slug}/wines`, {
      params: { page, limit },
    });
    return response.data;
  }

  // Check-in Methods
  async getCheckins(page = 1, limit = 20): Promise<PaginatedResponse<Checkin>> {
    const response = await this.client.get("/checkins", {
      params: { page, limit },
    });
    return response.data;
  }

  async getCheckin(id: string): Promise<ApiResponse<Checkin>> {
    const response = await this.client.get(`/checkins/${id}`);
    return response.data;
  }

  async createCheckin(data: CreateCheckinForm): Promise<ApiResponse<Checkin>> {
    const formData = new FormData();

    // Add all fields to FormData
    formData.append("wineId", data.wineId);
    formData.append("rating", data.rating.toString());

    if (data.tastingNotes) formData.append("tastingNotes", data.tastingNotes);
    if (data.flavorProfile) formData.append("flavorProfile", JSON.stringify(data.flavorProfile));
    if (data.contextTags) formData.append("contextTags", JSON.stringify(data.contextTags));
    if (data.foodPairings) formData.append("foodPairings", data.foodPairings);
    if (data.venueId) formData.append("venueId", data.venueId);
    if (data.servingTemp) formData.append("servingTemp", data.servingTemp);
    if (data.pricePaid) formData.append("pricePaid", data.pricePaid.toString());
    if (data.wherePurchased) formData.append("wherePurchased", data.wherePurchased);
    if (data.photo) formData.append("photo", data.photo);

    const response = await this.client.post("/checkins", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async updateCheckin(id: string, data: Partial<Checkin>): Promise<ApiResponse<Checkin>> {
    const response = await this.client.patch(`/checkins/${id}`, data);
    return response.data;
  }

  async deleteCheckin(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`/checkins/${id}`);
    return response.data;
  }

  // Venue Methods
  async getVenues(
    search?: string,
    type?: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Venue>> {
    const response = await this.client.get("/venues", {
      params: { search, type, page, limit },
    });
    return response.data;
  }

  async getVenue(slug: string): Promise<ApiResponse<Venue>> {
    const response = await this.client.get(`/venues/${slug}`);
    return response.data;
  }

  async getNearbyVenues(
    latitude: number,
    longitude: number,
    radius = 10,
    limit = 20
  ): Promise<ApiResponse<Venue[]>> {
    const response = await this.client.get("/venues/nearby", {
      params: { latitude, longitude, radius, limit },
    });
    return response.data;
  }

  async createVenue(data: Partial<Venue>): Promise<ApiResponse<Venue>> {
    const response = await this.client.post("/venues", data);
    return response.data;
  }

  async updateVenue(slug: string, data: Partial<Venue>): Promise<ApiResponse<Venue>> {
    const response = await this.client.patch(`/venues/${slug}`, data);
    return response.data;
  }

  // Search Methods
  async searchAll(query: string, page = 1, limit = 20): Promise<ApiResponse<{
    wines: Wine[];
    producers: Producer[];
    venues: Venue[];
  }>> {
    const response = await this.client.get("/search", {
      params: { q: query, page, limit },
    });
    return response.data;
  }

  // Upload Methods
  async uploadImage(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await this.client.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
}

// Export singleton instance
export const api = new ApiClient();

// Export class for testing or custom instances
export default ApiClient;
