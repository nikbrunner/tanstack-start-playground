import { createServerFn } from "@tanstack/react-start";
import { GraphQLClient, type RequestDocument } from "graphql-request";
import { print } from "graphql"; // You'd need to install this

/**
 * A server function that can be used to fetch data from the GraphQL API. */
export const graphqlQuery = createServerFn()
  .validator(
    (input: {
      docString: string;
      variables?: Record<string, unknown>;
    }) => input,
  )
  .handler(async ({ data }) => {
    const GRAPHQL_API_URL = process.env.VITE_GRAPHQL_API_URL;

    if (!GRAPHQL_API_URL) {
      throw new Error("GraphQL API URL is not defined");
    }

    const client = new GraphQLClient(GRAPHQL_API_URL);

    try {
      return await client.request(data.docString, data.variables);
    } catch (error) {
      console.error("Error fetching data from GraphQL API:", error);
      throw error;
    }
  });

/**
 * Generic query function that can be used to fetch data from the GraphQL API.
 *
 * @param doc - The GraphQL query document or a string representation of it.
 * @param variables - Optional variables to pass to the query.
 * @returns The data returned by the GraphQL API.
 */
export async function query<T = unknown>(
  doc: RequestDocument,
  variables?: Record<string, unknown>,
): Promise<T> {
  const docString = typeof doc === "string" ? doc : print(doc);

  return graphqlQuery({ data: { docString, variables } }) as Promise<T>;
}
