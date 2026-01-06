/**
 * API Client Base Configuration
 * Handles common API request logic, error handling, and response parsing
 */

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type QueryParamValue = string | number | boolean | undefined;
type QueryParams = Record<string, QueryParamValue>;
type RequestOptions<TParams extends QueryParams | undefined = QueryParams> = {
  method?: RequestMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: TParams;
};

type ApiError = {
  message: string;
  code?: string;
  status?: number;
};

class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || "";
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(
    endpoint: string,
    params?: QueryParams
  ): string {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseUrl}${endpoint}`;

    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  /**
   * Make API request
   */
  private async request<
  TResponse,
  TParams extends QueryParams | undefined = QueryParams
>(
  endpoint: string,
  options: RequestOptions<TParams> = {}
): Promise<TResponse> {
  const { method = "GET", headers = {}, body, params } = options;

  const url = this.buildUrl(endpoint, params);

    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body && method !== "GET") {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: response.statusText || "An error occurred",
        }));

        const error: ApiError = {
          message: errorData.message || "An error occurred",
          code: errorData.code,
          status: response.status,
        };

        throw error;
      }

      // Handle empty responses
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return await response.json();
      }

      return null as unknown as TResponse;
    } catch (error) {
      if (error instanceof Error) {
        const apiError: ApiError = {
          message: error.message || "Network error occurred",
          code: "NETWORK_ERROR",
        };
        throw apiError;
      }
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<
    TResponse,
    TParams extends QueryParams | undefined = QueryParams
  >(
    endpoint: string,
    params?: TParams
  ): Promise<TResponse> {
    return this.request<TResponse, TParams>(endpoint, { method: "GET", params });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    params?: QueryParams
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body, params });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    params?: QueryParams
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body, params });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    params?: QueryParams
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "PATCH", body, params });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    params?: QueryParams
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", params });
  }
}

// Default API client instance
export const apiClient = new ApiClient();

// External API clients (Aladhan, etc.)
export const aladhanClient = new ApiClient(process.env.EXPO_PUBLIC_ALADHAN_URL);
export const alQuranClient = new ApiClient(process.env.EXPO_PUBLIC_AL_QURAN_URL);
export default apiClient;
