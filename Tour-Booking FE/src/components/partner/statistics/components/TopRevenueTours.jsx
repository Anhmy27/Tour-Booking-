import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const TopRevenueTours = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1); // JS: 0-11
  const [year, setYear] = useState(currentDate.getFullYear());
  const [topTours, setTopTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTopTours = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}reports/top-revenue-tours`,
        {
          params: { month, year },
          withCredentials: true,
        }
      );

      setTopTours(res.data.topTours);
    } catch (err) {
      console.error("Lỗi khi tải top tour doanh thu:", err);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchTopTours();
  }, [fetchTopTours]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Top 5 Tour Doanh Thu Cao Nhất
        </h2>
        <div className="flex space-x-2">
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
        </div>
      </div>

      {topTours.length === 0 ? (
        <p className="text-gray-500">Không có dữ liệu trong tháng này.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead>
              <tr className="border-b">
                <th className="py-2">#</th>
                <th className="py-2">Tên tour</th>
                <th className="py-2">Lượt đặt</th>
                <th className="py-2">Doanh thu</th>
                <th className="py-2">Ngày khởi hành gần nhất</th>
              </tr>
            </thead>
            <tbody>
              {topTours.map((tour, index) => (
                <tr key={tour.tourId} className="border-b">
                  <td className="py-2">{index + 1}</td>
                  <td className="py-2 font-medium">{tour.name}</td>
                  <td className="py-2">{tour.totalBookings}</td>
                  <td className="py-2">
                    {tour.totalRevenue.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td className="py-2">
                    {tour.nextStartDate
                      ? new Date(tour.nextStartDate).toLocaleDateString("vi-VN")
                      : "Chưa có lịch"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TopRevenueTours;
