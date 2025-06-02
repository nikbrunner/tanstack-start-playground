# TanStack Start GraphQL Learning Playground

This is my learning playground for exploring GraphQL with TanStack Start.

The repository documents a journey through different GraphQL setups, from minimal implementations to type-safe solutions with code generation.

## 🎯 Learning Objectives

- Understand GraphQL clients and their role with SSR
- Explore minimal type-safe GraphQL setups
- Learn how TanStack Server Functions integrate with GraphQL
- Compare different approaches (codegen vs gql.tada)
- Understand authentication and session handling
- Explore integration patterns with TanStack Router/Start/Query

## 🌳 Branch Structure

Each branch represents a different learning milestone:

### `main`

Base TanStack Start template - the starting point

### `01_minimal`

Minimal inline GraphQL with native fetch

- No type safety
- Direct fetch calls
- Basic proof of concept

### `02_codegen_vanilla`

Added graphql-request and basic codegen

- Introduced GraphQL Code Generator
- Basic type safety
- Using graphql-request client

### `03_tanstack_server_function`

Integrated TanStack Server Functions

- Server-side GraphQL execution
- Better SSR integration
- Wrapped query function in server function

### `04_improve_codegen_setup`

Fixed codegen types to use ExecutionResult pattern

- Proper error handling
- Correct type structure following GraphQL spec
- Environment variable configuration

### `05_improve_formatting`

Replaced Biome with Prettier and sort-imports plugin

- Better formatting consistency
- Import sorting
- More mature ecosystem

### `06_using_router_context`

Implemented router context for GraphQL queries

- Centralized GraphQL API through context
- Clean separation of concerns
- No direct imports needed in routes

### `07_tanstack_query` (current)

Added TanStack Query for client-side state management

- SSR with `queryClient.ensureQueryData`
- Client-side caching and refetching
- Clean query options API with namespace structure
- Inline GraphQL queries for better developer experience

## 📚 Documentation Links

- https://nearform.com/open-source/urql/docs/basics/typescript-integration/
- https://tanstack.com/start/latest/docs/framework/react/static-server-functions
- https://tanstack.com/query/latest/docs/framework/react/graphql
- https://tanstack.com/router/latest/docs/framework/react/guide/data-loading
- https://the-guild.dev/graphql/codegen/docs/guides/vanilla-typescript
- https://the-guild.dev/graphql/codegen/docs/guides/react-query
- https://the-guild.dev/graphql/codegen/docs/guides/react-vue
- https://github.com/0no-co/gql.tada

## 🚀 Getting Started

```bash
# Clone the repository
git clone <repo-url>
cd tanstack-start-playground

# Install dependencies
yarn install

# Copy environment variables
cp .env.example .env  # (or create .env with VITE_GRAPHQL_API_URL)

# Start development server
yarn dev
```

## 📝 Available Scripts

```bash
yarn dev               # Start development server (with concurrent codegen)
yarn build             # Build for production
yarn start             # Start production server
yarn format            # Format code with Prettier
yarn check:format      # Check formatting
yarn check:types       # Run TypeScript type checking
yarn gql:codegen       # Generate GraphQL types
yarn gql:codegen:watch # Watch mode for GraphQL codegen
```

## 💡 Key Learnings So Far

### Do I need a GraphQL client with SSR?

- **No**, you don't strictly need a GraphQL client library
- Native fetch works fine, especially with TanStack Server Functions
- Clients like urql/Apollo add caching and other features you might not need

### What's the minimal type-safe approach?

- GraphQL Code Generator with TypedDocumentString
- Define queries with `graphql()` tag function
- Generate types with `yarn codegen`
- Use a simple fetch wrapper that returns `ExecutionResult<T>`

### TanStack Server Functions + GraphQL?

- **Yes!** They work great together
- Server Functions ensure GraphQL queries run server-side
- Perfect for SSR - data is fetched before rendering
- No client-side GraphQL requests needed for initial page load

## 🏗️ Current Architecture

```typescript
// 1. Define query options with inline GraphQL
export const all = () =>
  queryOptions({
    queryKey: ["films", "all"],
    queryFn: async () => {
      const result = await request(
        graphql(`
          query AllFilms {
            # your GraphQL query
          }
        `)
      );
      if (result.errors) throw new Error(result.errors[0].message);
      return result.data?.allFilms?.films;
    }
  });

// 2. Use in route with TanStack Query
export const Route = createFileRoute("/")({
  loader: async ({ context: { queryClient, queries } }) => {
    // Ensure data is loaded on server
    await queryClient.ensureQueryData(queries.films.all());
  },
  component: () => {
    // Use suspense query for client-side
    const { data } = useSuspenseQuery(queries.films.all());
    return <div>{/* render data */}</div>;
  }
});
```

## 🔮 Next Steps to Explore

- [x] TanStack Query integration for client-side caching ✅
- [x] Comparison with gql.tada approach
- [ ] Authentication with GraphQL headers
- [ ] Mutations and optimistic updates
- [ ] Infinite queries for pagination

## 🤝 Contributing

This is a learning playground - feel free to explore and experiment!
