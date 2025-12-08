import { lazy } from "react";

const PartnerDashboard = lazy(
  () => import("../layouts/partner/PartnerDashboard")
);
const PartnerStatistics = lazy(
  () => import("../components/partner/statistics/pages/DashboardPartnerPage")
);
const CreateTour = lazy(() => import("../components/partner/CreateTour"));
const PartnerTour = lazy(() => import("../components/partner/PartnerTour"));
const EditTour = lazy(() => import("../components/partner/EditTour"));
const BookingList = lazy(() => import("../components/partner/BookingList"));
const CompanyProfile = lazy(() => import("../layouts/partner/CompanyProfile"));
const BlogManagement = lazy(() => import("../components/partner/BlogManagement"));
const BlogDetail = lazy(() => import("../components/partner/BlogDetail"));

const partnerRoutes = {
  path: "/partner",
  children: [
    { path: "dashboard", element: <PartnerDashboard /> },
    { path: "statistics", element: <PartnerStatistics /> },
    { path: "tours", element: <PartnerTour /> },
    { path: "tours/create", element: <CreateTour /> },
    { path: "tours/edit/:id", element: <EditTour /> },
    { path: "tours/bookinglist", element: <BookingList /> },
    { path: "blogs", element: <BlogManagement /> },
    { path: "blogs/:id", element: <BlogDetail /> },
    { path: "profile", element: <CompanyProfile /> },
  ],
};

export default partnerRoutes;
