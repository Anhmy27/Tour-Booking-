import { Outlet } from "react-router-dom";

import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const CustomerLayout = () => {
  return (
    <div className="min-h-screen font-sans bg-white">
      {/* Header Section */}
      <Header />

      {/* Main Content Section */}
      <main className="w-full">
        <Outlet />
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default CustomerLayout;
