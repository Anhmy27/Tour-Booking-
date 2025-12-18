import React, { useEffect, useState, useCallback, Fragment } from "react";
import axios from "axios";
import { debounce } from "lodash";
import {
  MapIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function PendingTours() {
  const [tours, setTours] = useState([]);
  const [allTours, setAllTours] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [partner, setPartner] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  // no approve/reject flow — admin views active tours only

  const getAllTours = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}admin/activeTours/all`,
        {
          withCredentials: true,
        }
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
  }, []);

  const getTours = useCallback(async () => {
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

      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}admin/activeTours?${params.toString()}`,
        {
          withCredentials: true,
        }
      );

      if (res.data && res.data.status === "success") {
        setTours(res.data.data.tours || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      } else {
        throw new Error("Không nhận được dữ liệu từ server");
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách tour:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Có lỗi xảy ra khi tải dữ liệu"
      );
      setTours([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, partner]);

  const uniquePartners = [
    ...new Set(allTours.map((tour) => tour.partner?._id)),
  ]
    .filter(Boolean)
    .map((partnerId) => {
      const tour = allTours.find((t) => t.partner && t.partner._id === partnerId);
      return tour.partner;
    });

  const debouncedSearch = useCallback(
    debounce((callback) => {
      callback();
    }, 500),
    []
  );

  useEffect(() => {
    const searchHandler = () => {
      debouncedSearch(getTours);
    };

    searchHandler();

    return () => {
      debouncedSearch.cancel();
    };
  }, [getTours, debouncedSearch]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // approve/reject removed — no action handlers

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
        <button onClick={getTours} className="ml-2 underline">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
              <h1 className="text-2xl font-semibold text-gray-900">Quản lý Tour</h1>
              <p className="mt-2 text-sm text-gray-700">Danh sách các tour trạng thái active. Dùng bộ lọc để tìm và xem chi tiết.</p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-50 rounded-lg p-3">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng tour (active)</p>
              <p className="text-2xl font-semibold text-gray-900">{total}</p>
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
                type="text"
                placeholder="Tìm kiếm theo tên tour, mô tả"
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
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
                <option value="">Tất cả đối tác</option>
                {uniquePartners.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
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
                Partner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {/* Actions removed — view/detail only */}
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tours.length > 0 ? (
              tours.map((tour) => (
                <tr key={tour._id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-20 w-20">
                        <img
                          className="h-20 w-20 rounded-lg object-cover"
                          src={tour.imageCover}
                          alt={tour.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {tour.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {tour.summary}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>Thời gian: {tour.duration} ngày</div>
                      <div>Số lượng: {tour.maxGroupSize} người</div>
                      <div>Địa điểm: {tour.startLocation.address}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {tour.partner?.name || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {tour.partner?.email || ""}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(tour.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => window.location.assign(`/admin/active-tours/${tour._id}`)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Không có tour nào đang chờ duyệt
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-700">
          Hiển thị {tours.length} trên tổng số {total} tour
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

      {/* approve/reject removed */}
    </div>
  );
}
