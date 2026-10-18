import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { PageSkeleton } from "@/components/shared/Skeletons";
import { NotFoundView, RouteErrorView } from "@/components/shared/Boundaries";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultPendingComponent: PageSkeleton,
    defaultPendingMs: 150,
    defaultNotFoundComponent: NotFoundView,
    defaultErrorComponent: RouteErrorView,
  });

  return router;
};
