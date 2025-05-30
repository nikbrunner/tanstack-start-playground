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

# Format code with Biome
yarn format

# Check formatting
yarn check:format

# Generate GraphQL types
yarn codegen

# Watch mode for GraphQL codegen
yarn codegen:watch
```

## High-Level Architecture

This is a TanStack Start application demonstrating modern full-stack React patterns with GraphQL integration.

### Core Technologies
- **TanStack Start**: Full-stack React framework with SSR capabilities
- **TanStack Router**: File-based routing with type safety
- **GraphQL**: Using codegen with TypedDocumentString approach
- **TypeScript**: Full type safety including generated GraphQL types
- **Tailwind CSS**: Utility-first styling
- **Biome**: Code formatting (replaces ESLint/Prettier)

### Project Structure
- `src/routes/`: File-based routes (e.g., `index.tsx` → `/`, `starwars.tsx` → `/starwars`)
- `src/graphql/`: Generated GraphQL types and utilities
- `src/queries/`: GraphQL query definitions
- `src/components/`: Shared React components
- `src/utils/`: Legacy utilities (being replaced by new patterns)

### GraphQL Workflow
1. Define queries in `src/queries/` using `graphql()` tag
2. Run `yarn codegen` to generate types in `src/graphql/`
3. Use the custom `query` function from `src/graphql/query.ts` for type-safe requests
4. Query function uses TanStack Server Functions for SSR execution
5. Returns `ExecutionResult<T>` for proper error handling
6. Schema source: Configured via `VITE_GRAPHQL_API_URL` env variable

### Branch Structure & Learning Progress
- **main**: Base TanStack Start template
- **01_minimal**: Inline GraphQL with fetch, no type safety
- **02_codegen_vanilla**: Added graphql-request and basic codegen
- **03_tanstack_server_function**: Integrated TanStack Server Functions
- **04_improve_codegen_setup**: Fixed codegen types to use ExecutionResult pattern

### Key Patterns
- **Data Loading**: Use route loaders for server-side data fetching
- **Type Safety**: All GraphQL operations are fully typed via codegen
- **Server Functions**: GraphQL executes server-side via TanStack Server Functions
- **Error Handling**: Proper GraphQL error handling with ExecutionResult type
- **Path Aliases**: Use `~/` for imports from `src/`
- **SSR**: Server-side rendering enabled by default

### Configuration Files
- `app.config.ts`: TanStack Start and Vite configuration
- `codegen.ts`: GraphQL code generation configuration (uses env variable)
- `biome.json`: Code formatting rules (2 spaces, double quotes)
- `tsconfig.json`: TypeScript configuration with path aliases
- `.env`: Contains `VITE_GRAPHQL_API_URL` for GraphQL endpoint
