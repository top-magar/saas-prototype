// API response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
}

// API utilities
export async function safeApiCall<T>(
  apiCall: () => Promise<Response>,
  options?: { timeout?: number; retries?: number; }
): Promise<ApiResponse<T>> {
  const { timeout = 10000, retries = 1 } = options || {};

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await apiCall();
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return { data, success: true };
    } catch (error) {
      if (attempt === retries) {
        return {
          error: error instanceof Error ? error.message : 'Unknown error occurred',
          success: false
        };
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  return { error: 'Max retries exceeded', success: false };
}