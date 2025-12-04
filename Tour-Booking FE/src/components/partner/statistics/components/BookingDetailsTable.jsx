import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const BookingDetailsTable = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [search, setSearch] = useState("");
  const [paid, setPaid] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchBookings = useCallback(async () => {
    try {
      const params = {
        month,
        year,
        page,
        limit,
        ...(search && { search }),
        ...(paid !== "all" && { paid }),
      };

      const res = await axios.get(
        "http://localhost:9999/reports/booking-details",
        {
          params,
          withCredentials: true,
        }
      );

      setBookings(res.data.data);
      setTotal(res.data.total);
    } catch (error) {
      console.error("Lỗi khi tải danh sách booking:", error);
    }
  }, [month, year, page, search, paid]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-lg font-semibold text-gray-900 pb-2">
        Danh sách booking trong tháng {month} năm {year}
      </h2>
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Tháng {i + 1}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          {[2023, 2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              Năm {y}
            </option>
          ))}
        </select>

        <select
          value={paid}
          onChange={(e) => {
            setPaid(e.target.value);
            setPage(1); // reset page khi filter
          }}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="all">Tất cả</option>
          <option value="true">Đã thanh toán</option>
          <option value="false">Chưa thanh toán</option>
        </select>

        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset page khi search
          }}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      <table className="min-w-full text-sm text-left text-gray-700">
        <thead>
          <tr className="border-b">
            <th className="py-2">Tour</th>
            <th className="py-2">Khách hàng</th>
            <th className="py-2">Email</th>
            <th className="py-2">Ngày khởi hành</th>
            <th className="py-2">Số người</th>
            <th className="py-2">Tổng tiền</th>
            <th className="py-2">Thanh toán</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.bookingId} className="border-b">
              <td className="py-2">{b.tourName}</td>
              <td className="py-2">{b.userName}</td>
              <td className="py-2">{b.userEmail}</td>
              <td className="py-2">
                {b.startDate
                  ? new Intl.DateTimeFormat("vi-VN").format(
                      new Date(b.startDate)
                    )
                  : "--"}
              </td>
              <td className="py-2">{b.numberOfPeople}</td>
              <td className="py-2">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(b.totalPrice)}
              </td>
              <td className="py-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    b.paid
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {b.paid ? "Đã TT" : "Chưa TT"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-end items-center space-x-2 text-sm">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
        >
          Trước
        </button>
        <span>
          Trang {page} / {Math.ceil(total / limit)}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page * limit >= total}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
        >
          Tiếp
        </button>
      </div>
    </div>
  );
};

export default BookingDetailsTable;
