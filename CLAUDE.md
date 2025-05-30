# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
- **GraphQL**: Using `graphql-request` client with code generation
- **TypeScript**: Full type safety including generated GraphQL types
- **Tailwind CSS**: Utility-first styling
- **Biome**: Code formatting (replaces ESLint/Prettier)

### Project Structure
- `src/routes/`: File-based routes (e.g., `index.tsx` → `/`, `starwars.tsx` → `/starwars`)
- `src/graphql/`: Generated GraphQL types and utilities
- `src/queries/`: GraphQL query definitions
- `src/components/`: Shared React components
- `src/utils/`: Utility functions including custom GraphQL query client

### GraphQL Workflow
1. Define queries in `src/queries/` using `graphql()` tag
2. Run `yarn codegen` to generate types in `src/graphql/`
3. Use the custom `query` function from `src/graphql/query.ts` for type-safe requests
4. Schema source: https://swapi-graphql.netlify.app/graphql

### Key Patterns
- **Data Loading**: Use route loaders for server-side data fetching
- **Type Safety**: All GraphQL operations are fully typed
- **Path Aliases**: Use `~/` for imports from `src/`
- **SSR**: Server-side rendering enabled by default

### Configuration Files
- `app.config.ts`: TanStack Start and Vite configuration
- `codegen.ts`: GraphQL code generation configuration
- `biome.json`: Code formatting rules (2 spaces, double quotes)
- `tsconfig.json`: TypeScript configuration with path aliases