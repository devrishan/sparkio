/**
 * Mock Data Utilities
 * Helper functions for working with mock data
 */

import { isMockModeEnabled } from './mock-service';

/**
 * Conditional data fetcher - uses mock data if mock mode is enabled
 */
export async function fetchWithMockFallback<T>(
  realFetch: () => Promise<T>,
  mockFetch: () => Promise<T>
): Promise<T> {
  if (isMockModeEnabled()) {
    console.log('[Mock Mode] Using mock data');
    return mockFetch();
  }
  
  try {
    return await realFetch();
  } catch (error) {
    console.warn('[Mock Mode] Real fetch failed, falling back to mock data', error);
    return mockFetch();
  }
}

/**
 * Delay function to simulate network latency in mock mode
 */
export function mockDelay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Simulate API response with delay
 */
export async function mockApiResponse<T>(data: T, delay: number = 500): Promise<T> {
  if (isMockModeEnabled()) {
    await mockDelay(delay);
    return data;
  }
  return data;
}

/**
 * Create a mock API error response
 */
export function createMockError(message: string, status: number = 400) {
  return {
    success: false,
    error: message,
    status,
  };
}

/**
 * Create a mock API success response
 */
export function createMockSuccess<T>(data: T) {
  return {
    success: true,
    data,
  };
}

