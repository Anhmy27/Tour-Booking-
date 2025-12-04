import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";
import { authService } from "../../services/api";

function ConfirmEmailForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [inputPin, setInputPin] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!user || user.active) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setConfirmLoading(true);
      setError("");
      await authService.confirmEmail(inputPin);
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Gặp lỗi khi xác nhận");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);
      setResendMessage("");

      const res = await authService.resendConfirmEmail();

      if (res.status !== 200)
        throw new Error("Gửi lại mã thất bại. Hãy thử lại sau.");

      setResendMessage("Mã xác nhận đã được gửi lại email của bạn.");
      setResendCooldown(60); // Bắt đầu đếm ngược 60 giây
    } catch (err) {
      setResendMessage(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  // useEffect để đếm ngược cooldown
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-teal-400 mb-6 text-xl uppercase font-semibold">
          Xác nhận email của bạn
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label
              htmlFor="code"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Nhập mã code mà chúng tôi đã gửi tới{" "}
              <strong>{user?.email}</strong>
            </label>
            <input
              type="text"
              id="code"
              value={inputPin}
              onChange={(e) => {
                setInputPin(e.target.value);
              }}
              placeholder="_ _ _ _ _ _"
              required
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm"
              maxLength={6}
            />
          </div>

          {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}

          <button
            className="w-full bg-teal-400 text-white py-3 rounded-full font-bold disabled:opacity-70"
            type="submit"
            disabled={confirmLoading}
          >
            {confirmLoading ? "Đang tải..." : "XÁC NHẬN"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm">Không nhận được email?</p>
          <button
            onClick={handleResend}
            disabled={resendLoading || resendCooldown > 0}
            className="mt-2 px-6 py-2 border-2 border-teal-400 text-teal-400 rounded-full font-bold transition hover:bg-teal-400 hover:text-white disabled:opacity-50"
          >
            {resendLoading
              ? "Đang gửi lại..."
              : resendCooldown > 0
                ? `Gửi lại sau ${resendCooldown}s`
                : "Gửi lại mã xác nhận"}
          </button>

          {resendMessage && (
            <div className="text-green-500 mt-3 text-sm">{resendMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConfirmEmailForm;
