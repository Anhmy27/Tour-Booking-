import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const { resetPassword, isLoading, error, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await resetPassword(email, token, password, passwordConfirm))
      window.location.reload();
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
          ĐẶT LẠI MẬT KHẨU
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Mật khẩu mới
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

          <div className="text-left">
            <label
              htmlFor="passwordConfirm"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            className="w-full bg-teal-400 text-white py-3 rounded-full font-bold disabled:opacity-70"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Đang tải..." : "XÁC NHẬN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
