import React, { useEffect, useState, useCallback } from "react";
import {
  UserGroupIcon,
  ShoppingBagIcon,
  UserIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({ title, value, icon: Icon, trend, trendValue, loading }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-1">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          {title}
        </p>
        {loading ? (
          <div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 h-8 w-24 rounded-lg mt-1"></div>
        ) : (
          <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {value}
          </p>
        )}
      </div>
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 shadow-lg">
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>
    {trend && !loading && (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <span
          className={`text-sm font-semibold ${trend === "up" ? "text-green-600" : "text-red-600"}`}
        >
          {trend === "up" ? "↑" : "↓"} {trendValue}
        </span>
        <span className="text-sm text-gray-500 ml-2">so với kỳ trước</span>
      </div>
    )}
  </div>
);

// Component Date Range Picker
const DateRangePicker = ({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onApply,
  onReset,
  loading,
}) => (
  <div className="flex flex-wrap items-center gap-4 bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100 shadow-sm">
    <div className="flex items-center space-x-3">
      <div className="bg-white rounded-lg p-2 shadow-sm">
        <CalendarIcon className="w-5 h-5 text-indigo-600" />
      </div>
      <span className="text-sm font-semibold text-gray-700">Từ ngày:</span>
      <input
        type="date"
        value={fromDate}
        onChange={(e) => onFromDateChange(e.target.value)}
        disabled={loading}
        className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 hover:border-indigo-300"
      />
    </div>
    <div className="flex items-center space-x-3">
      <span className="text-sm font-semibold text-gray-700">Đến ngày:</span>
      <input
        type="date"
        value={toDate}
        onChange={(e) => onToDateChange(e.target.value)}
        disabled={loading}
        className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 hover:border-indigo-300"
      />
    </div>
    <button
      onClick={onApply}
      disabled={loading || !fromDate || !toDate}
      className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
    >
      {loading ? "⏳ Đang tải..." : "✓ Áp dụng"}
    </button>
    <button
      onClick={onReset}
      disabled={loading}
      className="px-6 py-2 bg-white text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg border-2 border-gray-200"
    >
      ↻ Đặt lại
    </button>
  </div>
);

// Loading Skeleton cho Chart
const ChartSkeleton = () => (
  <div className="h-72 flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50 rounded-lg">
    <div className="text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-indigo-600 mx-auto mb-4"></div>
        <div className="absolute inset-0 animate-pulse">
          <div className="rounded-full h-16 w-16 border-4 border-transparent border-t-purple-400 mx-auto"></div>
        </div>
      </div>
      <p className="text-gray-600 font-medium animate-pulse">
        ⏳ Đang tải dữ liệu...
      </p>
    </div>
  </div>
);

// Hàm tạo mảng ngày liên tục từ from đến to
function getDateRange(from, to) {
  const result = [];
  let current = new Date(from);
  const end = new Date(to);
  while (current <= end) {
    result.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return result;
}

const Dashboard = () => {
  const [userStats, setUserStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);
  const [timeRange, setTimeRange] = useState("1m");
  const [revenueRange, setRevenueRange] = useState("month");

  // Separate loading states
  const [userStatsLoading, setUserStatsLoading] = useState(true);
  const [revenueStatsLoading, setRevenueStatsLoading] = useState(true);

  // State cho date range picker
  const [userFromDate, setUserFromDate] = useState("");
  const [userToDate, setUserToDate] = useState("");
  const [revenueFromDate, setRevenueFromDate] = useState("");
  const [revenueToDate, setRevenueToDate] = useState("");
  const [useCustomUserDate, setUseCustomUserDate] = useState(false);
  const [useCustomRevenueDate, setUseCustomRevenueDate] = useState(false);

  const fetchUserStats = useCallback(async () => {
    try {
      setUserStatsLoading(true);
      let url = `${process.env.REACT_APP_BACKEND_URL}admin/stats/view-new-user?groupBy=day`;

      if (useCustomUserDate && userFromDate && userToDate) {
        url += `&from=${userFromDate}&to=${userToDate}`;
      } else {
        url += `&range=${timeRange}`;
      }

      const response = await axios.get(url, { withCredentials: true });
      setUserStats(response.data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      // Có thể thêm toast notification ở đây
    } finally {
      setUserStatsLoading(false);
    }
  }, [useCustomUserDate, userFromDate, userToDate, timeRange]);

  const fetchRevenueStats = useCallback(async () => {
    try {
      setRevenueStatsLoading(true);
      let url = `${process.env.REACT_APP_BACKEND_URL}admin/stats/revenue?groupBy=day`;

      if (useCustomRevenueDate && revenueFromDate && revenueToDate) {
        url += `&from=${revenueFromDate}&to=${revenueToDate}`;
      } else {
        url += `&range=${revenueRange}`;
      }

      const response = await axios.get(url, { withCredentials: true });
      setRevenueStats(response.data);
    } catch (error) {
      console.error("Error fetching revenue stats:", error);
      // Có thể thêm toast notification ở đây
    } finally {
      setRevenueStatsLoading(false);
    }
  }, [useCustomRevenueDate, revenueFromDate, revenueToDate, revenueRange]);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  useEffect(() => {
    fetchRevenueStats();
  }, [fetchRevenueStats]);

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }, []);

  const formatDate = useCallback((date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  }, []);

  // Xử lý labels và datasets cho user chart
  let labels = [];
  let customerData = [];
  let partnerData = [];
  if (userStats?.from && userStats?.to) {
    const dateRange = getDateRange(userStats.from, userStats.to);
    labels = dateRange.map((date) => date.toLocaleDateString("vi-VN"));
    const mapDataToLabels = (dataArr) =>
      dateRange.map((date) => {
        const found = dataArr.find(
          (item) =>
            new Date(item._id.date).toDateString() === date.toDateString()
        );
        return found ? found.count : 0;
      });
    customerData = mapDataToLabels(userStats.data.customer || []);
    partnerData = mapDataToLabels(userStats.data.partner || []);
  }

  // Xử lý labels và datasets cho revenue chart
  let revenueLabels = [];
  let revenueData = [];
  if (revenueStats?.data?.from && revenueStats?.data?.to) {
    const dateRange = getDateRange(
      revenueStats.data.from,
      revenueStats.data.to
    );
    revenueLabels = dateRange.map((date) => date.toLocaleDateString("vi-VN"));
    revenueData = dateRange.map((date) => {
      const found = (revenueStats.data.stats || []).find((item) => {
        if (!item._id) return false;
        // Xử lý cho groupBy=day
        if (item._id.day && item._id.month && item._id.year) {
          return (
            new Date(
              item._id.year,
              item._id.month - 1,
              item._id.day
            ).toDateString() === date.toDateString()
          );
        }
        // Xử lý cho groupBy=week/tháng/năm nếu cần
        return false;
      });
      return found ? found.totalRevenue : 0;
    });
  }

  const userChartData = {
    labels,
    datasets: [
      {
        label: "Khách hàng",
        data: customerData,
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.5)",
      },
      {
        label: "Quản lí",
        data: partnerData,
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
      },
    ],
  };

  const revenueChartData = {
    labels: revenueLabels,
    datasets: [
      {
        label: "Doanh thu",
        data: revenueData,
        borderColor: "rgb(245, 158, 11)",
        backgroundColor: "rgba(245, 158, 11, 0.5)",
      },
    ],
  };

  // Chart options: không cho phép giá trị âm
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
      },
    },
  };

  const handleUserDateApply = useCallback(() => {
    if (userFromDate && userToDate) {
      setUseCustomUserDate(true);
    }
  }, [userFromDate, userToDate]);

  const handleUserDateReset = useCallback(() => {
    setUseCustomUserDate(false);
    setUserFromDate("");
    setUserToDate("");
  }, []);

  const handleRevenueDateApply = useCallback(() => {
    if (revenueFromDate && revenueToDate) {
      setUseCustomRevenueDate(true);
    }
  }, [revenueFromDate, revenueToDate]);

  const handleRevenueDateReset = useCallback(() => {
    setUseCustomRevenueDate(false);
    setRevenueFromDate("");
    setRevenueToDate("");
  }, []);

  const handleTimeRangeChange = useCallback((newRange) => {
    setTimeRange(newRange);
    setUseCustomUserDate(false);
  }, []);

  const handleRevenueRangeChange = useCallback((newRange) => {
    setRevenueRange(newRange);
    setUseCustomRevenueDate(false);
  }, []);

  const handleCustomUserDateToggle = useCallback(() => {
    setUseCustomUserDate(!useCustomUserDate);
  }, [useCustomUserDate]);

  const handleCustomRevenueDateToggle = useCallback(() => {
    setUseCustomRevenueDate(!useCustomRevenueDate);
  }, [useCustomRevenueDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 p-6">
      <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          📊 Dashboard Quản Trị
        </h1>
        <p className="mt-3 text-base text-gray-600 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Thống kê và phân tích dữ liệu hệ thống theo thời gian thực
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Tổng khách hàng"
          value={userStats?.data?.totals?.customer || 0}
          icon={UserGroupIcon}
          loading={userStatsLoading}
        />
        <StatCard
          title="Tổng quản lí"
          value={userStats?.data?.totals?.partner || 0}
          icon={UserIcon}
          loading={userStatsLoading}
        />
        <StatCard
          title="Tổng doanh thu"
          value={formatCurrency(revenueStats?.data?.totalAllRevenue || 0)}
          icon={ShoppingBagIcon}
          loading={revenueStatsLoading}
        />
      </div>

      {/* User Growth Chart */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-3 shadow-lg">
              <UserGroupIcon className="w-6 h-6 text-white" />
            </span>
            Thống kê người dùng
          </h2>
          <div className="flex items-center space-x-4">
            {!useCustomUserDate && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleTimeRangeChange("1d")}
                  disabled={userStatsLoading}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    timeRange === "1d"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 border border-gray-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  📅 Hôm nay
                </button>
                <button
                  onClick={() => handleTimeRangeChange("7d")}
                  disabled={userStatsLoading}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    timeRange === "7d"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 border border-gray-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  📊 7 ngày
                </button>
                <button
                  onClick={() => handleTimeRangeChange("1m")}
                  disabled={userStatsLoading}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    timeRange === "1m"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 border border-gray-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  📈 1 tháng
                </button>
              </div>
            )}
            <button
              onClick={handleCustomUserDateToggle}
              disabled={userStatsLoading}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                useCustomUserDate
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200 hover:border-indigo-300"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {useCustomUserDate ? "✓ Đang tùy chỉnh" : "🔧 Tùy chỉnh ngày"}
            </button>
          </div>
        </div>

        {useCustomUserDate && (
          <div className="mb-4">
            <DateRangePicker
              fromDate={userFromDate}
              toDate={userToDate}
              onFromDateChange={setUserFromDate}
              onToDateChange={setUserToDate}
              onApply={handleUserDateApply}
              onReset={handleUserDateReset}
              loading={userStatsLoading}
            />
          </div>
        )}

        <div className="h-72">
          {userStatsLoading ? (
            <ChartSkeleton />
          ) : (
            <Line data={userChartData} options={chartOptions} />
          )}
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-3 shadow-lg">
              <ShoppingBagIcon className="w-6 h-6 text-white" />
            </span>
            Thống kê doanh thu
          </h2>
          <div className="flex items-center space-x-4">
            {!useCustomRevenueDate && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRevenueRangeChange("day")}
                  disabled={revenueStatsLoading}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    revenueRange === "day"
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 border border-gray-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  📅 Ngày
                </button>
                <button
                  onClick={() => handleRevenueRangeChange("week")}
                  disabled={revenueStatsLoading}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    revenueRange === "week"
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 border border-gray-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  📊 Tuần
                </button>
                <button
                  onClick={() => handleRevenueRangeChange("month")}
                  disabled={revenueStatsLoading}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    revenueRange === "month"
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 border border-gray-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  📈 Tháng
                </button>
              </div>
            )}
            <button
              onClick={handleCustomRevenueDateToggle}
              disabled={revenueStatsLoading}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                useCustomRevenueDate
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200 hover:border-amber-300"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {useCustomRevenueDate ? "✓ Đang tùy chỉnh" : "🔧 Tùy chỉnh ngày"}
            </button>
          </div>
        </div>

        {useCustomRevenueDate && (
          <div className="mb-4">
            <DateRangePicker
              fromDate={revenueFromDate}
              toDate={revenueToDate}
              onFromDateChange={setRevenueFromDate}
              onToDateChange={setRevenueToDate}
              onApply={handleRevenueDateApply}
              onReset={handleRevenueDateReset}
              loading={revenueStatsLoading}
            />
          </div>
        )}

        <div className="h-72">
          {revenueStatsLoading ? (
            <ChartSkeleton />
          ) : (
            <Line data={revenueChartData} options={chartOptions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
