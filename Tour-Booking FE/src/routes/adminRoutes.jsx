import { lazy } from "react";

const AdminLayout = lazy(() => import("../layouts/admin/AdminLayout"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Users = lazy(() => import("../pages/admin/Users"));
const PendingTours = lazy(() => import("../pages/admin/PendingTours"));
const Bookings = lazy(() => import("../pages/admin/Bookings"));
const adminRoutes = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    { path: "dashboard", element: <Dashboard /> },
    { path: "users", element: <Users /> },
    { path: "pending-tours", element: <PendingTours /> },
    { path: "bookings", element: <Bookings /> },
  ],
};

export default adminRoutes;
