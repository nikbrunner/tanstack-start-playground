import { createRouter as createTanStackRouter } from "@tanstack/react-router";

import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary";
import { NotFound } from "./components/NotFound";
import * as queries from "./queries";
import { routeTree } from "./routeTree.gen";
import { getQueryClient } from "./utils/query-client";

export function createRouter() {
  const queryClient = getQueryClient();

  const router = createTanStackRouter({
    routeTree,
    defaultPreload: "intent",
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
    context: {
      queries,
      queryClient
    }
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
