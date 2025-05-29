export async function fetchGraphQLData<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  // https://graphql.org/swapi-graphql
  const STAR_WARS_GRAPHQL_ENDPOINT = process.env.STAR_WARS_GRAPHQL_ENDPOINT;

  if (!STAR_WARS_GRAPHQL_ENDPOINT) {
    throw new Error("STAR_WARS_GRAPHQL_ENDPOINT is not set");
  }

  try {
    const response = await fetch(STAR_WARS_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();

    if (json.errors) {
      throw new Error(JSON.stringify(json.errors));
    }

    return json.data;
  } catch (error) {
    console.error("Error fetching data from GraphQL API:", error);
    throw error;
  }
}
