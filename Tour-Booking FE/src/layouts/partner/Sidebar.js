import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useAuthContext } from "../../contexts/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuthContext();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect even on error
      window.location.href = "/";
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded-lg mt-4"
    >
      <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-red-500" />
      Đăng Xuất
    </button>
  );
};

const navigation = [
  { name: "Dashboard", href: "/partner/dashboard", icon: HomeIcon },
  {
    name: "Thống kê",
    href: "/partner/statistics",
    icon: ChartBarIcon,
  },
  {
    name: "Tạo Tour mới",
    href: "/partner/tours/create",
    icon: PlusCircleIcon,
  },
  {
    name: "Danh sách Tour",
    href: "/partner/tours",
    icon: ClipboardDocumentListIcon,
  },
  {
    name: "Đơn đặt Tour",
    href: "/partner/tours/bookinglist",
    icon: CalendarDaysIcon,
  },
  {
    name: "Hồ sơ Công Ty",
    href: "/partner/profile",
    icon: ClipboardDocumentListIcon,
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  return (
    <aside
      className={`
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
                transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
                flex flex-col h-full
            `}
    >
      {/* Logo và nút đóng sidebar */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <Link
          to="/partner/dashboard"
          className="text-2xl font-semibold text-indigo-600"
        >
          fvivu
        </Link>
        <button className="p-2 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Menu điều hướng */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                                flex items-center px-4 py-2 text-sm font-medium rounded-lg
                                ${
                                  isActive
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }
                            `}
            >
              <item.icon
                className={`w-5 h-5 mr-3 ${
                  isActive ? "text-indigo-600" : "text-gray-400"
                }`}
              />
              {item.name}
            </Link>
          );
        })}

        {/* Đăng xuất */}
        <LogoutButton />
      </nav>
    </aside>
  );
};

export default Sidebar;
