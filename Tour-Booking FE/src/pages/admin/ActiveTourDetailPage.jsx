import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  StarIcon,
  CurrencyDollarIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const ActiveTourDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchTourDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}admin/activeTours/${id}`,
          { withCredentials: true }
        );
        console.log("data", response.data);
        if (response.data && response.data.status === "success") {
          setTour(response.data.data.tour || response.data.data);
        } else {
          throw new Error("Không nhận được dữ liệu từ server");
        }
      } catch (err) {
        console.error("Error fetching tour detail:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Có lỗi xảy ra khi tải dữ liệu"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTourDetail();
    }
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-yellow-500";
    if (rating >= 4) return "text-yellow-400";
    if (rating >= 3) return "text-yellow-300";
    return "text-gray-300";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Lỗi</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => navigate("/admin/active-tours")}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center text-gray-500">
          Không tìm thấy thông tin tour
        </div>
      </div>
    );
  }

  const images = tour.images && tour.images.length > 0 ? tour.images : [];
  const mainImage =
    tour.imageCover ||
    images[0] ||
    "https://nguoiduatin.mediacdn.vn/84137818385850368/2025/5/25/du-lich-he-1748141542277286017373.jpg";

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/admin/active-tours")}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Quay lại danh sách
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Chi tiết Tour</h1>
          <div className="w-12"></div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Basic Info */}
          <div className="lg:col-span-2">
            {/* Tour Name and Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {tour.name}
              </h2>
              <p className="text-gray-600 mb-4">{tour.summary}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(tour.ratingsAverage || 0)
                          ? getRatingColor(tour.ratingsAverage)
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {tour.ratingsAverage?.toFixed(1) || 0}
                </span>
                <span className="text-gray-600">
                  ({tour.ratingsQuantity || 0} đánh giá)
                </span>
              </div>
            </div>

            {/* Main Image */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="relative">
                <img
                  src={images[currentImageIndex] || mainImage}
                  alt={tour.name}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://nguoiduatin.mediacdn.vn/84137818385850368/2025/5/25/du-lich-he-1748141542277286017373.jpg";
                  }}
                />
                {images.length > 0 && (
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition ${
                        idx === currentImageIndex
                          ? "border-indigo-600"
                          : "border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${tour.name} ${idx + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://nguoiduatin.mediacdn.vn/84137818385850368/2025/5/25/du-lich-he-1748141542277286017373.jpg";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Mô tả chi tiết
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {tour.description}
              </p>
            </div>

            {/* Key Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Thông tin chính
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <ClockIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Thời gian</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {tour.duration} ngày
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 rounded-lg p-3">
                    <UsersIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số lượng tối đa</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {tour.maxGroupSize} người
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-red-100 rounded-lg p-3">
                    <MapPinIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Địa điểm bắt đầu</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {tour.startLocation?.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 rounded-lg p-3">
                    <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Giá</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPrice(tour.price)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Start Dates */}
            {tour.startDates && tour.startDates.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-6 h-6 text-indigo-600" />
                  Ngày khởi hành
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tour.startDates.map((date, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-300 rounded-lg p-4 text-center hover:border-indigo-600 transition"
                    >
                      <p className="text-gray-600 text-sm mb-2">Khởi hành</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatDate(date)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Partner and Pricing Info */}
          <div className="lg:col-span-1">
            {/* Partner Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Thông tin quản lý
              </h3>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <p className="text-sm text-gray-600">Tên quản lý</p>
                <p className="text-lg font-semibold text-gray-900">
                  {tour.partner?.name}
                </p>
              </div>
              <div className="pb-4">
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-900 break-all">{tour.partner?.email}</p>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-indigo-50 rounded-lg border border-indigo-200 p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Giá cả</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Giá gốc:</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(tour.price)}
                  </span>
                </div>

                {tour.priceDiscount > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Giảm giá:</span>
                      <span className="font-semibold text-red-600">
                        -{tour.priceDiscount}%
                      </span>
                    </div>
                    <div className="border-t border-indigo-200 pt-4 flex justify-between items-center">
                      <span className="text-gray-900 font-semibold">
                        Giá sau giảm:
                      </span>
                      <span className="text-xl font-bold text-indigo-600">
                        {formatPrice(
                          tour.price * (1 - tour.priceDiscount / 100)
                        )}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Trạng thái
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-900 font-semibold capitalize">
                  {tour.status === "active" ? "Đang hoạt động" : tour.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Locations Section */}
        {tour.locations && tour.locations.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPinIcon className="w-6 h-6 text-red-600" />
              Các điểm tham quan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tour.locations.map((location, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {location.description}
                  </h4>
                  {location.address && (
                    <p className="text-sm text-gray-600">{location.address}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveTourDetailPage;
