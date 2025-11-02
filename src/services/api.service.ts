/**
 * API Service
 * Centralized service for making HTTP requests to the backend API
 */

import config from '../config/app.config';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.apiBaseUrl;
  }

  /**
 * Build URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = `${this.baseUrl}${endpoint}`;
    
    if (!params) {
      return url;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });

  return `${url}?${searchParams.toString()}`;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP Error ${response.status}: ${response.statusText}`,
      }));
      throw new Error(error.message || 'An error occurred');
    }

  // Handle 204 No Content
    if (response.status === 204) {
    return {} as T;
 }

    return response.json();
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    let authHeader = {};
    const storedAuth = localStorage.getItem('basicAuthentication');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        if (authData.token) {
          authHeader = { Authorization: `Bearer ${authData.token}` };
        }
      } catch (error) {
        console.error('Failed to parse auth token', error);
      }
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...options?.headers,
      },
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    let authHeader = {};
    const storedAuth = localStorage.getItem('basicAuthentication');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        if (authData.token) {
          authHeader = { Authorization: `Bearer ${authData.token}` };
        }
      } catch (error) {
        console.error('Failed to parse auth token', error);
      }
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    let authHeader = {};
    const storedAuth = localStorage.getItem('basicAuthentication');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        if (authData.token) {
          authHeader = { Authorization: `Bearer ${authData.token}` };
        }
      } catch (error) {
        console.error('Failed to parse auth token', error);
      }
    }
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  const url = this.buildUrl(endpoint, options?.params);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
     ...options?.headers,
      },
      ...options,
  });

    return this.handleResponse<T>(response);
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
     ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;
