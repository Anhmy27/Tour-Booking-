import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const blogService = {
  // Lấy danh sách blog của partner
  getMyBlogs: (params) =>
    axios.get(`${API_URL}blogs`, {
      params,
      withCredentials: true,
    }),

  // Lấy chi tiết 1 blog
  getBlog: (id) =>
    axios.get(`${API_URL}blogs/${id}`, {
      withCredentials: true,
    }),

  // Tạo blog mới
  createBlog: (formData) =>
    axios.post(`${API_URL}blogs`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",/*.*/
      },
      withCredentials: true,
    }),

  // Cập nhật blog
  updateBlog: (id, formData) =>
    axios.patch(`${API_URL}blogs/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }),

  // Xóa blog
  deleteBlog: (id) =>
    axios.delete(`${API_URL}blogs/${id}`, {
      withCredentials: true,
    }),

  // Tăng view count
  incrementView: (id) =>
    axios.patch(`${API_URL}blogs/public/${id}/view`, {}, {
      withCredentials: true,
    }),

  // Toggle like
  toggleLike: (id) =>
    axios.patch(`${API_URL}blogs/public/${id}/like`, {}, {
      withCredentials: true,
    }),
};
