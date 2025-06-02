# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This is Nik's learning playground for exploring GraphQL with TanStack Start.

The repository serves as an educational project to understand different GraphQL setups, SSR, and how various tools work together.

### Original Learning Goals

- Understand GraphQL clients and whether they're needed with SSR
- Explore minimal type-safe GraphQL setups
- Learn how TanStack Server Functions work with GraphQL
- Compare different approaches (codegen vs gql.tada)
- Understand authentication and session handling in GraphQL
- Explore integration patterns with TanStack Router/Start/Query

### Original Key Questions Being Explored

1. When using SSR, do I need a GraphQL client?
2. What is the most minimal approach to using type-safe GraphQL?
3. How to handle authentication and session headers?
4. What are .graphql files and when to use them?
5. Can TanStack Server Functions be used with GraphQL?
6. How to expose fetch functions to Router Context?

## Common Development Commands

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Format code with Prettier
yarn format

# Check formatting
yarn check:format

# Check TypeScript types and GraphQL queries
yarn check:types

# GraphQL-specific commands
yarn gql:doctor      # Check gql.tada setup
yarn gql:check       # Validate GraphQL queries
yarn gql:generate    # Update schema introspection
yarn gql:schema      # Download latest schema
yarn gql:turbo       # Optimize for large codebases
```

## High-Level Architecture

This is a TanStack Start application demonstrating modern full-stack React patterns with GraphQL integration.

### Core Technologies

- **TanStack Start**: Full-stack React framework with SSR capabilities
- **TanStack Router**: File-based routing with type safety
- **TanStack Query**: Client-side state management with caching
- **gql.tada**: Instant GraphQL type inference without build step
- **TypeScript**: Full type safety with real-time GraphQL type checking
- **Tailwind CSS**: Utility-first styling
- **Prettier**: Code formatting with import sorting
- **Yarn Berry**: Modern package manager (v4.9.1)

### Project Structure

- `src/routes/`: File-based routes (e.g., `index.tsx` → `/`, `film.$id.tsx` → `/film/:id`)
- `src/graphql/`: gql.tada setup and generated introspection types
  - `index.ts`: Main graphql instance with type configuration
  - `graphql-env.d.ts`: Auto-generated schema introspection
  - `request.ts`: GraphQL request function using server functions
- `src/queries/`: GraphQL query definitions with inline queries
- `src/components/`: Shared React components
- `src/utils/`: Utilities (query client, logging middleware, etc.)

### GraphQL Workflow with gql.tada

1. Write queries using `graphql()` from gql.tada - get instant type inference
2. Types are inferred automatically as you type (no build step needed)
3. Query options are exposed through router context as `queries.*`
4. Routes use `queryClient.ensureQueryData` for SSR
5. Components use `useSuspenseQuery` for client-side data
6. All GraphQL requests use TanStack Server Functions
7. Run `yarn gql:generate` occasionally to update schema introspection

### Branch Structure & Learning Progress

- **main**: Base TanStack Start template
- **01_minimal**: Inline GraphQL with fetch, no type safety
- **02_codegen_vanilla**: Added graphql-request and basic codegen
- **03_tanstack_server_function**: Integrated TanStack Server Functions
- **04_improve_codegen_setup**: Fixed codegen types to use ExecutionResult pattern
- **05_improve_formatting**: Switched from Biome to Prettier with import sorting
- **06_using_router_context**: Centralized GraphQL through router context
- **07_tanstack_query**: Added TanStack Query for SSR + client-side caching
- **08_gql_tada**: Migrated to gql.tada for instant type inference, upgraded to Yarn Berry

### Key Patterns

- **Data Loading**: Route loaders with `queryClient.ensureQueryData` for SSR
- **Client State**: `useSuspenseQuery` for client-side data with caching
- **Type Safety**: Instant GraphQL type inference via gql.tada (no build step)
- **Query Organization**: Query options with inline GraphQL in domain files
- **Context API**: Queries exposed through router context as `queries.*`
- **Server Functions**: GraphQL executes server-side via TanStack Server Functions
- **Error Handling**: Proper GraphQL error handling in query functions
- **Path Aliases**: Use `~/` for imports from `src/`
- **SSR + Hydration**: Server renders with data, client hydrates with cache
- **Real-time Types**: TypeScript plugin provides immediate feedback on GraphQL queries

### Configuration Files

- `app.config.ts`: TanStack Start and Vite configuration
- `.prettierrc`: Code formatting rules with import sorting
- `tsconfig.json`: TypeScript configuration with gql.tada plugin
- `.env`: Contains `VITE_GRAPHQL_API_URL` for GraphQL endpoint
- `.yarnrc.yml`: Yarn Berry configuration
- `.vscode/settings.json`: VSCode TypeScript workspace settings
