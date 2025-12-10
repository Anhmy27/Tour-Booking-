import React, { useState, useEffect } from "react";
import Sidebar from "../../layouts/partner/Sidebar";
import Header from "../../layouts/partner/Header";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}bookings/partner`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok) {
          setBookings(data.data.bookings);
        } else {
          alert("Lỗi lấy danh sách booking: " + data.message);
        }
      } catch (error) {
        console.error("Lỗi lấy booking:", error);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(
    (booking) => filterStatus === "all" || booking.status === filterStatus
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="w-64 bg-gray-900 text-white">
        <Sidebar />
      </div>

      <div className="flex-1">
        <Header />
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
            Danh Sách Đơn Đặt Tour
          </h2>

          <div className="flex justify-center flex-wrap gap-2 mb-6">
            {[
              { label: "Tất cả", value: "all" },
              { label: "Chờ duyệt", value: "pending" },
              { label: "Đã xác nhận", value: "confirmed" },
              { label: "Đã hủy", value: "cancelled" },
            ].map(({ label, value }) => (
              <button
                key={value}
                className={`px-4 py-2 rounded-lg font-medium transition shadow-sm ${
                  filterStatus === value
                    ? value === "pending"
                      ? "bg-yellow-500 text-white"
                      : value === "confirmed"
                        ? "bg-green-600 text-white"
                        : value === "cancelled"
                          ? "bg-red-600 text-white"
                          : "bg-gray-800 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setFilterStatus(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="overflow-auto rounded-xl shadow bg-white">
            <table className="w-full text-sm text-center">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-3 py-2">STT</th>
                  <th className="px-3 py-2">Khách hàng</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Tên Tour</th>
                  <th className="px-3 py-2">Giá</th>
                  <th className="px-3 py-2">Ngày đặt</th>
                  <th className="px-3 py-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2">{index + 1}</td>
                    <td>{booking.customer?.name || "-"}</td>
                    <td>{booking.customer?.email || "-"}</td>
                    <td>{booking.tour?.name || "-"}</td>
                    <td className="text-green-700 font-medium">
                      {booking.price?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }) || "0 VND"}
                    </td>
                    <td>
                      {booking.bookedAt
                        ? new Date(booking.bookedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-md text-white text-xs font-medium ${
                          booking.status === "confirmed"
                            ? "bg-green-600"
                            : booking.status === "pending"
                              ? "bg-yellow-500"
                              : "bg-red-600"
                        }`}
                      >
                        {booking.status === "confirmed"
                          ? "Đã xác nhận"
                          : booking.status === "pending"
                            ? "Chờ duyệt"
                            : "Đã hủy"}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-6 text-gray-500">
                      Không có đơn đặt tour nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingList;
