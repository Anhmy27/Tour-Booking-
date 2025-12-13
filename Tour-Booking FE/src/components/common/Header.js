import { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Đã bỏ useEffect kiểm tra user.active

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const success = await logout();
    if (success) navigate("/");
  };
  return (
    <header className="sticky top-0 z-50 bg-white text-black py-4 px-12 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Left Section: Logo and Navigation */}
        <div className="flex items-center gap-10 h-full">
          {/* Logo */}
          <div>
            <a href="/">
              <img
                src="/assets/fvivu.png"
                alt="fvivu Logo"
                className="w-28 object-contain transition-transform duration-300"
              />
            </a>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex gap-6 h-full items-center">
            {[
              { label: "Tìm Tour", href: "/" },
              { label: "Blog", href: "/blogs" },
              { label: "Lịch sử", href: "/booking-history" },
            ].map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-lg font-medium hover:text-blue-600 transition-colors h-full flex items-center"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Section: Hotline, Auth Buttons, Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Hotline */}
          <div className="flex items-center">
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21.384,17.752a2.108,2.108,0,0,1-.522,3.359,7.543,7.543,0,0,1-5.476.642C10.5,20.523,3.477,13.5,2.247,8.614a7.543,7.543,0,0,1,.642-5.476,2.108,2.108,0,0,1,3.359-.522L8.333,4.7a2.094,2.094,0,0,1,.445,2.328A3.877,3.877,0,0,1,8,8.2c-2.384,2.384,5.417,10.185,7.8,7.8a3.877,3.877,0,0,1,1.173-.781,2.092,2.092,0,0,1,2.328.445Z"></path>
            </svg>
            <a href="tel:0123456789" className="text-lg font-medium">
              Hotline: 0123456789
            </a>
          </div>

          {/* Auth Buttons */}
          {!user ? (
            <div className="hidden md:flex gap-3">
              <a
                href="/register"
                className="bg-cyan-400 text-white font-medium py-2 px-4 rounded-2xl hover:bg-cyan-500 transition-colors text-base"
              >
                Đăng ký
              </a>
              <a
                href="/login"
                className="border border-cyan-400 text-cyan-400 font-medium py-2 px-4 rounded-2xl hover:bg-cyan-50 transition-colors text-base"
              >
                Đăng nhập
              </a>
            </div>
          ) : (
            <div ref={menuRef} className="relative hidden md:flex items-center">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                  src={user.photo || "/default-avatar.png"}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover border"
                />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-12 w-40 bg-white border rounded-lg shadow-lg z-50">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Hồ sơ
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 7C4 5.34315 5.34315 4 7 4C8.65685 4 10 5.34315 10 7C10 8.65685 8.65685 10 7 10C5.34315 10 4 8.65685 4 7Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M14 7C14 5.34315 15.3431 4 17 4C18.6569 4 20 5.34315 20 7C20 8.65685 18.6569 10 17 10C15.3431 10 14 8.65685 14 7Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M14 17C14 15.3431 15.3431 14 17 14C18.6569 14 20 15.3431 20 17C20 18.6569 18.6569 20 17 20C15.3431 20 14 18.6569 14 17Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M4 17C4 15.3431 5.34315 14 7 14C8.65685 14 10 15.3431 10 17C10 18.6569 8.65685 20 7 20C5.34315 20 4 18.6569 4 17Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
