import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { blogService } from "../../services/blogApi";
import BlogFormModal from "./BlogFormModal";
import Sidebar from "../../layouts/partner/Sidebar";
import Header from "../../layouts/partner/Header";

const BlogManagement = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    search: "",
    sort: "-createdAt",
  });

  const categories = [
    { value: "", label: "Tất cả danh mục" },
    { value: "du-lich", label: "Du lịch" },
    { value: "am-thuc", label: "Ẩm thực" },
    { value: "khach-san", label: "Khách sạn" },
    { value: "trai-nghiem", label: "Trải nghiệm" },
    { value: "meo-hay", label: "Mẹo hay" },
    { value: "khac", label: "Khác" },
  ];

  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "draft", label: "Bản nháp" },
    { value: "published", label: "Đã xuất bản" },
  ];

  const sortOptions = [
    { value: "-createdAt", label: "Mới nhất" },
    { value: "createdAt", label: "Cũ nhất" },
    { value: "-views", label: "Nhiều lượt xem" },
    { value: "title", label: "Tên A-Z" },
    { value: "-title", label: "Tên Z-A" },
  ];

  useEffect(() => {
    fetchBlogs();
  }, [filters]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;

      const response = await blogService.getMyBlogs(params);
      setBlogs(response.data.data.blogs);
    } catch (error) {
      console.error("Lỗi khi tải danh sách blog:", error);
      alert("Không thể tải danh sách blog. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Bạn có chắc muốn xóa blog "${title}"?`)) {
      try {
        await blogService.deleteBlog(id);
        alert("Xóa blog thành công!");
        fetchBlogs();
      } catch (error) {
        console.error("Lỗi khi xóa blog:", error);
        alert("Không thể xóa blog. Vui lòng thử lại!");
      }
    }
  };

  const handleToggleStatus = async (blog) => {
    try {
      const newStatus = blog.status === "published" ? "draft" : "published";
      await blogService.updateBlog(blog._id, { status: newStatus });
      alert(`Blog đã được ${newStatus === "published" ? "hiển thị" : "ẩn"} thành công!`);
      fetchBlogs();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái blog:", error);
      alert("Không thể cập nhật trạng thái. Vui lòng thử lại!");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getCategoryLabel = (value) => {
    const cat = categories.find((c) => c.value === value);
    return cat ? cat.label : value;
  };

  const handleCreateClick = () => {
    setEditingBlog(null);
    setShowModal(true);
  };

  const handleEditClick = (blog) => {
    setEditingBlog(blog);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBlog(null);
  };

  const handleSaveSuccess = () => {
    setShowModal(false);
    setEditingBlog(null);
    fetchBlogs();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-white">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Quản Lý Blog</h1>
              <p className="text-lg md:text-xl text-blue-100">
                Chia sẻ kinh nghiệm, bí quyết du lịch với cộng đồng
              </p>
              <div className="mt-4 flex justify-center">
                <div className="h-1 w-32 bg-white/30 rounded"></div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex gap-3">
                {/* Category Tabs */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterChange("status", option.value)}
                      className={`px-6 py-2 rounded-md font-medium transition-all ${
                        filters.status === option.value
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleCreateClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tạo Blog Mới
              </button>
            </div>

            {/* Filters Row */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Tìm kiếm blog..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Category */}
                <div>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Blog List */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                <p className="mt-4 text-gray-600 text-lg">Đang tải...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center">
                <svg
                  className="mx-auto h-20 w-20 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-6 text-2xl font-semibold text-gray-900">
                  Chưa có blog nào
                </h3>
                <p className="mt-2 text-gray-500 text-lg">
                  Bắt đầu chia sẻ câu chuyện của bạn với cộng đồng
                </p>
                <button
                  onClick={handleCreateClick}
                  className="mt-8 inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tạo Blog Đầu Tiên
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group border border-gray-100"
                  >
                    {/* Cover Image */}
                    <div className="relative h-56 bg-gray-200 overflow-hidden">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Logo Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <img
                            src="/assets/fvivu.png"
                            alt="logo"
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                      </div>
                      {/* Status Toggle Badge */}
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={() => handleToggleStatus(blog)}
                          className={`px-4 py-2 text-xs font-bold rounded-full shadow-lg transition-all ${
                            blog.status === "published"
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-gray-800 text-white hover:bg-gray-900"
                          }`}
                          title={blog.status === "published" ? "Bấm để ẩn" : "Bấm để hiển thị"}
                        >
                          {blog.status === "published" ? "● Đang hiển thị" : "○ Đang ẩn"}
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Category & Date */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full">
                          {getCategoryLabel(blog.category)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[3.5rem]">
                        {blog.title}
                      </h3>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {blog.views} lượt xem
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => navigate(`/partner/blogs/${blog._id}`)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Xem
                        </button>
                        <button
                          onClick={() => handleEditClick(blog)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id, blog.title)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <BlogFormModal
          blog={editingBlog}
          onClose={handleCloseModal}
          onSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
};

export default BlogManagement;
