import React, { useState, useEffect } from "react";
import { blogService } from "../../services/blogApi";
import MDEditor from "@uiw/react-md-editor";
import axios from "axios";

const BlogFormModal = ({ blog, onClose, onSuccess }) => {
  const isEdit = Boolean(blog);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "du-lich",
    status: "published",
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
    if (blog) {
      setFormData({
        title: blog.title,
        content: blog.content,
        category: blog.category,
        status: blog.status,
      });
      setPreviewImage(blog.coverImage);
    }
  }, [blog]);

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
      if (!file.type.startsWith("image/")) {
  alert("Không phải file ảnh");
  return;
}
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước ảnh không được vượt quá 5MB!");
        return;
      }
      setCoverImage(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setCoverImage(null);
      setPreviewImage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      if (coverImage) {
        data.append("coverImage", coverImage);
      }

      if (isEdit) {
        await blogService.updateBlog(blog._id, data);
        alert("Cập nhật blog thành công!");
      } else {
        await blogService.createBlog(data);
        alert("Tạo blog thành công!");
      }

      onSuccess();
    } catch (error) {
      console.error("Lỗi khi lưu blog:", error);
      const errorMessage =
        error.response?.data?.message || "Không thể lưu blog. Vui lòng thử lại!";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEdit ? "Chỉnh sửa Blog" : "Tạo Blog Mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
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
                  alt="đây ko phải file ảnh"
                  className="w-full h-64 object-cover rounded-lg"
              
                />
                
              </div>
              
            )}
            
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Category */}
            <div>
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

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="published">Xuất bản ngay</option>
                <option value="draft">Lưu nháp</option>
              </select>
            </div>
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
            
            {/* Hướng dẫn Markdown */}
            <div className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-600">
              <strong>Hướng dẫn Markdown:</strong>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>• <code># Tiêu đề lớn</code></div>
                <div>• <code>## Tiêu đề nhỏ</code></div>
                <div>• <code>**Chữ đậm**</code></div>
                <div>• <code>*Chữ nghiêng*</code></div>
                <div>• <code>[Link](url)</code></div>
                <div>• <code>![Ảnh](url)</code></div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-end border-t pt-4">
            <button
              type="button"
              onClick={onClose}
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
    </div>
  );
};

export default BlogFormModal;
