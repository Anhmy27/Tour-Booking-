import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleError, setGoogleError] = useState("");
  const { login, isLoading, error, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Kiểm tra lỗi từ Google OAuth redirect
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setGoogleError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGoogleError(""); // Clear Google error khi login thường
    await login(email, password);
  };

  const handleGoogleLogin = () => {
    setGoogleError(""); // Clear error trước khi login
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:9999/api/v1/";
    window.location.href = `${backendUrl}auth/google`;
  };

  useEffect(() => {
    if (user) {
      if (!user.active) {
        navigate("/confirm-email");
        return;
      }
      switch (user.role?.trim().toLowerCase()) {
        case "admin":
          navigate("/admin");
          break;
        case "customer":
          navigate("/");
          break;
        case "partner":
          navigate("/partner/dashboard");
          break;
        default:
          navigate("/");
          break;
      }
    }
  }, [user, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-teal-400 mb-6 text-xl uppercase font-semibold">
          ĐĂNG NHẬP
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Tài khoản Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm"
            />
          </div>

          <div className="text-left">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {googleError && <div className="text-red-500 text-sm">{googleError}</div>}

          <button
            className="w-full bg-teal-400 text-white py-3 rounded-full font-bold disabled:opacity-70"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Đang tải..." : "ĐĂNG NHẬP"}
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">Hoặc</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Đăng nhập bằng Google
          </button>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-teal-500 hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
