import { createBrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import adminRoutes from "./adminRoutes";
import customerRoutes from "./customerRoutes";
import partnerRoutes from "./partnerRoutes";
import Loading from "../components/Loading"; // hoặc spinner bạn có

const withSuspense = (element) => (
  <Suspense fallback={<Loading />}>{element}</Suspense>
);

const router = createBrowserRouter([
  {
    ...adminRoutes,
    element: withSuspense(adminRoutes.element),
    children: adminRoutes.children.map((route) => ({
      ...route,
      element: withSuspense(route.element),
    })),
  },
  {
    ...customerRoutes,
    element: withSuspense(customerRoutes.element),
    children: customerRoutes.children.map((route) => ({
      ...route,
      element: withSuspense(route.element),
    })),
  },
  {
    ...partnerRoutes,
    children: partnerRoutes.children.map((route) => ({
      ...route,
      element: withSuspense(route.element),
    })),
  },
]);

export default router;
