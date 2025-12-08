import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { blogService } from "../../services/blogApi";
import MDEditor from "@uiw/react-md-editor";

const BlogForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "du-lich",
    tags: "",
    status: "published",
    linkedTour: "",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const categories = [
    { value: "du-lich", label: "Du lịch" },
    { value: "am-thuc", label: "Ẩm thực" },
    { value: "khach-san", label: "Khách sạn" },
    { value: "trai-nghiem", label: "Trải nghiệm" },
    { value: "meo-hay", label: "Mẹo hay" },
    { value: "khac", label: "Khác" },
  ];

  useEffect(() => {
    if (isEdit) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoadingData(true);
      const response = await blogService.getBlog(id);
      const blog = response.data.data.blog;
      setFormData({
        title: blog.title,
        content: blog.content,
        category: blog.category,
        tags: blog.tags.join(", "),
        status: blog.status,
        linkedTour: blog.linkedTour?._id || "",
      });
      setPreviewImage(blog.coverImage);
    } catch (error) {
      console.error("Lỗi khi tải blog:", error);
      alert("Không thể tải thông tin blog. Vui lòng thử lại!");
      navigate("/partner/blogs");
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value || "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước ảnh không được vượt quá 5MB!");
        return;
      }
      setCoverImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      alert("Vui lòng nhập tiêu đề blog!");
      return;
    }
    if (!formData.content.trim()) {
      alert("Vui lòng nhập nội dung blog!");
      return;
    }
    if (!isEdit && !coverImage) {
      alert("Vui lòng chọn ảnh bìa!");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("category", formData.category);
      data.append("status", formData.status);

      // Tags: convert string to array
      if (formData.tags.trim()) {
        const tagsArray = formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
        tagsArray.forEach((tag) => data.append("tags[]", tag));
      }

      if (formData.linkedTour) {
        data.append("linkedTour", formData.linkedTour);
      }

      if (coverImage) {
        data.append("coverImage", coverImage);
      }

      if (isEdit) {
        await blogService.updateBlog(id, data);
        alert("Cập nhật blog thành công!");
      } else {
        await blogService.createBlog(data);
        alert("Tạo blog thành công!");
      }

      navigate("/partner/blogs");
    } catch (error) {
      console.error("Lỗi khi lưu blog:", error);
      const errorMessage =
        error.response?.data?.message || "Không thể lưu blog. Vui lòng thử lại!";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {isEdit ? "Chỉnh sửa Blog" : "Tạo Blog Mới"}
        </h1>
        <button
          onClick={() => navigate("/partner/blogs")}
          className="text-gray-600 hover:text-gray-800 font-medium"
        >
          ← Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Nhập tiêu đề blog..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Cover Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ảnh bìa {!isEdit && <span className="text-red-500">*</span>}
            <span className="text-gray-500 text-xs ml-2">(Tối đa 5MB)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {previewImage && (
            <div className="mt-4">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Danh mục <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
            <span className="text-gray-500 text-xs ml-2">
              (Phân cách bằng dấu phẩy)
            </span>
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="Ví dụ: du lịch, khám phá, Việt Nam"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung <span className="text-red-500">*</span>
          </label>
          <div data-color-mode="light">
            <MDEditor
              value={formData.content}
              onChange={handleContentChange}
              height={400}
              preview="edit"
            />
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="published"
                checked={formData.status === "published"}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span>Xuất bản ngay</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={formData.status === "draft"}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span>Lưu nháp</span>
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate("/partner/blogs")}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
