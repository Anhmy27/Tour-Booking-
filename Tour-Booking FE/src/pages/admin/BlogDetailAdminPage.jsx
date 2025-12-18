import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MDEditor from "@uiw/react-md-editor";
import {
  ArrowLeftIcon,
  CalendarIcon,
  EyeIcon,
  HeartIcon,
  DocumentIcon,
  TagIcon,
  UserIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const BlogDetailAdminPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}admin/blogs/${id}`,
        { withCredentials: true }
      );
      if (response.data && response.data.status === "success") {
        setBlog(response.data.data.blog || response.data.data);
      } else {
        throw new Error("Không nhận được dữ liệu từ server");
      }
    } catch (error) {
      console.error("Lỗi khi tải blog:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Không thể tải blog. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDeleteBlog = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}admin/blogs/${id}`,
        { withCredentials: true }
      );
      alert("Bài blog đã được xóa thành công");
      navigate("/admin/blogs");
    } catch (error) {
      console.error("Lỗi khi xóa blog:", error);
      alert(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi xóa blog. Vui lòng thử lại!"
      );
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  const getCategoryLabel = (value) => {
    const categories = {
      "du-lich": "Du lịch",
      "am-thuc": "Ẩm thực",
      "khach-san": "Khách sạn",
      "trai-nghiem": "Trải nghiệm",
      "meo-hay": "Mẹo hay",
      khac: "Khác",
    };
    return categories[value] || value;
  };

  const getStatusLabel = (status) => {
    return status === "published" ? "Đã xuất bản" : "Nháp";
  };

  const getStatusColor = (status) => {
    return status === "published"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/admin/blogs")}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Quay lại danh sách
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Lỗi</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/admin/blogs")}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Quay lại danh sách
        </button>
        <div className="text-center text-gray-500">Không tìm thấy blog</div>
      </div>
    );
  }

  const images = blog.images && blog.images.length > 0 ? blog.images : [];
  const mainImage = blog.coverImage || images[0];

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/admin/blogs")}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Quay lại danh sách
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title and Basic Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {blog.title}
              </h1>
              <p className="text-gray-600 text-sm mb-4">Slug: {blog.slug}</p>

              {/* Status */}
              <div className="mb-4">
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                    blog.status
                  )}`}
                >
                  {getStatusLabel(blog.status)}
                </span>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    Danh mục
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {getCategoryLabel(blog.category)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider flex items-center gap-1">
                    <EyeIcon className="w-4 h-4" />
                    Lượt xem
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {blog.views || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider flex items-center gap-1">
                    <HeartIcon className="w-4 h-4" />
                    Lượt thích
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {blog.likesCount || blog.likes?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    Ngôn ngữ
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    Tiếng Việt
                  </p>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            {mainImage && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Ảnh bìa
                </h3>
                <img
                  src={mainImage}
                  alt={blog.title}
                  className="w-full h-auto rounded-lg object-cover max-h-96"
                  onError={(e) => {
                    e.target.src =
                      "https://mia.vn/media/uploads/blog-du-lich/lang-khai-dinh-tram-mac-duoi-dong-thoi-gian-qua-lang-kinh-cua-anh-truong-bui-4-1664319940.jpg";
                  }}
                />
              </div>
            )}

            {/* Images Gallery */}
            {images.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Hình ảnh
                </h3>
                <div className="space-y-4">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="border rounded-lg overflow-hidden"
                    >
                      <img
                        src={img}
                        alt={`${blog.title} ${idx + 1}`}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/800x400?text=No+Image";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Nội dung</h3>
              <div
                className="prose prose-sm max-w-none"
                data-color-mode="light"
              >
                <MDEditor.Markdown
                  source={blog.content}
                  style={{ fontSize: "16px" }}
                />
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TagIcon className="w-5 h-5" />
                  Tags
                </h3>
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Author Info */}
            {blog.author && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6 top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Tác giả
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {blog.author.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {blog.author.name}
                    </p>
                    <p className="text-sm text-gray-600">{blog.author.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Publish Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Thông tin xuất bản
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    Ngày xuất bản
                  </p>
                  <p className="text-gray-900 mt-1">
                    {formatDate(blog.publishedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    Ngày tạo
                  </p>
                  <p className="text-gray-900 mt-1">
                    {formatDate(blog.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    Cập nhật lần cuối
                  </p>
                  <p className="text-gray-900 mt-1">
                    {formatDate(blog.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Linked Tour */}
            {blog.linkedTour && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DocumentIcon className="w-5 h-5" />
                  Tour liên quan
                </h3>
                {typeof blog.linkedTour === "object" ? (
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <p className="font-semibold text-gray-900">
                      {blog.linkedTour.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      ID: {blog.linkedTour._id}
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <p className="text-sm text-gray-600">
                      ID: {blog.linkedTour}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Blog Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Thống kê</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">ID Blog</span>
                  <span className="text-sm font-mono text-gray-900 truncate ml-2">
                    {blog._id}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Trạng thái</span>
                  <span
                    className={`text-sm font-semibold ${getStatusColor(blog.status)}`}
                  >
                    {getStatusLabel(blog.status)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Độ dài nội dung</span>
                  <span className="text-gray-900">
                    {blog.content?.length || 0} ký tự
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => !isDeleting && setIsModalOpen(false)}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon
                    className="h-6 w-6 text-red-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Xóa bài blog
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Bạn có chắc chắn muốn xóa bài blog này không? Hành động
                      này không thể được hoàn tác.
                    </p>
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      Blog: {blog.title}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={isDeleting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  onClick={handleDeleteBlog}
                >
                  {isDeleting ? "Đang xóa..." : "Xóa"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
                  onClick={() => !isDeleting && setIsModalOpen(false)}
                  disabled={isDeleting}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetailAdminPage;
