import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/film/$id")({
  component: RouteComponent,
  loader: async ({ params, context: { queryClient, queries } }) => {
    return await queryClient.ensureQueryData(queries.films.byId(params.id));
  }
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { queries } = Route.useRouteContext();
  const { id } = Route.useParams();
  const { data: film } = useSuspenseQuery(queries.films.byId(id));

  return (
    <div>
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
      <div className="mb-6 mt-4 max-w-2xl text-base leading-relaxed text-gray-400">
        <span className="mb-2 block font-semibold text-black">Opening Crawl:</span>
        {film?.openingCrawl}
      </div>

      <button
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={() => navigate({ to: "/" })}
      >
        Go to all films
      </button>
    </div>
  );
}
