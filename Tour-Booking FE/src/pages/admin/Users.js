import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  UserIcon,
  UsersIcon,
  NoSymbolIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import CreatePartnerModal from "../../components/admin/CreatePartnerModal";

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function Users() {
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreatePartnerModal, setShowCreatePartnerModal] = useState(false);

  // Fetch all users một lần
  const getUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_URL + "admin/users", {
        withCredentials: true,
      });

      if (res.data && res.data.status === "success") {
        setAllUsers(res.data.data.users || []);
      } else {
        throw new Error("Không nhận được dữ liệu từ server");
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách người dùng:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Có lỗi xảy ra khi tải dữ liệu"
      );
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Filter và pagination ở frontend - tính toán trực tiếp
  let result = [...allUsers];

  // Filter by search
  if (search.trim()) {
    const searchLower = search.toLowerCase();
    result = result.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
    );
  }

  // Filter by role
  if (role) {
    result = result.filter((user) => user.role === role);
  }

  // Filter by status
  if (status) {
    result = result.filter((user) => user.active === (status === "true"));
  }

  const total = result.length;
  const activeCount = allUsers.filter((u) => u.active).length;
  const inactiveCount = allUsers.filter((u) => !u.active).length;

  // Pagination
  const startIndex = (page - 1) * limit;
  const filteredUsers = result.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(total / limit);

  // Reset page khi filter thay đổi
  useEffect(() => {
    setPage(1);
  }, [search, role, status]);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const action = currentStatus ? "vô hiệu hóa" : "kích hoạt";
    if (
      !window.confirm(`Bạn có chắc chắn muốn ${action} người dùng này?`)
    )
      return;

    try {
      const response = await axios.patch(
        API_URL + `admin/users/${userId}/toggle-status`,
        {},
        { withCredentials: true }
      );

      if (response.data && response.data.status === "success") {
        alert(`Đã ${action} người dùng thành công!`);
        getUsers();
      }
    } catch (err) {
      console.error("Lỗi khi thay đổi trạng thái người dùng:", err);
      alert(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  // Format role for display (show 'Manager' instead of 'partner')
  const formatRole = (r) => {
    if (!r) return "";
    if (r === "partner") return "Manager";
    return r.charAt(0).toUpperCase() + r.slice(1);
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
        <button onClick={getUsers} className="ml-2 underline">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Tiêu đề + Button tạo tài khoản */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Quản lý người dùng
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Danh sách tất cả người dùng trong hệ thống.
          </p>
        </div>
        <button
          onClick={() => setShowCreatePartnerModal(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm"
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Tạo tài khoản Manager 
        </button>
      </div>

      {/* Thống kê tổng */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tổng người dùng
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {allUsers.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-50 rounded-lg p-3">
              <UsersIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tài khoản active
              </p>
              <p className="text-2xl font-semibold text-green-900">
                {activeCount}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-red-50 rounded-lg p-3">
              <NoSymbolIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tài khoản inactive
              </p>
              <p className="text-2xl font-semibold text-red-900">
                {inactiveCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tìm kiếm + filter */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <FunnelIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Tất cả vai trò</option>
              <option value="customer">Customer</option>
              <option value="partner">Manager</option>
            </select>
          </div>
          <div className="relative">
            <FunnelIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bảng users */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserIcon className="h-6 w-6 text-gray-400 mr-2" />
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-gray-500">{formatRole(user.role)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                        user.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className={`${
                        user.active
                          ? "text-red-600 hover:text-red-800"
                          : "text-green-600 hover:text-green-800"
                      }`}
                      onClick={() =>
                        handleToggleUserStatus(user._id, user.active)
                      }
                      title={user.active ? "Vô hiệu hóa" : "Kích hoạt"}
                    >
                      <NoSymbolIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-sm text-gray-500"
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Hiển thị {filteredUsers.length} / {total} người dùng
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Trước
          </button>
          <span className="px-4 py-1">
            Trang {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Sau
          </button>
        </div>
      </div>

      {/* Create Partner Modal */}
      <CreatePartnerModal
        isOpen={showCreatePartnerModal}
        onClose={() => setShowCreatePartnerModal(false)}
        onSuccess={getUsers}
      />
    </div>
  );
}
