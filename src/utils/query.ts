import { GraphQLClient, type RequestDocument } from "graphql-request";

export async function query<T = unknown>(
  doc: RequestDocument,
  variables?: Record<string, unknown>,
): Promise<T> {
  const GRAPHQL_API_URL = import.meta.env.VITE_GRAPHQL_API_URL;

  if (!GRAPHQL_API_URL) {
    throw new Error("GraqphQL API URL is not defined");
  }

  const client = new GraphQLClient(GRAPHQL_API_URL);

  try {
    return await client.request<T>(doc, variables);
  } catch (error) {
    console.error("Error fetching data from GraphQL API:", error);
    throw error;
  }
}
