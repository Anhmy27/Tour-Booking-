import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { forgotPassword, isLoading, error, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSuccess(false);
    if (await forgotPassword(email)) setIsSuccess(true);
  };

  useEffect(() => {
    if (user) {
      // Đã bỏ kiểm tra user.active
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
          QUÊN MẬT KHẨU
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
          <div>
            Chúng tôi sẽ gửi mã xác minh tới email này nếu nó khớp với tài khoản
            Fvivu hiện có.
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {isSuccess && (
            <div className="text-green-500 text-sm">
              Email đặt lại mật khẩu đã được gửi! Hãy kiểm tra hộp thư đến (hoặc
              thư rác) của bạn.
            </div>
          )}

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

export default ForgotPasswordForm;
