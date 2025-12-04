import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import Body from "./Body";

const PartnerDashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar cố định bên trái */}
      <div className="w-64 bg-gray-900 text-white">
        <Sidebar />
      </div>

      {/* Phần chính */}
      <div className="flex flex-col w-full">
        <Header />
        <main className="flex-grow p-6 overflow-auto">
          <Body />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default PartnerDashboard;
