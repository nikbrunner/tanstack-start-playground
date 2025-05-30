import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema:
    process.env.VITE_GRAPHQL_API_URL || "https://swapi-graphql.netlify.app/graphql",
  documents: ["src/**/*.ts"],
  ignoreNoDocuments: true,
  generates: {
    "./src/graphql/": {
      preset: "client",
      config: {
        documentMode: "string"
      }
    }
  },
  hooks: {
    afterAllFileWrite: "prettier --write src/graphql/*"
  }
};

export default config;
