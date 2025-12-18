import { lazy } from "react";

const AdminLayout = lazy(() => import("../layouts/admin/AdminLayout"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Users = lazy(() => import("../pages/admin/Users"));
const ActiveTours = lazy(() => import("../pages/admin/ActiveToursPage"));
const PendingTours = lazy(() => import("../pages/admin/PendingTours"));
const ActiveTourDetailPage = lazy(() => import("../pages/admin/ActiveTourDetailPage"));
const AllBlogsPage = lazy(() => import("../pages/admin/AllBlogsPage"));
const BlogDetailAdminPage = lazy(() => import("../pages/admin/BlogDetailAdminPage"));

const Bookings = lazy(() => import("../pages/admin/Bookings"));
const adminRoutes = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    { path: "dashboard", element: <Dashboard /> },
    { path: "users", element: <Users /> },
    { path: "active-tours", element: <ActiveTours /> },
    { path: "pending-tours", element: <PendingTours /> },
    {
      path: "active-tours/:id",
      element: <ActiveTourDetailPage />,
    },
    {
      path: "blogs",
      element: <AllBlogsPage />,
    },
    {
      path: "blogs/:id",
      element: <BlogDetailAdminPage />,
    },
    { path: "bookings", element: <Bookings /> }
  ],
};

export default adminRoutes;
