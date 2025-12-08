import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../layouts/partner/Sidebar";
import Header from "../../layouts/partner/Header";

const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState({
    name: "", // tên công ty
    description: "", // mô tả công ty
    photo: "", // logo hoặc ảnh đại diện
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:9999/api/v1/auth/profile", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          const user = data.data.data;
          setCompanyData({
            name: user.name || "",
            description: user.description || "",
            photo: user.photo || "",
          });
        } else {
          alert("Lỗi tải profile: " + data.message);
        }
      } catch (error) {
        console.error("Lỗi tải profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCompanyData((prev) => ({ ...prev, photo: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    form.append("name", companyData.name);
    form.append("description", companyData.description);
    form.append("photo", companyData.photo);

    try {
      const response = await fetch("http://localhost:9999/api/v1/auth/profile", {
        method: "PATCH",
        body: form,
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        alert("Cập nhật thành công!");
      } else {
        alert("Lỗi cập nhật profile: " + data.message);
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-gray-900 text-white">
        <Sidebar />
      </div>

      <div className="flex-1">
        <Header />
        <div className="p-10">
          <div className="max-w-3xl bg-white p-8 rounded-2xl shadow-xl mx-auto">
            <button
              onClick={() => navigate("/partner/dashboard")}
              className="mb-6 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            >
              ⬅️ Quay về Dashboard
            </button>

            <h2 className="text-3xl font-bold text-black mb-6">
              👤 Hồ sơ Công Ty
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Tên Công Ty</label>
                <input
                  type="text"
                  name="name"
                  value={companyData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Mô Tả Công Ty</label>
                <textarea
                  name="description"
                  value={companyData.description}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg min-h-[100px]"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Ảnh đại diện / Logo
                </label>
                <div className="flex items-center text-lg">
                  <img
                    className="w-[5rem] h-[5rem] rounded-full mr-8"
                    src={
                      companyData?.photo instanceof File
                        ? URL.createObjectURL(companyData.photo)
                        : companyData.photo
                    }
                    alt="user"
                  />
                  <input
                    type="file"
                    name="photo"
                    onChange={handleFileChange}
                    placeholder="URL ảnh"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold"
              >
                💾 Lưu Thay Đổi
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
