# TanStack Start + Query + GraphQL Data Flow Guide

This guide explains how data flows through the application using TanStack Start, TanStack Query, and GraphQL with Server Functions.

## Table of Contents

- [Query Flow](#query-flow)
- [Mutation Flow](#mutation-flow)
- [Examples](#examples)
- [Key Concepts](#key-concepts)

## Query Flow

### SSR Initial Load Flow

```mermaid
sequenceDiagram
    participant Browser
    participant TanStack Router
    participant Route Loader
    participant QueryClient
    participant Server Function
    participant GraphQL API

    Browser->>TanStack Router: Navigate to /films
    TanStack Router->>Route Loader: Execute loader (server-side)
    Route Loader->>QueryClient: ensureQueryData(queries.films.all())
    QueryClient->>QueryClient: Check cache (empty)
    QueryClient->>Server Function: Execute queryFn
    Server Function->>GraphQL API: POST GraphQL Query
    GraphQL API-->>Server Function: Return films data
    Server Function-->>QueryClient: Cache data + return
    QueryClient-->>Route Loader: Return data
    Route Loader-->>TanStack Router: Loader complete
    TanStack Router->>Browser: Render HTML with data

    Note over Browser: Page displays instantly (SSR)

    Browser->>Browser: React Hydration
    Browser->>Route Loader: Execute loader (client-side)
    Route Loader->>QueryClient: ensureQueryData(queries.films.all())
    QueryClient->>QueryClient: Check cache (data exists!)
    QueryClient-->>Route Loader: Return cached data

    Browser->>Browser: Component mounts
    Browser->>QueryClient: useSuspenseQuery(queries.films.all())
    QueryClient-->>Browser: Return cached data (no fetch!)

    Note over Browser: Background refresh may occur based on staleTime
```

### Client-Side Navigation Flow

```mermaid
sequenceDiagram
    participant User
    participant LinkComponent as "Link Component"
    participant TanStackRouter as "TanStack Router"
    participant RouteLoader as "Route Loader"
    participant QueryClient
    participant ServerFunction as "Server Function"
    participant GraphQLAPI as "GraphQL API"

    User->>LinkComponent: Hover over film link
    LinkComponent->>TanStackRouter: Prefetch route (preload="intent")
    TanStackRouter->>RouteLoader: Execute loader
    RouteLoader->>QueryClient: ensureQueryData(queries.films.byId(id))
    QueryClient->>QueryClient: Check cache (empty for this ID)
    QueryClient->>ServerFunction: Execute queryFn (RPC call)

    Note over ServerFunction: Executes on server via /_server endpoint

    ServerFunction->>GraphQLAPI: POST GraphQL Query
    GraphQLAPI-->>ServerFunction: Return film data
    ServerFunction-->>QueryClient: Return data
    QueryClient->>QueryClient: Cache data
    QueryClient-->>RouteLoader: Return data

    User->>LinkComponent: Click link
    LinkComponent->>TanStackRouter: Navigate
    TanStackRouter->>Browser: Instant render (data already cached!)
```

## Mutation Flow

### Basic Mutation Flow

```mermaid
sequenceDiagram
    participant User
    participant Component
    participant useMutation
    participant Server Function
    participant GraphQL API
    participant QueryClient

    User->>Component: Click "Add Favorite"
    Component->>useMutation: mutate({ filmId })
    useMutation->>useMutation: Set loading state
    useMutation->>Server Function: Execute mutation (RPC)
    Server Function->>GraphQL API: POST GraphQL Mutation
    GraphQL API-->>Server Function: Return success/data
    Server Function-->>useMutation: Return result

    alt Success
        useMutation->>QueryClient: Invalidate queries
        QueryClient->>QueryClient: Mark affected queries as stale
        useMutation->>Component: onSuccess callback
        Component->>Component: Update UI

        Note over QueryClient: Background refetch triggered
        QueryClient->>Server Function: Refetch stale queries
        Server Function->>GraphQL API: Fetch fresh data
        GraphQL API-->>Server Function: Return data
        Server Function-->>QueryClient: Update cache
        QueryClient-->>Component: Trigger re-render
    else Error
        useMutation->>Component: onError callback
        Component->>Component: Show error state
    end
```

### Optimistic Update Flow

```mermaid
sequenceDiagram
    participant User
    participant Component
    participant useMutation
    participant QueryClient
    participant Server Function
    participant GraphQL API

    User->>Component: Click "Toggle Favorite"
    Component->>useMutation: mutate({ filmId })

    Note over useMutation: onMutate callback
    useMutation->>QueryClient: getQueryData(["films", filmId])
    QueryClient-->>useMutation: Current data
    useMutation->>useMutation: Save snapshot
    useMutation->>QueryClient: setQueryData (optimistic)
    QueryClient-->>Component: Instant UI update!

    useMutation->>Server Function: Execute mutation
    Server Function->>GraphQL API: POST GraphQL Mutation

    alt Success
        GraphQL API-->>Server Function: Success
        Server Function-->>useMutation: Return result
        useMutation->>QueryClient: Invalidate queries
        Note over Component: UI already updated!
    else Error
        GraphQL API-->>Server Function: Error
        Server Function-->>useMutation: Return error
        useMutation->>QueryClient: setQueryData (rollback)
        QueryClient-->>Component: Revert UI
        useMutation->>Component: onError callback
    end
```

## Examples

### Query Example: Fetching Films

```typescript
// src/queries/films.ts
import { queryOptions } from "@tanstack/react-query";
import { graphql } from "~/graphql/";
import { request } from "~/graphql/request";

export const all = () =>
  queryOptions({
    queryKey: ["films", "all"],
    staleTime: 60 * 1000, // Consider fresh for 60 seconds
    queryFn: async () => {
      const query = graphql(`
        query AllFilms {
          allFilms {
            films {
              id
              title
              director
              releaseDate
            }
          }
        }
      `);

      const result = await request(query);

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data?.allFilms?.films;
    }
  });

// src/routes/index.tsx
export const Route = createFileRoute("/")({
  loader: async ({ context: { queryClient, queries } }) => {
    // Ensure data is in cache for SSR
    await queryClient.ensureQueryData(queries.films.all());
  },
  component: () => {
    const { queries } = Route.useRouteContext();
    // Subscribe to query updates
    const { data: films } = useSuspenseQuery(queries.films.all());

    return <FilmList films={films} />;
  }
});
```

### Mutation Example: Adding to Favorites

```typescript
// src/queries/films.ts
export const addToFavorites = () =>
  mutationOptions({
    mutationFn: async (filmId: string) => {
      const mutation = graphql(`
        mutation AddToFavorites($filmId: ID!) {
          addToFavorites(filmId: $filmId) {
            id
            isFavorite
          }
        }
      `);

      const result = await request(mutation, { filmId });

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data?.addToFavorites;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch any queries that could be affected
      queryClient.invalidateQueries({ queryKey: ["films"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    }
  });

// src/components/FavoriteButton.tsx
function FavoriteButton({ filmId }: { filmId: string }) {
  const { queries } = Route.useRouteContext();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...queries.films.addToFavorites(),
    // Optimistic update
    onMutate: async (filmId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["films", filmId] });

      // Snapshot previous value
      const previousFilm = queryClient.getQueryData(["films", filmId]);

      // Optimistically update
      queryClient.setQueryData(["films", filmId], old => ({
        ...old,
        isFavorite: true
      }));

      // Return context with snapshot
      return { previousFilm };
    },
    onError: (err, filmId, context) => {
      // Rollback on error
      if (context?.previousFilm) {
        queryClient.setQueryData(["films", filmId], context.previousFilm);
      }
    }
  });

  return (
    <button
      onClick={() => mutation.mutate(filmId)}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Saving..." : "Add to Favorites"}
    </button>
  );
}
```

### Mutation Example: Updating Film Details

```typescript
// src/queries/films.ts
export const updateFilm = () =>
  mutationOptions({
    mutationFn: async ({ id, ...updates }: UpdateFilmInput) => {
      const mutation = graphql(`
        mutation UpdateFilm($id: ID!, $input: UpdateFilmInput!) {
          updateFilm(id: $id, input: $input) {
            id
            title
            director
            releaseDate
          }
        }
      `);

      const result = await request(mutation, { id, input: updates });

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data?.updateFilm;
    }
  });

// src/components/EditFilmForm.tsx
function EditFilmForm({ film }: { film: Film }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { queries } = Route.useRouteContext();

  const mutation = useMutation({
    ...queries.films.updateFilm(),
    onSuccess: (updatedFilm) => {
      // Update the specific film in cache
      queryClient.setQueryData(
        ["films", updatedFilm.id],
        updatedFilm
      );

      // Also update it in the list
      queryClient.setQueryData(["films", "all"], (old) =>
        old?.map(f => f.id === updatedFilm.id ? updatedFilm : f)
      );

      // Navigate back
      router.navigate({ to: "/films/$id", params: { id: film.id } });
    }
  });

  const handleSubmit = (formData: FormData) => {
    mutation.mutate({
      id: film.id,
      title: formData.get("title"),
      director: formData.get("director"),
      releaseDate: formData.get("releaseDate")
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : "Save Changes"}
      </button>
      {mutation.isError && (
        <div>Error: {mutation.error.message}</div>
      )}
    </form>
  );
}
```

## Key Concepts

### 1. Server Functions

- All GraphQL requests go through TanStack Server Functions
- Execute on the server, even when called from client
- Provide automatic RPC endpoints (/\_server/...)
- Keep GraphQL endpoint secure and hidden from client

### 2. Query Lifecycle

- **SSR**: Loader fetches data server-side
- **Hydration**: Client reuses server data
- **Background Refresh**: Based on staleTime
- **Prefetching**: Via router preload prop

### 3. Cache Management

- QueryClient holds all cached data
- Queries are identified by unique keys
- `ensureQueryData`: Fetch only if not cached
- `invalidateQueries`: Mark as stale for refetch

### 4. Mutation Patterns

- **Basic**: Simple fire-and-forget
- **With Invalidation**: Refetch affected queries
- **Optimistic**: Update UI before server response
- **With Rollback**: Revert on error

### 5. Error Handling

- Queries: Error boundaries + error components
- Mutations: onError callbacks + error states
- GraphQL errors: Check result.errors array
- Network errors: Try/catch in queryFn

### 6. Performance Tips

- Set appropriate `staleTime` to reduce refetches
- Use `prefetch` on links for instant navigation
- Leverage optimistic updates for snappy UI
- Use `select` to transform/filter data
- Configure `gcTime` to control cache retention
