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
import ExportExcelButton from "./ExportExcel/ExportExcelButton";

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
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {loading ? (
          <div className="animate-pulse bg-gray-200 h-8 w-20 rounded mt-1"></div>
        ) : (
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        )}
      </div>
      <div className="bg-indigo-50 rounded-lg p-3">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
    </div>
    {trend && !loading && (
      <div className="mt-4">
        <span
          className={`text-sm ${trend === "up" ? "text-green-600" : "text-red-600"}`}
        >
          {trend === "up" ? "↑" : "↓"} {trendValue}
        </span>
        <span className="text-sm text-gray-500 ml-2">vs last period</span>
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
  <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
    <div className="flex items-center space-x-2">
      <CalendarIcon className="w-5 h-5 text-gray-500" />
      <span className="text-sm font-medium text-gray-700">Từ:</span>
      <input
        type="date"
        value={fromDate}
        onChange={(e) => onFromDateChange(e.target.value)}
        disabled={loading}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700">Đến:</span>
      <input
        type="date"
        value={toDate}
        onChange={(e) => onToDateChange(e.target.value)}
        disabled={loading}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
    <button
      onClick={onApply}
      disabled={loading || !fromDate || !toDate}
      className="px-4 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {loading ? "Đang tải..." : "Áp dụng"}
    </button>
    <button
      onClick={onReset}
      disabled={loading}
      className="px-4 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      Đặt lại
    </button>
  </div>
);

// Loading Skeleton cho Chart
const ChartSkeleton = () => (
  <div className="h-72 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
      <p className="text-gray-500">Đang tải dữ liệu...</p>
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
  const [revenueExcelData, setRevenueExcelData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  const fetchRevenue = useCallback(async () => {
    try {
      let url = `${process.env.REACT_APP_BACKEND_URL}admin/all-bookings?year=${selectedYear}`;
      const response = await axios.get(url, { withCredentials: true });

      const prepareData =
        response.data?.data?.map((item, index) => {
          return {
            STT: index + 1,
            "Tên chuyến đi": item?.tour?.name,
            "Tóm tắt": item?.tour?.summary,
            "Người đặt vé": item?.user?.name,
            "Email người đặt": item?.user?.email,
            "Giá tiền vé": item?.tour?.price,
            "Số lượng vé": item?.numberOfPeople,
            "Tổng giá tiền": item?.price,
            "Ngày bắt đầu": new Date(item?.startDate).toLocaleDateString("vi-VN"),
            "Trạng thái thanh toán": item?.paid
              ? "Đã thanh toán"
              : "Chưa thanh toán",
            "Ngày tạo": new Date(item?.createdAt).toLocaleDateString("vi-VN"),
          };
        }) || [];
      setRevenueExcelData(prepareData);
    } catch (error) {
      console.error("Error fetching revenue stats:", error);
    }
  }, [selectedYear]);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  useEffect(() => {
    fetchRevenueStats();
  }, [fetchRevenueStats]);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

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
        label: "Đối tác",
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
    <div className="p-6">
      <div className="mb-8 relative">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Thống kê và phân tích dữ liệu hệ thống
        </p>
        <div className="absolute top-0 right-0 flex items-center space-x-2">
          Chọn năm:{" "}
          <select
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border ml-2 px-3 py-2 rounded"
          >
            {Array.from(
              { length: new Date().getFullYear() - 2020 + 1 },
              (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              }
            )}
          </select>
          <ExportExcelButton
            fileName={"Revenue report of year " + selectedYear}
            data={revenueExcelData}
          />
        </div>
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
          title="Tổng đối tác"
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
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Thống kê người dùng
          </h2>
          <div className="flex items-center space-x-4">
            {!useCustomUserDate && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleTimeRangeChange("1d")}
                  disabled={userStatsLoading}
                  className={`px-3 py-1 text-sm rounded-md ${
                    timeRange === "1d"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Hôm nay
                </button>
                <button
                  onClick={() => handleTimeRangeChange("7d")}
                  disabled={userStatsLoading}
                  className={`px-3 py-1 text-sm rounded-md ${
                    timeRange === "7d"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  7 ngày
                </button>
                <button
                  onClick={() => handleTimeRangeChange("1m")}
                  disabled={userStatsLoading}
                  className={`px-3 py-1 text-sm rounded-md ${
                    timeRange === "1m"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  1 tháng
                </button>
              </div>
            )}
            <button
              onClick={handleCustomUserDateToggle}
              disabled={userStatsLoading}
              className={`px-3 py-1 text-sm rounded-md ${
                useCustomUserDate
                  ? "bg-green-50 text-green-600"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {useCustomUserDate ? "Đang dùng tùy chỉnh" : "Tùy chỉnh ngày"}
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
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Thống kê doanh thu
          </h2>
          <div className="flex items-center space-x-4">
            {!useCustomRevenueDate && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRevenueRangeChange("day")}
                  disabled={revenueStatsLoading}
                  className={`px-3 py-1 text-sm rounded-md ${
                    revenueRange === "day"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Ngày
                </button>
                <button
                  onClick={() => handleRevenueRangeChange("week")}
                  disabled={revenueStatsLoading}
                  className={`px-3 py-1 text-sm rounded-md ${
                    revenueRange === "week"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Tuần
                </button>
                <button
                  onClick={() => handleRevenueRangeChange("month")}
                  disabled={revenueStatsLoading}
                  className={`px-3 py-1 text-sm rounded-md ${
                    revenueRange === "month"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Tháng
                </button>
              </div>
            )}
            <button
              onClick={handleCustomRevenueDateToggle}
              disabled={revenueStatsLoading}
              className={`px-3 py-1 text-sm rounded-md ${
                useCustomRevenueDate
                  ? "bg-green-50 text-green-600"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {useCustomRevenueDate ? "Đang dùng tùy chỉnh" : "Tùy chỉnh ngày"}
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
