import { createFileRoute } from "@tanstack/react-router";
import type { AllFilmsQuery } from "../queries/generated/graphql";
import { ALL_FILMS_QUERY } from "../queries/allFilms";
import { query } from "~/utils/query";

export const Route = createFileRoute("/starwars")({
  loader: async () => {
    const data = await query<AllFilmsQuery>(ALL_FILMS_QUERY);
    return { films: data?.allFilms?.films };
  },
  component: StarWarsFilms,
});

function StarWarsFilms() {
  const { films } = Route.useLoaderData();

  if (!films) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Star Wars Films</h2>
      <ul className="space-y-2">
        {films?.map((film) => (
          <li key={film?.id} className="border rounded p-2">
            <div className="font-semibold">{film?.title}</div>
            <div className="text-sm text-gray-500">
              Directed by {film?.director} &middot; Released: {film?.releaseDate}
            </div>
            <ul>
              {film?.speciesConnection?.species?.map((species) => (
                <li key={species?.name} className="rounded p-2">
                  {species?.name}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
