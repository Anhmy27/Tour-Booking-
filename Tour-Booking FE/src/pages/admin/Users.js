import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import {
  UserGroupIcon,
  UserIcon,
  UsersIcon,
  NoSymbolIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

// Hàm build URL đảm bảo có dấu "/" đúng
const buildUrl = (path) => {
  const base = process.env.REACT_APP_BACKEND_URL || "";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreatePartnerModal, setShowCreatePartnerModal] = useState(false);
  const [partnerForm, setPartnerForm] = useState({
    name: "",
    email: "",
    description: "",
  });
  const [createLoading, setCreateLoading] = useState(false);

  const getUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
      });

      if (search.trim()) params.append("search", search.trim());
      if (role) params.append("role", role);
      if (status) params.append("status", status);

      const res = await axios.get(
        buildUrl(`admin/users?${params.toString()}`),
        { withCredentials: true }
      );

      if (res.data && res.data.status === "success") {
        setUsers(res.data.data.users || []);
        setTotal(res.data.total || 0);
        console.log(res.data);
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
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, role, status]);

  const debouncedSearch = useCallback(
    debounce((callback) => {
      callback();
    }, 500),
    []
  );

  useEffect(() => {
    const searchHandler = () => {
      debouncedSearch(getUsers);
    };

    searchHandler();

    return () => {
      debouncedSearch.cancel();
    };
  }, [getUsers, debouncedSearch]);

  const handleCreatePartner = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const response = await axios.post(
        buildUrl("admin/createPartner"),
        partnerForm,
        {
          withCredentials: true,
        }
      );

      if (response.data && response.data.status === "success") {
        alert("Tạo tài khoản đối tác thành công!");
        setShowCreatePartnerModal(false);
        setPartnerForm({ name: "", email: "", description: "" });
        getUsers();
      }
    } catch (err) {
      console.error("Lỗi khi tạo tài khoản đối tác:", err);
      alert(
        err.response?.data?.message || "Có lỗi xảy ra khi tạo tài khoản đối tác"
      );
    } finally {
      setCreateLoading(false);
    }
  };

  const handleBanUser = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn cấm người dùng này?")) return;

    try {
      const response = await axios.patch(
        buildUrl(`admin/users/${userId}/ban`),
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data && response.data.status === "success") {
        alert("Đã cấm người dùng thành công!");
        getUsers();
      }
    } catch (err) {
      console.error("Lỗi khi cấm người dùng:", err);
      alert(err.response?.data?.message || "Có lỗi xảy ra khi cấm người dùng");
    }
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
          Tạo tài khoản đối tác
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
              <p className="text-2xl font-semibold text-gray-900">{total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tìm kiếm + filter */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="relative">
          <FunnelIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
          <select
            value={role}
            onChange={(e) => {
              setPage(1);
              setRole(e.target.value);
            }}
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Tất cả vai trò</option>
            <option value="customer">Customer</option>
            <option value="partner">Partner</option>
          </select>
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
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserIcon className="h-6 w-6 text-gray-400 mr-2" />
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-gray-500">{user.role}</td>
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
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleBanUser(user._id)}
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
          Hiển thị {users.length} / {total} người dùng
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Trước
          </button>
          <span className="px-4 py-1">Trang {page}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={users.length < limit}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>

      {/* Create Partner Modal */}
      {showCreatePartnerModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => !createLoading && setShowCreatePartnerModal(false)}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                  <UserPlusIcon
                    className="h-6 w-6 text-indigo-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Tạo tài khoản đối tác mới
                  </h3>
                  <div className="mt-2">
                    <form onSubmit={handleCreatePartner} className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Tên đối tác
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={partnerForm.name}
                          onChange={(e) =>
                            setPartnerForm({
                              ...partnerForm,
                              name: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          value={partnerForm.email}
                          onChange={(e) =>
                            setPartnerForm({
                              ...partnerForm,
                              email: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Mô tả
                        </label>
                        <textarea
                          name="description"
                          id="description"
                          required
                          rows={3}
                          value={partnerForm.description}
                          onChange={(e) =>
                            setPartnerForm({
                              ...partnerForm,
                              description: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={createLoading}
                          className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm ${
                            createLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {createLoading ? "Đang tạo..." : "Tạo tài khoản"}
                        </button>
                        <button
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                          onClick={() =>
                            !createLoading && setShowCreatePartnerModal(false)
                          }
                          disabled={createLoading}
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
