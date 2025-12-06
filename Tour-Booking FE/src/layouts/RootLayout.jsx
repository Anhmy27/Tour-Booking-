import { Outlet } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { TourProvider } from "../contexts/TourContext";

const RootLayout = () => {
  return (
    <AuthProvider>
      <TourProvider>
        <Outlet />
      </TourProvider>
    </AuthProvider>
  );
};

export default RootLayout;
