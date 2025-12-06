import { createBrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import RootLayout from "../layouts/RootLayout";
import adminRoutes from "./adminRoutes";
import customerRoutes from "./customerRoutes";
import partnerRoutes from "./partnerRoutes";
import Loading from "../components/Loading";
import ProtectedRoute from "../components/ProtectedRoute";

const withSuspense = (element) => (
  <Suspense fallback={<Loading />}>{element}</Suspense>
);

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Customer routes (public)
      {
        ...customerRoutes,
        element: withSuspense(customerRoutes.element),
        children: customerRoutes.children.map((route) => ({
          ...route,
          element: withSuspense(route.element),
        })),
      },
      // Admin routes (protected)
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            ...adminRoutes,
            element: withSuspense(adminRoutes.element),
            children: adminRoutes.children.map((route) => ({
              ...route,
              element: withSuspense(route.element),
            })),
          },
        ],
      },
      // Partner routes (protected)
      {
        element: <ProtectedRoute allowedRoles={["partner"]} />,
        children: [
          {
            ...partnerRoutes,
            children: partnerRoutes.children.map((route) => ({
              ...route,
              element: withSuspense(route.element),
            })),
          },
        ],
      },
    ],
  },
]);

export default router;
