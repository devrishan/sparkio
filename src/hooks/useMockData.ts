/**
 * Hook to fetch mock data with simulated loading delay
 * Replace this with real API calls when connecting to backend
 */

import { useState, useEffect } from "react";

interface UseMockDataOptions {
  delay?: number; // Simulated loading delay in ms (default: 500-800ms random)
}

export function useMockData<T>(
  dataLoader: () => Promise<T>,
  options: UseMockDataOptions = {}
): {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate network delay (500-800ms)
      const delay = options.delay ?? Math.floor(Math.random() * 300) + 500;
      await new Promise((resolve) => setTimeout(resolve, delay));

      try {
        const result = await dataLoader();
        if (!cancelled) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to load data"));
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [dataLoader, options.delay]);

  return { data, isLoading, error };
}

/**
 * Helper to load JSON mock data files
 */
export async function loadMockJson<T>(path: string): Promise<T> {
  // Fetch from API routes that serve mock JSON files
  const response = await fetch(`/api/mocks/${path}`);
  if (!response.ok) {
    throw new Error(`Failed to load mock data: ${path}`);
  }
  return response.json();
}

/**
 * Alternative: Load from static JSON imports (faster, no network delay)
 * Use this for development when you want instant loading
 */
export function createMockDataLoader<T>(mockData: T, delay?: number) {
  return async (): Promise<T> => {
    if (delay) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    return mockData;
  };
}

