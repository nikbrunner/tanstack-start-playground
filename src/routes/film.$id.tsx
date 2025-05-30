import { createFileRoute } from "@tanstack/react-router";
import { query } from "~/graphql/query";
import { FILM_QUERY } from "~/queries/film";

export const Route = createFileRoute("/film/$id")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const filmQuery = await query(FILM_QUERY, { id: params.id });
    console.log("DEBUG(film.$id.tsx): filmQuery", filmQuery);

    return {
      film: filmQuery.data?.film,
    };
  },
});

function RouteComponent() {
  const { film } = Route.useLoaderData();
  const navigate = Route.useNavigate();

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
        onClick={() =>
          navigate({
            to: "/",
          })
        }
      >
        Go to all films
      </button>

      <h1 className="text-3xl font-bold text-blue-800 mb-4">{film?.title}</h1>
      <div className="text-lg text-gray-800 mb-2">
        <span className="font-semibold text-black">Director:</span> {film?.director}
      </div>
      <div className="text-lg text-gray-800 mb-2">
        <span className="font-semibold text-black">Producers:</span> {film?.producers}
      </div>
      <div className="text-lg text-gray-800 mb-2">
        <span className="font-semibold text-black">Release Date:</span> {film?.releaseDate}
      </div>
      <div className="text-base text-gray-400 mt-4 leading-relaxed max-w-2xl">
        <span className="font-semibold text-black block mb-2">Opening Crawl:</span>
        {film?.openingCrawl}
      </div>
    </div>
  );
}
