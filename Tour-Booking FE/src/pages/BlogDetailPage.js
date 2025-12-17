import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MDEditor from "@uiw/react-md-editor";

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}blogs/public/${slug}`
      );
      setBlog(response.data.data.blog);
    } catch (error) {
      console.error("Lỗi khi tải blog:", error);
      alert("Không thể tải blog. Vui lòng thử lại!");
      navigate("/blogs");/*.*/
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
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <button
            onClick={() => navigate("/blogs")}
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
        </div>
      </div>

      {/* Blog Content */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
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
        </div>

        {/* Cover Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Content */}
        <div className="mb-8" data-color-mode="light">
          <MDEditor.Markdown source={blog.content} style={{ fontSize: "18px" }} />
        </div>
      </article>
    </div>
  );
};

export default BlogDetailPage;
