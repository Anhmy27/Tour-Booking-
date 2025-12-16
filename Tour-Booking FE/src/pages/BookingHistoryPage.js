import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { createMoMoPayment } from "../services/api";

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReviewTourId, setActiveReviewTourId] = useState(null);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [successMessage, setSuccessMessage] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}bookings/my`,
          { withCredentials: true }
        );
        setBookings(res.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử đặt tour:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleReviewSubmit = async (tourId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}reviews`,
        {
          tourId,
          review: reviewContent,
          rating: reviewRating,
        },
        { withCredentials: true }
      );

      setSuccessMessage("Đã gửi đánh giá thành công.");
      setActiveReviewTourId(null);
      setReviewContent("");
      setReviewRating(5);
    } catch (err) {
      console.error("Lỗi gửi đánh giá:", err);
    }
  };

  const handlePayment = async (booking) => {
    try {
      setPaymentLoading(booking._id);

      const res = await createMoMoPayment({
        tourId: booking.tour._id,
        numberOfPeople: booking.numberOfPeople,
        startDate: booking.startDate,
        bookingId: booking._id,
      });

      if (res.data.status === "success" && res.data.data?.payUrl) {
        window.location.href = res.data.data.payUrl;
      } else {
        alert("Không thể tạo link thanh toán MoMo!");
        setPaymentLoading(null);
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert(error.response?.data?.message || "Lỗi tạo thanh toán MoMo!");
      setPaymentLoading(null);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Đang tải dữ liệu đặt tour...</p>;
  }

  if (bookings.length === 0) {
    return <p className="text-center mt-10">Bạn chưa có đơn đặt tour nào.</p>;
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-cyan-700 mb-8">
        Lịch sử đặt tour
      </h1>

      <div className="space-y-6">
        {bookings.map((booking) => {
          const isTourFinished = dayjs().isAfter(
            dayjs(booking.startDate).add(booking.tour?.duration || 0, "day")
          );

          // Kiểm tra booking đã quá ngày khởi hành chưa
          const isPastStartDate = dayjs().isAfter(dayjs(booking.startDate));
          const isCancelled = isPastStartDate && !booking.paid;

          return (
            <div
              key={booking._id}
              className="border rounded-xl p-5 flex flex-col md:flex-row gap-5 shadow-sm bg-white"
            >
              <img
                src={booking.tour?.imageCover}
                alt={booking.tour?.name}
                className="w-full md:w-48 h-32 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h2 className="text-xl font-semibold text-cyan-800">
                  {booking.tour?.name}
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                  <strong>Ngày khởi hành:</strong>{" "}
                  {dayjs(booking.startDate).format("DD/MM/YYYY")}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  <strong>Số người tham gia:</strong> {booking.numberOfPeople}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  <strong>Tổng giá:</strong>{" "}
                  <span className="text-orange-600 font-semibold">
                    {booking.price.toLocaleString()} đ
                  </span>
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  <strong>Trạng thái:</strong>{" "}
                  {isCancelled ? (
                    <span className="text-gray-500 font-medium">Đã hủy</span>
                  ) : booking.paid ? (
                    <span className="text-green-600 font-medium">
                      Đã thanh toán
                    </span>
                  ) : (
                    <span className="text-orange-500 font-medium">
                      Chưa thanh toán
                    </span>
                  )}
                </p>

                {/* Thông báo hủy do quá hạn */}
                {isCancelled && (
                  <div className="mt-2 bg-gray-100 border-l-4 border-gray-400 p-3 rounded">
                    <p className="text-sm text-gray-700">
                      ⚠️ Booking đã bị hủy do quá ngày khởi hành mà chưa thanh
                      toán.
                    </p>
                  </div>
                )}

                <p className="text-sm text-gray-600 mt-1">
                  <strong>Ngày đặt:</strong>{" "}
                  {dayjs(booking.createdAt).format("HH:mm DD/MM/YYYY")}
                </p>

                {/* Nút thanh toán cho booking chưa thanh toán và chưa quá ngày */}
                {!booking.paid && !isCancelled && (
                  <button
                    className="mt-3 px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    onClick={() => handlePayment(booking)}
                    disabled={paymentLoading === booking._id}
                  >
                    {paymentLoading === booking._id ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Đang xử lý...
                      </span>
                    ) : (
                      "Thanh toán ngay"
                    )}
                  </button>
                )}

                {booking.tour?.description && (
                  <p className="text-sm text-gray-500 mt-3">
                    <strong>Mô tả:</strong> {booking.tour.description}
                  </p>
                )}

                {/* --- Review Section --- */}
                {isTourFinished && !isCancelled && (
                  <div className="mt-4">
                    {activeReviewTourId === booking.tour._id ? (
                      <div className="bg-gray-50 p-4 rounded-lg border mt-2">
                        <label className="block text-sm font-medium mb-1">
                          Đánh giá (1-5 sao):
                        </label>
                        <select
                          value={reviewRating}
                          onChange={(e) =>
                            setReviewRating(Number(e.target.value))
                          }
                          className="border p-2 rounded w-full mb-3"
                        >
                          {[1, 2, 3, 4, 5].map((star) => (
                            <option key={star} value={star}>
                              {star} sao
                            </option>
                          ))}
                        </select>

                        <textarea
                          rows={3}
                          className="border p-2 rounded w-full mb-3"
                          placeholder="Viết cảm nhận của bạn về tour này..."
                          value={reviewContent}
                          onChange={(e) => setReviewContent(e.target.value)}
                        />

                        <div className="flex gap-2">
                          <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            onClick={() => handleReviewSubmit(booking.tour._id)}
                          >
                            Gửi đánh giá
                          </button>
                          <button
                            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                            onClick={() => setActiveReviewTourId(null)}
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="mt-3 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
                        onClick={() => setActiveReviewTourId(booking.tour._id)}
                      >
                        Viết đánh giá
                      </button>
                    )}
                  </div>
                )}

                {successMessage && activeReviewTourId === null && (
                  <p className="text-green-600 mt-2">{successMessage}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BookingHistoryPage;
