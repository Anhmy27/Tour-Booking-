import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  BanknotesIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  RectangleGroupIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import RevenueChart from "../components/RevenueChart";
import TopRevenueTours from "../components/TopRevenueTours";
import BookingDetailsTable from "../components/BookingDetailsTable";
import Sidebar from "../../../../layouts/partner/Sidebar";
import Header from "../../../../layouts/partner/Header";

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className="bg-indigo-50 rounded-lg p-3">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
    </div>
  </div>
);

const DashboardPartnerPage = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL.replace('/api/v1/', '')}reports/overview`, {
        params: { month: selectedMonth, year: selectedYear },
        withCredentials: true,
      });
      if (res.data.status === "success") {
        setStats(res.data.data);
      } else {
        console.error("Lỗi: Không nhận được dữ liệu thành công.");
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu tổng quan đối tác:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-gray-900 text-white">
        <Sidebar />
      </div>

      <div className="flex-1">
        <Header />
        <main className="p-10 bg-gray-100">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Tổng quan hoạt động trong tháng {selectedMonth}/{selectedYear}
              </p>
            </div>

            <div className="flex space-x-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="border px-3 py-1 rounded-md text-sm"
              >
                {[...Array(12)].map((_, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    Tháng {idx + 1}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border px-3 py-1 rounded-md text-sm"
              >
                {[2023, 2024, 2025, 2026].map((year) => (
                  <option key={year} value={year}>
                    Năm {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Doanh thu"
                value={
                  stats?.totalRevenue
                    ? stats.totalRevenue.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                    : "0 đ"
                }
                icon={BanknotesIcon}
              />
              <StatCard
                title="Số đơn đặt"
                value={stats?.totalBookings ?? 0}
                icon={ShoppingBagIcon}
              />
              <StatCard
                title="Tổng người tham gia"
                value={stats?.totalParticipants ?? 0}
                icon={UserGroupIcon}
              />
              <StatCard
                title="Số tour hoạt động"
                value={stats?.activeToursCount ?? 0}
                icon={RectangleGroupIcon}
              />
              <StatCard
                title="Doanh thu TB / tour"
                value={
                  stats?.averageRevenuePerTour
                    ? stats.averageRevenuePerTour.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                    : "0 đ"
                }
                icon={ChartBarIcon}
              />
            </div>
          )}

          <RevenueChart />
          <TopRevenueTours />
          <BookingDetailsTable />
        </main>
      </div>
    </div>
  );
};

export default DashboardPartnerPage;
