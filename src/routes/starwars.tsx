import { createFileRoute } from "@tanstack/react-router";
import { fetchGraphQLData } from "../server/fetchGraphQLData";

export const Route = createFileRoute("/starwars")({
  loader: async () => {
    // Inline GraphQL query to fetch all Star Wars films
    const query = `
query AllFilms {
  allFilms {
    films {
      id
      title
      releaseDate
      director
      speciesConnection {
        species {
          name
        }
      }
    }
  }
}
    `;

    const data = await fetchGraphQLData<{
      allFilms: {
        films: {
          id: string;
          title: string;
          releaseDate: string;
          director: string;
          speciesConnection: {
            species: {
              name: string;
            }[];
          };
        }[];
      };
    }>(query);
    return { films: data.allFilms.films };
  },
  component: StarWarsFilms,
});

function StarWarsFilms() {
  const { films } = Route.useLoaderData();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Star Wars Films</h2>
      <ul className="space-y-2">
        {films.map((film) => (
          <li key={film.id} className="border rounded p-2">
            <div className="font-semibold">{film.title}</div>
            <div className="text-sm text-gray-500">
              Directed by {film.director} &middot; Released: {film.releaseDate}
            </div>
            {/* <code>{JSON.stringify(film.speciesConnection.species, null, 2)}</code> */}
            <ul>
              {film.speciesConnection.species.map((species) => (
                <li key={species.name} className="rounded p-2">
                  {species.name}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
