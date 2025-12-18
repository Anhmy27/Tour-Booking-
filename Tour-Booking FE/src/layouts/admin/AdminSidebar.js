import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  ClockIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useAuthContext } from "../../contexts/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
  { name: "Manage Users", href: "/admin/users", icon: UserGroupIcon },
  { name: "Active Tours", href: "/admin/active-tours", icon: CheckCircleIcon },
  { name: "Pending Tours", href: "/admin/pending-tours", icon: ClockIcon },
  { name: "Blogs", href: "/admin/blogs", icon: DocumentTextIcon },
  { name: "Calendar", href: "/admin/calendar", icon: CalendarIcon },
  { name: "Chat", href: "/admin/chat", icon: ChatBubbleLeftIcon },
  { name: "Statistics", href: "/admin/statistics", icon: ChartBarIcon },
  { name: "Settings", href: "/admin/settings", icon: Cog6ToothIcon },
];

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside
      className={`
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
      transition-transform duration-300 ease-in-out flex flex-col
    `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <Link to="/admin/dashboard" className="flex items-center">
          <img
            src="/assets/fvivu.png"
            alt="fvivu Logo"
            className="w-28 object-contain transition-transform duration-300"
          />
        </Link>
        <button
          className="p-2 rounded-md"
          onClick={() => setSidebarOpen(false)}
        >
          <span className="sr-only">Close sidebar</span>
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

      {/* Navigation */}
      <nav className="mt-4 flex-1 px-2 space-y-1">
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
                className={`
                  w-5 h-5 mr-3
                  ${isActive ? "text-indigo-600" : "text-gray-400"}
                `}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
