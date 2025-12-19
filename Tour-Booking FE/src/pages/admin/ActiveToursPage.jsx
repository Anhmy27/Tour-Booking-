import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import {
  MagnifyingGlassIcon,
  UserIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const ActiveToursPage = () => {
  const [activeTours, setActiveTours] = useState([]);
  const [allTours, setAllTours] = useState([]);
  const [search, setSearch] = useState("");
  const [partner, setPartner] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const getAllTours = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}admin/activeTours?limit=1000`,
        { withCredentials: true }
      );
      if (res.data && res.data.status === "success") {
        setAllTours(res.data.data.tours || []);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách tất cả tours:", err);
    }
  }, []);

  useEffect(() => {
    getAllTours();
  }, [getAllTours]);

  const fetchActiveTours = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
      });

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (partner) {
        params.append("partner", partner);
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}admin/activeTours?${params.toString()}`,
        { withCredentials: true }
      );
      if (response.data && response.data.status === "success") {
        setActiveTours(response.data.data.tours || []);
        setTotal(response.data.total || 0);
        setTotalPages(response.data.totalPages || 1);
      } else {
        throw new Error("Không nhận được dữ liệu từ server");
      }
    } catch (err) {
      console.error("Error fetching active tours:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Có lỗi xảy ra khi tải dữ liệu"
      );
      setActiveTours([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, partner]);

  const uniquePartners = [
    ...new Map(
      allTours.map((tour) => [tour.partner?._id, tour.partner])
    ).values(),
  ];

  useEffect(() => {
    setPage(1);
  }, [search, partner]);

  useEffect(() => {
    fetchActiveTours();
  }, [fetchActiveTours]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-yellow-500";
    if (rating >= 4) return "text-yellow-400";
    if (rating >= 3) return "text-yellow-300";
    return "text-gray-300";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        {error}
        <button onClick={fetchActiveTours} className="ml-2 underline">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Quản lý Tour hoạt động
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Danh sách các tour đang hoạt động trên hệ thống.
          </p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-50 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tổng tour hoạt động
              </p>
              <p className="text-2xl font-semibold text-gray-900">{total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Quản lý</p>
              <p className="text-2xl font-semibold text-gray-900">
                {uniquePartners.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-50 rounded-lg p-3">
              <StarIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Đánh giá trung bình
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {activeTours.length > 0
                  ? (
                      activeTours.reduce(
                        (sum, t) => sum + (t.ratingsAverage || 0),
                        0
                      ) / activeTours.length
                    ).toFixed(1)
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                autoFocus
                type="text"
                placeholder="Tìm kiếm theo tên tour, mô tả"
                defaultValue={search}
                onChange={(e) => {
                  setPage(1);
                  setTimeout(() => {
                    setSearch(e.target.value);
                  }, 1000);
                }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={partner}
                onChange={(e) => {
                  setPage(1);
                  setPartner(e.target.value);
                }}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Tất cả quản lý</option>
                {uniquePartners.map((p) => (
                  <option key={p?._id} value={p?._id}>
                    {p?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tours Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tour
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thông tin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Manager
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đánh giá
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activeTours.length > 0 ? (
              activeTours.map((tour) => (
                <tr key={tour._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-20 w-20">
                        <img
                          className="h-20 w-20 rounded-lg object-cover"
                          src={
                            tour?.images[0] ||
                            "https://nguoiduatin.mediacdn.vn/84137818385850368/2025/5/25/du-lich-he-1748141542277286017373.jpg"
                          }
                          alt={tour.name}
                          onError={(e) => {
                            e.target.src =
                              "https://nguoiduatin.mediacdn.vn/84137818385850368/2025/5/25/du-lich-he-1748141542277286017373.jpg";
                          }}
                        />
                      </div>
                      <div className="ml-4 cursor-pointer" onClick={() => navigate(`/admin/active-tours/${tour._id}`)}>
                        <div className="text-sm font-medium text-gray-900">
                          {tour.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {tour.summary}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">
                        Thời gian: {tour.duration} ngày
                      </div>
                      <div>Số lượng: {tour.maxGroupSize} người</div>
                      <div className="truncate">
                        Địa điểm: {tour.startLocation?.address}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium">
                      {tour.partner?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {tour.partner?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(tour.price)}
                    </div>
                    {tour.priceDiscount > 0 && (
                      <div className="text-xs text-red-600">
                        Giảm: {tour.priceDiscount}%
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(tour.ratingsAverage || 0)
                                ? getRatingColor(tour.ratingsAverage)
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-900">
                        {tour.ratingsAverage?.toFixed(1) || 0}
                      </div>
                      <div className="text-xs text-gray-500">
                        ({tour.ratingsQuantity || 0})
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Không có tour hoạt động nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-700">
            Hiển thị {activeTours.length} trên tổng số {total} tour
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Trước
            </button>
            <div className="flex items-center px-4">
              Trang {page} / {totalPages}
            </div>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page >= totalPages}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveToursPage;
