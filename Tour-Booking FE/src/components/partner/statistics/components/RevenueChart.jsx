import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const RevenueChart = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:9999/reports/analytics", {
        params: { year },
        withCredentials: true,
      });

      const data = res.data.data.monthlyRevenue.map((item) => ({
        ...item,
        monthLabel: `Tháng ${item.month}`,
      }));

      setMonthlyRevenue(data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu phân tích:", err);
    }
  }, [year]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          Doanh thu theo tháng ({year})
        </h2>
        <select
          className="border border-gray-300 rounded px-2 py-1 text-sm"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {[2023, 2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              Năm {y}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyRevenue}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthLabel" />
          <YAxis
            width={100}
            tickFormatter={(value) =>
              value.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
                maximumFractionDigits: 0,
              })
            }
          />
          <Tooltip
            formatter={(value) =>
              value.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
                maximumFractionDigits: 0,
              })
            }
          />
          <Line
            type="monotone"
            dataKey="totalRevenue"
            stroke="#6366f1"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
