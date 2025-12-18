import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  UserIcon,
  EyeIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const AllBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const getAllBlogs = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}admin/blogs?limit=1000`,
        { withCredentials: true }
      );
      if (res.data && res.data.status === "success") {
        setAllBlogs(res.data.data.blogs || []);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách tất cả blogs:", err);
    }
  }, []);

  useEffect(() => {
    getAllBlogs();
  }, [getAllBlogs]);

  const fetchBlogs = useCallback(async () => {
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

      if (category) {
        params.append("category", category);
      }

      if (status) {
        params.append("status", status);
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}admin/blogs?${params.toString()}`,
        { withCredentials: true }
      );
      if (response.data && response.data.status === "success") {
        setBlogs(response.data.data.blogs || []);
        setTotal(response.data.total || 0);
        setTotalPages(response.data.totalPages || 1);
      } else {
        throw new Error("Không nhận được dữ liệu từ server");
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Có lỗi xảy ra khi tải dữ liệu"
      );
      setBlogs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, category, status]);

  const uniqueCategories = [...new Set(allBlogs.map((blog) => blog.category))];

  const uniqueAuthors = [
    ...new Map(
      allBlogs.map((blog) => [blog.author?._id, blog.author])
    ).values(),
  ];

  useEffect(() => {
    setPage(1);
  }, [search, category, status]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusColor = (status) => {
    return status === "published"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const getStatusLabel = (status) => {
    return status === "published" ? "Đã xuất bản" : "Nháp";
  };

  const getCategoryLabel = (category) => {
    const labels = {
      "du-lich": "Du lịch",
      "am-thuc": "Ẩm thực",
      "khach-san": "Khách sạn",
      "trai-nghiem": "Trải nghiệm",
      "meo-hay": "Mẹo hay",
      khac: "Khác",
    };
    return labels[category] || category;
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
        <button onClick={fetchBlogs} className="ml-2 underline">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý Blog</h1>
          <p className="mt-2 text-sm text-gray-700">
            Danh sách tất cả các bài viết blog trên hệ thống.
          </p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C6.228 6.228 2 10.228 2 15s4.228 8.772 10 8.772 10-4.228 10-8.772c0-4.772-4.228-8.747-10-8.747z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng blog</p>
              <p className="text-2xl font-semibold text-gray-900">{total}</p>
            </div>
          </div>
        </div>

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
              <p className="text-sm font-medium text-gray-600">Đã xuất bản</p>
              <p className="text-2xl font-semibold text-gray-900">
                {blogs.filter((b) => b.status === "published").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-50 rounded-lg p-3">
              <UserIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tác giả</p>
              <p className="text-2xl font-semibold text-gray-900">
                {uniqueAuthors.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                autoFocus
                type="text"
                placeholder="Tìm kiếm blog theo tiêu đề"
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

          <select
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Tất cả danh mục</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {getCategoryLabel(cat)}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Nháp</option>
          </select>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Blog
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tác giả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Danh mục
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thống kê
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày xuất bản
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <tr
                  key={blog._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/admin/blogs/${blog._id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-20">
                        <img
                          className="h-16 w-20 rounded object-cover"
                          src={
                            blog.coverImage ||
                            "https://cms.thainguyen.vn/documents/1329041/1915066/z527537637754908ec35d961fff16cb9f99403c24ee346-17111505090201124212868.jpg/a99a33a5-9036-4c86-938e-20de87abc65f?t=1711240593600"
                          }
                          alt={blog.title}
                          onError={(e) => {
                            e.target.src =
                              "https://cms.thainguyen.vn/documents/1329041/1915066/z527537637754908ec35d961fff16cb9f99403c24ee346-17111505090201124212868.jpg/a99a33a5-9036-4c86-938e-20de87abc65f?t=1711240593600";
                          }}
                        />
                      </div>
                      <div className="ml-4 max-w-xs">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {blog.title}
                        </div>
                        <div className="text-sm text-gray-500">{blog.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {blog.author?.name || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {blog.author?.email || ""}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {getCategoryLabel(blog.category)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        blog.status
                      )}`}
                    >
                      {getStatusLabel(blog.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <EyeIcon className="w-4 h-4" />
                        <span className="text-sm">{blog.views || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <HeartIcon className="w-4 h-4" />
                        <span className="text-sm">
                          {blog.likesCount || blog.likes?.length || 0}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {formatDate(blog.publishedAt)}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Không có blog nào
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
            Hiển thị {blogs.length} trên tổng số {total} blog
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

export default AllBlogsPage;
