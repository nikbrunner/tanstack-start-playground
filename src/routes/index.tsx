import { createFileRoute, ErrorComponent, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Component,
  loader: async ({ context: { gql } }) => {
    const filmsQuery = await gql.request(gql.queries.ALL_FILMS_QUERY);

    return {
      films: filmsQuery.data?.allFilms?.films ?? []
    };
  },
  errorComponent: error => <ErrorComponent error={error} />
});

function Component() {
  const { films } = Route.useLoaderData();

  return (
    <div>
      <h2 className="mb-4 text-5xl font-bold text-blue-800">Star Wars Films</h2>
      <ul className="space-y-2">
        {films?.map(film => (
          <li key={film?.id} className="rounded p-4 ring-2 ring-gray-400">
            <Link to="/film/$id" params={{ id: film?.id ?? "" }} preload="intent">
              <div className="mb-4 text-2xl font-bold text-blue-600">
                {film?.title}
              </div>
            </Link>

            <div className="mb-2 text-sm text-gray-500">
              Directed by {film?.director} &middot; Released: {film?.releaseDate}
            </div>

            <h3 className="text-sm text-gray-500">Species:</h3>
            {film?.speciesConnection?.species?.map((species, index) => {
              return (
                <span key={species?.name}>
                  {species?.name}
                  {index !== (film?.speciesConnection?.species?.length ?? 0) - 1 &&
                    ", "}
                </span>
              );
            })}
          </li>
        ))}
      </ul>
    </div>
  );
}
