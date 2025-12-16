import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../layouts/partner/Sidebar";
import Header from "../../layouts/partner/Header";
import DatePicker from "react-multi-date-picker";

import "react-multi-date-picker/styles/layouts/prime.css"; // theme đẹp hơn

const CreateTour = () => {
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    maxGroupSize: "",
    price: "",
    priceDiscount: "",
    summary: "",
    description: "",
    imageCover: "",
    images: [],
    startLocation: {
      address: "",
      description: "",
    },
    startDates: [],
    status: "pending",
  });

  const [locations, setLocations] = useState([]);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    address: "",
    description: "",
    day: 1,
    coordinates: [105.8542, 21.0285], // [lng, lat]
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [startLocationCoords] = useState([105.8542, 21.0285]);

  const [finalPrice, setFinalPrice] = useState(0);
  const [coverFile, setCoverFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [dates, setDates] = useState([]);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const price = parseFloat(formData.price) || 0;
    const discount = parseFloat(formData.priceDiscount) || 0;
    const discountedPrice = price - (price * discount) / 100;
    setFinalPrice(discountedPrice > 0 ? discountedPrice : 0);
  }, [formData.price, formData.priceDiscount]);

  // Load saved templates từ localStorage khi component mount
  useEffect(() => {
    const templates = JSON.parse(localStorage.getItem("tourTemplates") || "[]");
    setSavedTemplates(templates);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "address" || name === "descriptionStart") {
      setFormData((prev) => ({
        ...prev,
        startLocation: {
          ...prev.startLocation,
          [name === "address" ? "address" : "description"]: value,
          coordinates: startLocationCoords,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };


  const uploadImages = async () => {
    const form = new FormData();
    imageFiles.forEach((img) => form.append("images", img));
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL.replace('/api/v1/', '')}upload`, {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    return data.imageUrls || [];
  };

  const uploadCover = async () => {
    if (!coverFile) return null;
    const form = new FormData();
    form.append("images", coverFile);
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL.replace('/api/v1/', '')}upload`, {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    return data.imageUrls?.[0] || null;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Tạo FormData để gửi cả file và data
      const formDataToSend = new FormData();
      
      // Append các field thông thường
      formDataToSend.append("name", formData.name);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("maxGroupSize", formData.maxGroupSize);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("priceDiscount", formData.priceDiscount);
      formDataToSend.append("summary", formData.summary);
      formDataToSend.append("description", formData.description);
      
      // Append ảnh cover (file)
      if (coverFile) {
        formDataToSend.append("imageCover", coverFile);
      }
      
      // Append ảnh phụ (files)
      imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });
      
      // Append startDates (array)
      dates.forEach((date) => {
        formDataToSend.append("startDates[]", date.toDate().toISOString());
      });
      
      // Append startLocation (object as JSON string)
      formDataToSend.append("startLocation", JSON.stringify({
        type: "Point",
        coordinates: startLocationCoords,
        address: formData.startLocation.address,
        description: formData.startLocation.description,
      }));
      
      // Append locations (array as JSON string)
      formDataToSend.append("locations", JSON.stringify(
        locations.map((loc) => ({
          type: "Point",
          coordinates: loc.coordinates,
          address: loc.address,
          description: loc.description,
          day: loc.day,
        }))
      ));

      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}tours/create`, {
        method: "POST",
        credentials: "include",
        body: formDataToSend, // Gửi FormData, không cần set Content-Type
      });

      const data = await res.json();
      if (res.ok) {
        alert("Tạo tour thành công!");
        navigate("/partner/tours");
      } else {
        alert(data.message || "Lỗi tạo tour");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra khi tạo tour!");
    }
  };

  const handleAddLocation = () => {
    if (!currentLocation.address || !currentLocation.description) {
      alert("Vui lòng nhập đầy đủ thông tin địa điểm!");
      return;
    }

    if (editingIndex !== null) {
      // Update existing location
      const updatedLocations = [...locations];
      updatedLocations[editingIndex] = currentLocation;
      setLocations(updatedLocations);
      setEditingIndex(null);
    } else {
      // Add new location
      setLocations([...locations, currentLocation]);
    }

    // Reset form
    setCurrentLocation({
      address: "",
      description: "",
      day: 1,
      coordinates: [105.8542, 21.0285],
    });
    setShowLocationForm(false);
  };

  const handleEditLocation = (index) => {
    setCurrentLocation(locations[index]);
    setEditingIndex(index);
    setShowLocationForm(true);
  };

  const handleDeleteLocation = (index) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const handleLocationChange = (field, value) => {
    setCurrentLocation((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Lưu template vào localStorage
  const saveTemplate = () => {
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên tour trước khi lưu template!");
      return;
    }

    // Convert dates to ISO strings (handle both Date objects and DatePicker objects)
    const datesToSave = dates.map(date => {
      if (date && typeof date.toDate === 'function') {
        return date.toDate().toISOString();
      } else if (date instanceof Date) {
        return date.toISOString();
      }
      return date;
    });

    const template = {
      id: Date.now().toString(),
      name: formData.name,
      savedAt: new Date().toLocaleString("vi-VN"),
      formData: { ...formData },
      locations: [...locations],
      dates: datesToSave,
      startLocationCoords: [...startLocationCoords],
    };

    const templates = JSON.parse(localStorage.getItem("tourTemplates") || "[]");
    templates.unshift(template); // Thêm vào đầu danh sách
    localStorage.setItem("tourTemplates", JSON.stringify(templates));
    setSavedTemplates(templates);
    alert("Đã lưu template thành công! ✅");
  };

  // Load template từ localStorage
  const loadTemplate = (template) => {
    if (!window.confirm(`Bạn có muốn load template "${template.name}"? Dữ liệu hiện tại sẽ bị thay thế.`)) {
      return;
    }

    setFormData(template.formData);
    setLocations(template.locations || []);
    
    // Convert ISO strings back to Date objects for DatePicker
    // react-multi-date-picker accepts Date objects or timestamps
    const loadedDates = template.dates && template.dates.length > 0 
      ? template.dates.map(dateStr => {
          try {
            if (typeof dateStr === 'string') {
              const date = new Date(dateStr);
              // Validate date
              if (isNaN(date.getTime())) {
                console.warn('Invalid date:', dateStr);
                return null;
              }
              return date;
            }
            return dateStr;
          } catch (error) {
            console.error('Error parsing date:', dateStr, error);
            return null;
          }
        }).filter(date => date !== null) 
      : [];
    setDates(loadedDates);
    
    // Lưu ý: file images không thể restore từ localStorage, người dùng cần upload lại
    setCoverFile(null);
    setImageFiles([]);
    setShowTemplates(false);
    alert("Đã load template thành công! ⚠️ Lưu ý: Bạn cần upload lại ảnh.");
  };

  // Xóa template
  const deleteTemplate = (templateId) => {
    if (!window.confirm("Bạn có chắc muốn xóa template này?")) {
      return;
    }

    const templates = savedTemplates.filter(t => t.id !== templateId);
    localStorage.setItem("tourTemplates", JSON.stringify(templates));
    setSavedTemplates(templates);
    alert("Đã xóa template!");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-gray-900 text-white">
        <Sidebar />
      </div>

      <div className="flex-1">
        <Header />
        <div className="p-10">
          <div className="max-w-5xl mx-auto">
            {/* Templates Section */}
            <div className="bg-white p-6 rounded-2xl shadow-xl mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-indigo-600">
                  💾 Templates đã lưu ({savedTemplates.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  {showTemplates ? "🔼 Ẩn templates" : "🔽 Xem templates"}
                </button>
              </div>
              
              {showTemplates && (
                <div className="space-y-3">
                  {savedTemplates.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      Chưa có template nào được lưu. Hãy tạo tour và nhấn "Lưu làm template" để lưu lại!
                    </p>
                  ) : (
                    savedTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-400 transition"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{template.name}</h4>
                          <p className="text-sm text-gray-500">
                            Đã lưu: {template.savedAt}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => loadTemplate(template)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                          >
                            📥 Load
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteTemplate(template.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                          >
                            🗑️ Xóa
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Form Section */}
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
                ✨ Tạo Tour Mới
              </h2>
              <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tên tour"
                className={inputClass}
                required
              />
              <input
                type="number"
                name="duration"
                value={formData.duration}
                placeholder="Thời gian (số ngày)"
                onChange={handleChange}
                required
                className={inputClass}
              />
              <input
                name="maxGroupSize"
                value={formData.maxGroupSize}
                onChange={handleChange}
                type="number"
                placeholder="Số lượng tối đa"
                className={inputClass}
                required
              />
              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                type="number"
                placeholder="Giá (VND)"
                className={inputClass}
                required
              />
              <input
                name="priceDiscount"
                value={formData.priceDiscount}
                onChange={handleChange}
                type="number"
                placeholder="Giảm giá (%)"
                className={inputClass}
              />

              {/* Start Location Section */}
              <div className="md:col-span-2 border p-4 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold text-indigo-600 mb-3">🚩 Điểm xuất phát</h3>
                <div className="space-y-3">
                  <input
                    name="address"
                    value={formData.startLocation.address}
                    onChange={handleChange}
                    placeholder="Địa chỉ xuất phát"
                    className={inputClass}
                    required
                  />
                  <input
                    name="descriptionStart"
                    value={formData.startLocation.description}
                    onChange={handleChange}
                    placeholder="Mô tả địa điểm xuất phát"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600">Ảnh bìa</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files[0])}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600">Ảnh phụ (nhiều)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setImageFiles(Array.from(e.target.files))}
                />
              </div>

              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Tóm tắt tour"
                className={`${textareaClass} md:col-span-2`}
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mô tả chi tiết"
                className={`${textareaClass} md:col-span-2`}
                required
              />

              <div className="md:col-span-2">
                <label className="text-sm text-gray-600 mb-2 block">
                  Ngày khởi hành
                </label>
                <div className="bg-white p-4 rounded-xl shadow w-fit">
                  <DatePicker
                    value={dates}
                    onChange={setDates}
                    onlyCalendar
                    multiple
                    format="YYYY-MM-DD"
                    className="rmdp-prime custom-calendar"
                  />
                </div>
              </div>

              {/* Locations Section */}
              <div className="md:col-span-2 border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-indigo-600">
                    📍 Các điểm đến trong tour
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowLocationForm(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    + Thêm điểm đến
                  </button>
                </div>

                {/* Location List */}
                {locations.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {locations.map((loc, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between bg-gray-50 p-4 rounded-lg border"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            Ngày {loc.day}: {loc.address}
                          </p>
                          <p className="text-sm text-gray-600">
                            {loc.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Tọa độ: {loc.coordinates[1].toFixed(4)},{" "}
                            {loc.coordinates[0].toFixed(4)}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            type="button"
                            onClick={() => handleEditLocation(index)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteLocation(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Location Form Modal */}
                {showLocationForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                      <h4 className="text-xl font-bold text-indigo-600 mb-4">
                        {editingIndex !== null
                          ? "Chỉnh sửa điểm đến"
                          : "Thêm điểm đến mới"}
                      </h4>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Địa chỉ *
                          </label>
                          <input
                            type="text"
                            value={currentLocation.address}
                            onChange={(e) =>
                              handleLocationChange("address", e.target.value)
                            }
                            placeholder="Ví dụ: Vịnh Hạ Long, Quảng Ninh"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả *
                          </label>
                          <textarea
                            value={currentLocation.description}
                            onChange={(e) =>
                              handleLocationChange("description", e.target.value)
                            }
                            placeholder="Mô tả hoạt động tại điểm này..."
                            className={textareaClass}
                            rows={3}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày thứ mấy trong tour *
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={currentLocation.day}
                            onChange={(e) =>
                              handleLocationChange("day", parseInt(e.target.value))
                            }
                            className={inputClass}
                          />
                        </div>

                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          type="button"
                          onClick={handleAddLocation}
                          className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                        >
                          {editingIndex !== null ? "Cập nhật" : "Thêm"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowLocationForm(false);
                            setEditingIndex(null);
                            setCurrentLocation({
                              address: "",
                              description: "",
                              day: 1,
                              coordinates: [105.8542, 21.0285],
                            });
                          }}
                          className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 text-right text-indigo-700 font-medium">
                💸 Giá sau giảm:{" "}
                <strong>{finalPrice.toLocaleString()} VND</strong>
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium"
                >
                  🚀 Tạo Tour
                </button>
                <button
                  type="button"
                  onClick={saveTemplate}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-medium"
                >
                  💾 Lưu làm Template
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/partner/dashboard")}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-medium"
                >
                  🔙 Về Dashboard
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTour;

const inputClass =
  "w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 text-sm";
const textareaClass =
  "w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 text-sm min-h-[120px]";

// Thêm CSS để ẩn input ẩn của react-multi-date-picker
const style = document.createElement("style");
style.innerHTML = `
  .custom-calendar input.rmdp-input {
    display: none !important;
  }
`;
document.head.appendChild(style);
