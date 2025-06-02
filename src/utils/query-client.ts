import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000 // 1 minute
      }
    }
  });
}

// Singleton for SSR
let queryClient: QueryClient | null = null;

export function getQueryClient() {
  if (!queryClient) {
    queryClient = createQueryClient();
  }
  return queryClient;
}
