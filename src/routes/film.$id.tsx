import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/film/$id")({
  component: RouteComponent,
  loader: async ({ params, context: { gql } }) => {
    const filmQuery = await gql.request(gql.queries.FILM_QUERY, { id: params.id });

    return {
      film: filmQuery.data?.film
    };
  }
});

function RouteComponent() {
  const { film } = Route.useLoaderData();
  const navigate = Route.useNavigate();

  return (
    <div>
      <button
        className="mb-6 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={() =>
          navigate({
            to: "/"
          })
        }
      >
        Go to all films
      </button>

      <h1 className="mb-4 text-3xl font-bold text-blue-800">{film?.title}</h1>
      <div className="mb-2 text-lg text-gray-800">
        <span className="font-semibold text-black">Director:</span> {film?.director}
      </div>
      <div className="mb-2 text-lg text-gray-800">
        <span className="font-semibold text-black">Producers:</span>{" "}
        {film?.producers}
      </div>
      <div className="mb-2 text-lg text-gray-800">
        <span className="font-semibold text-black">Release Date:</span>{" "}
        {film?.releaseDate}
      </div>
      <div className="mt-4 max-w-2xl text-base leading-relaxed text-gray-400">
        <span className="mb-2 block font-semibold text-black">Opening Crawl:</span>
        {film?.openingCrawl}
      </div>
    </div>
  );
}
