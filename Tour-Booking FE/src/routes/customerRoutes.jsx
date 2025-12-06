import { lazy } from "react";

const CustomerLayout = lazy(() => import("../layouts/customer/CustomerLayout"));
const HomePage = lazy(() => import("../pages/HomePage"));
const LoginForm = lazy(() => import("../components/auth/LoginForm"));
const SignUpForm = lazy(() => import("../components/auth/SignUp"));
const TourDetailPage = lazy(() => import("../pages/TourDetailPage"));
const BookingHistoryPage = lazy(() => import("../pages/BookingHistoryPage"));
const ConfirmEmailForm = lazy(
  () => import("../components/auth/ConfirmEmailForm")
);
const ForgotPasswordForm = lazy(
  () => import("../components/auth/ForgotPasswordForm")
);
const ResetPasswordForm = lazy(
  () => import("../components/auth/ResetPasswordForm")
);
const UserProfile = lazy(() => import("../pages/UserProfile"));
const RoleRedirect = lazy(() => import("../components/RoleRedirect"));

const customerRoutes = {
  path: "/",
  element: <CustomerLayout />,
  children: [
    { index: true, element: <RoleRedirect><HomePage /></RoleRedirect> },
    { path: "tour-detail/:slug", element: <TourDetailPage /> },
    { path: "login", element: <LoginForm /> },
    { path: "register", element: <SignUpForm /> },
    { path: "confirm-email", element: <ConfirmEmailForm /> },
    { path: "forgot-password", element: <ForgotPasswordForm /> },
    { path: "reset-password", element: <ResetPasswordForm /> },
    { path: "profile", element: <UserProfile /> },
    { path: "booking-history", element: <BookingHistoryPage /> },
    // thêm các route khác ở đây
  ],
};

export default customerRoutes;
