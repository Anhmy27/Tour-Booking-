import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blogService } from "../../services/blogApi";
import MDEditor from "@uiw/react-md-editor";
import BlogFormModal from "./BlogFormModal";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlog(id);
      setBlog(response.data.data.blog);
      
      // Tăng view count
      await blogService.incrementView(id);
    } catch (error) {
      console.error("Lỗi khi tải blog:", error);
      alert("Không thể tải blog. Vui lòng thử lại!");
      navigate("/partner/blogs");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (value) => {
    const categories = {
      "du-lich": "Du lịch",
      "am-thuc": "Ẩm thực",
      "khach-san": "Khách sạn",
      "trai-nghiem": "Trải nghiệm",
      "meo-hay": "Mẹo hay",
      "khac": "Khác",
    };
    return categories[value] || value;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    fetchBlog(); // Reload blog data
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Không tìm thấy blog</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Actions */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-4xl">
          <button
            onClick={() => navigate("/partner/blogs")}
            className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Quay lại
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Status Badge */}
        <div className="mb-4">
          <span
            className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
              blog.status === "published"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {blog.status === "published" ? "Đã xuất bản" : "Bản nháp"}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {blog.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6 pb-6 border-b">
          <span className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            {getCategoryLabel(blog.category)}
          </span>
          <span className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formatDate(blog.publishedAt || blog.createdAt)}
          </span>
          <span className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            {blog.views} lượt xem
          </span>
        </div>

        {/* Cover Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mb-8" data-color-mode="light">
          <MDEditor.Markdown source={blog.content} />
        </div>

        {/* Linked Tour */}
        {blog.linkedTour && (
          <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tour liên quan
            </h3>
            <p className="text-gray-700">{blog.linkedTour.name}</p>
            <button
              onClick={() => navigate(`/tours/${blog.linkedTour._id}`)}
              className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
            >
              Xem chi tiết tour →
            </button>
          </div>
        )}

        {/* Author Info */}
        {blog.author && (
          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {blog.author.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-gray-500">Tác giả</p>
                <p className="text-lg font-semibold text-gray-900">
                  {blog.author.name}
                </p>
              </div>
            </div>
          </div>
        )}
      </article>

      {/* Edit Modal */}
      {showEditModal && (
        <BlogFormModal
          blog={blog}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default BlogDetail;
