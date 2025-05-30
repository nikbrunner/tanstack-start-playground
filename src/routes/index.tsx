import { createFileRoute, ErrorComponent, Link } from "@tanstack/react-router";
import { ALL_FILMS_QUERY } from "../queries/allFilms";
import { query } from "~/graphql/query";

export const Route = createFileRoute("/")({
  component: Component,
  loader: async () => {
    const filmsQuery = await query(ALL_FILMS_QUERY);

    return {
      films: filmsQuery.data?.allFilms?.films,
    };
  },
  errorComponent: (error) => <ErrorComponent error={error} />,
});

function Component() {
  const { films } = Route.useLoaderData();

  return (
    <div className="p-4">
      <h2 className="text-5xl font-bold text-blue-800 mb-4">Star Wars Films</h2>
      <ul className="space-y-2">
        {films?.map((film) => (
          <li key={film?.id} className="ring-2 ring-gray-400 rounded p-4">
            <Link to="/film/$id" params={{ id: film?.id ?? "" }}>
              <div className="text-2xl font-bold text-blue-600 mb-4">{film?.title}</div>
            </Link>

            <div className="text-sm text-gray-500 mb-2">
              Directed by {film?.director} &middot; Released: {film?.releaseDate}
            </div>

            <h3 className="text-sm text-gray-500">Species:</h3>
            {film?.speciesConnection?.species?.map((species, index) => {
              return (
                <span key={species?.name}>
                  {species?.name}
                  {index !== (film?.speciesConnection?.species?.length ?? 0) - 1 && ", "}
                </span>
              );
            })}
          </li>
        ))}
      </ul>
    </div>
  );
}
