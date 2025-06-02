import { createServerFn } from "@tanstack/react-start";
import type { TadaDocumentNode } from "gql.tada";
import { print, type ExecutionResult } from "graphql";

const graphqlServerFn = createServerFn()
  .validator((input: { query: string; variables?: unknown }) => input)
  .handler(async ({ data }) => {
    const GRAPHQL_API_URL = process.env.VITE_GRAPHQL_API_URL;

    if (!GRAPHQL_API_URL) {
      throw new Error("VITE_GRAPHQL_API_URL environment variable is not defined");
    }

    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/graphql-response+json"
      },
      body: JSON.stringify({
        query: data.query,
        variables: data.variables
      })
    });

    if (!response.ok) {
      throw new Error(`Network error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  });

export async function request<TResult, TVariables>(
  query: TadaDocumentNode<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): Promise<ExecutionResult<TResult>> {
  const queryString = print(query);

  return graphqlServerFn({
    data: { query: queryString, variables }
  }) as Promise<ExecutionResult<TResult>>;
}
