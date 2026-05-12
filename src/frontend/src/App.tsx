import { Layout } from "@/components/Layout";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const EditPage = lazy(() => import("@/pages/EditPage"));

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<div className="flex-1" />}>
      <ProfilePage />
    </Suspense>
  ),
});

const editRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/edit",
  component: () => (
    <Suspense fallback={<div className="flex-1" />}>
      <EditPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([profileRoute, editRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
