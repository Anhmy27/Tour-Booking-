import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TourContext } from "../contexts/TourContext";

const ToursPage = () => {
  const { tours, pagination, searchTours } = useContext(TourContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: "",
    rating: "",
    minPrice: "",
    maxPrice: "",
    duration: "",
    maxGroupSize: "",
    startDate: "",
    sort: "-createdAt",
  });

  useEffect(() => {
    searchTours({ limit: 100 }); // Hiển thị nhiều tour, không phân trang
  }, []);

  const handleNavigateToDetail = (slug) => {
    if (slug) navigate(`/tour-detail/${slug}`);
  };

  const handleSearch = () => {
    const params = {
      limit: 100, // Hiển thị nhiều tour
      search: filters.search,
      ratingsAverage:
        filters.rating !== "all" && filters.rating ? filters.rating : undefined,
      minPrice: filters.minPrice ? Number(filters.minPrice) * 1000 : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) * 1000 : undefined,
      duration: filters.duration ? filters.duration : undefined,
      maxGroupSize: filters.maxGroupSize ? filters.maxGroupSize : undefined,
      startDate: filters.startDate ? filters.startDate : undefined,
      sort: filters.sort,
    };
    searchTours(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Filter Section */}
      <section className="bg-white shadow-md py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Title */}
            <div className="flex flex-col gap-4 text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Tìm kiếm tour du lịch
              </h2>
              <p className="text-base text-gray-700">
                Sử dụng bộ lọc để tìm tour phù hợp với bạn
              </p>
            </div>

            {/* Search Form */}
            <div className="flex flex-col md:flex-row gap-5 w-full mb-6">
              {/* Search Input */}
              <div className="flex-1">
                <label className="relative flex items-center border border-gray-300 rounded-2xl">
                  <svg
                    className="h-6 w-6 ml-3 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  <input
                    type="text"
                    placeholder="Nhập tên địa điểm"
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                    className="p-3 w-full border-none rounded-2xl focus:ring-2 focus:ring-cyan-400"
                  />
                </label>
              </div>

              {/* Rating Dropdown */}
              <div className="flex-1">
                <label className="relative flex items-center border border-gray-300 rounded-2xl">
                  <svg
                    className="h-6 w-6 ml-3 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.24 4.17C11.48 3.51 11.59 3.18 11.76 3.08C11.91 3 12.09 3 12.24 3.08C12.41 3.18 12.52 3.51 12.76 4.17L14.29 8.58C14.35 8.77 14.38 8.86 14.44 8.93C14.5 9 14.56 9.04 14.64 9.07C14.72 9.11 14.82 9.11 15.03 9.11L19.69 9.21C20.39 9.22 20.74 9.23 20.88 9.36C21 9.48 21.06 9.65 21.03 9.82C20.99 10.01 20.71 10.22 20.15 10.65L16.44 13.46C16.28 13.58 16.2 13.64 16.15 13.72C16.11 13.79 16.08 13.87 16.08 13.95C16.07 14.04 16.1 14.14 16.16 14.33L17.51 18.79C17.71 19.47 17.81 19.8 17.73 19.98C17.65 20.13 17.51 20.24 17.34 20.26C17.15 20.28 16.86 20.08 16.28 19.68L12.46 17.02C12.29 16.9 12.21 16.85 12.12 16.82C12.04 16.8 11.96 16.8 11.88 16.82C11.79 16.85 11.71 16.9 11.54 17.02L7.72 19.68C7.14 20.08 6.85 20.28 6.66 20.26C6.49 20.24 6.35 20.13 6.27 19.98C6.19 19.8 6.29 19.47 6.49 18.79L7.84 14.33C7.9 14.14 7.93 14.04 7.92 13.95C7.92 13.87 7.89 13.79 7.85 13.72C7.8 13.64 7.72 13.58 7.56 13.46L3.85 10.65C3.29 10.22 3.01 10.01 2.97 9.82C2.94 9.65 2.99 9.48 3.12 9.36C3.26 9.23 3.61 9.22 4.31 9.21L8.97 9.11C9.18 9.11 9.28 9.11 9.36 9.07C9.44 9.04 9.5 9 9.56 8.93C9.62 8.86 9.65 8.77 9.71 8.58L11.24 4.17Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <select
                    value={filters.rating}
                    onChange={(e) =>
                      setFilters({ ...filters, rating: e.target.value })
                    }
                    className="p-3 w-full border-none rounded-2xl focus:ring-2 focus:ring-cyan-400 appearance-none"
                  >
                    <option value="all">Tất cả đánh giá</option>
                    <option value="5">5 sao</option>
                    <option value="4">Từ 4 sao</option>
                    <option value="3">Từ 3 sao</option>
                  </select>
                  <svg
                    className="h-6 w-6 mr-3 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </label>
              </div>

              {/* Price Dropdown */}
              <div className="flex-1">
                <label className="relative flex items-center border border-gray-300 rounded-2xl">
                  <svg
                    className="h-6 w-6 ml-3 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 10V9.91667C15 8.85812 14.1419 8 13.0833 8H11C9.89543 8 9 8.89543 9 10C9 11.1046 9 12 11 12H13C14.1046 12 15 12.8954 15 14C15 15.1046 14.1046 16 13 16H10.9583C9.87678 16 9 15.1232 9 14.0417V14M12 17.5V6.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  <select
                    onChange={(e) => {
                      const [min, max] = e.target.value
                        ? e.target.value.split("-")
                        : ["", ""];
                      setFilters({ ...filters, minPrice: min, maxPrice: max });
                    }}
                    className="p-3 w-full border-none rounded-2xl focus:ring-2 focus:ring-cyan-400 appearance-none"
                  >
                    <option value="">Tất cả mức giá</option>
                    <option value="0-500">Dưới 500k</option>
                    <option value="500-1000">500k - 1 triệu</option>
                    <option value="1000-9999">Trên 1 triệu</option>
                    <option value="10000-99999">Trên 10 triệu</option>
                  </select>
                  <svg
                    className="h-6 w-6 mr-3 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </label>
              </div>
            </div>

            {/* Additional Filters Row */}
            <div className="flex flex-col md:flex-row gap-5 w-full mb-6">
              {/* Duration Dropdown */}
              <div className="flex-1">
                <label className="relative flex items-center border border-gray-300 rounded-2xl">
                  <svg
                    className="h-6 w-6 ml-3 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <select
                    value={filters.duration}
                    onChange={(e) =>
                      setFilters({ ...filters, duration: e.target.value })
                    }
                    className="p-3 w-full border-none rounded-2xl focus:ring-2 focus:ring-cyan-400 appearance-none"
                  >
                    <option value="">Thời gian tour</option>
                    <option value="1">1 ngày</option>
                    <option value="2">2 ngày</option>
                    <option value="3">3 ngày</option>
                    <option value="5">5 ngày</option>
                    <option value="7">7 ngày</option>
                    <option value="10">10 ngày</option>
                    <option value="12">12 ngày</option>
                    <option value="15">15 ngày</option>
                  </select>
                  <svg
                    className="h-6 w-6 mr-3 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </label>
              </div>

              {/* Max Group Size Dropdown */}
              <div className="flex-1">
                <label className="relative flex items-center border border-gray-300 rounded-2xl">
                  <svg
                    className="h-6 w-6 ml-3 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M17 20C17 18.3431 14.7614 17 12 17C9.23858 17 7 18.3431 7 20M21 17.0004C21 15.7702 19.7659 14.7129 18 14.25M3 17.0004C3 15.7702 4.2341 14.7129 6 14.25M18 10.2361C18.6137 9.68679 19 8.8885 19 8C19 6.34315 17.6569 5 16 5C15.2316 5 14.5308 5.28885 14 5.76389M6 10.2361C5.38625 9.68679 5 8.8885 5 8C5 6.34315 6.34315 5 8 5C8.76835 5 9.46924 5.28885 10 5.76389M12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11C15 12.6569 13.6569 14 12 14Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <select
                    value={filters.maxGroupSize}
                    onChange={(e) =>
                      setFilters({ ...filters, maxGroupSize: e.target.value })
                    }
                    className="p-3 w-full border-none rounded-2xl focus:ring-2 focus:ring-cyan-400 appearance-none"
                  >
                    <option value="">Số người tối đa</option>
                    <option value="2">Từ 2 người</option>
                    <option value="5">Từ 5 người</option>
                    <option value="10">Từ 10 người</option>
                    <option value="15">Từ 15 người</option>
                    <option value="20">Từ 20 người</option>
                    <option value="30">Từ 30 người</option>
                  </select>
                  <svg
                    className="h-6 w-6 mr-3 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </label>
              </div>

              {/* Start Date Input */}
              <div className="flex-1">
                <label className="relative flex items-center border border-gray-300 rounded-2xl">
                  <svg
                    className="h-6 w-6 ml-3 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters({ ...filters, startDate: e.target.value })
                    }
                    placeholder="Ngày khởi hành"
                    className="p-3 w-full border-none rounded-2xl focus:ring-2 focus:ring-cyan-400"
                  />
                </label>
              </div>
            </div>

            {/* Search Button Row */}
            <div className="flex justify-center">
              <button
                onClick={handleSearch}
                className="bg-cyan-400 text-white font-medium py-3 px-12 rounded-2xl hover:bg-cyan-500 transition-colors"
              >
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Results count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Tìm thấy <span className="font-bold">{pagination.results}</span>{" "}
              tour
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {tours?.map((tour, index) => (
              <div
                key={tour._id || index}
                onClick={() => handleNavigateToDetail(tour?.slug)}
                className="bg-white rounded-3xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="relative p-4">
                  <img
                    src={tour?.imageCover || "/thuyen1.png"}
                    alt={tour?.name || "Du thuyền"}
                    className="w-full h-[216px] object-cover rounded-2xl"
                  />

                  {/* Rating Badge */}
                  <div className="absolute top-6 left-6 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M11.24 4.17C11.48 3.51 11.59 3.18 11.76 3.08C11.91 3 12.09 3 12.24 3.08C12.41 3.18 12.52 3.51 12.76 4.17L14.29 8.58C14.35 8.77 14.38 8.86 14.44 8.93C14.5 9 14.56 9.04 14.64 9.07C14.72 9.11 14.82 9.11 15.03 9.11L19.69 9.21C20.39 9.22 20.74 9.23 20.88 9.36C21 9.48 21.06 9.65 21.03 9.82C20.99 10.01 20.71 10.22 20.15 10.65L16.44 13.46C16.28 13.58 16.2 13.64 16.15 13.72C16.11 13.79 16.08 13.87 16.08 13.95C16.07 14.04 16.1 14.14 16.16 14.33L17.51 18.79C17.71 19.47 17.81 19.8 17.73 19.98C17.65 20.13 17.51 20.24 17.34 20.26C17.15 20.28 16.86 20.08 16.28 19.68L12.46 17.02C12.29 16.9 12.21 16.85 12.12 16.82C12.04 16.8 11.96 16.8 11.88 16.82C11.79 16.85 11.71 16.9 11.54 17.02L7.72 19.68C7.14 20.08 6.85 20.28 6.66 20.26C6.49 20.24 6.35 20.13 6.27 19.98C6.19 19.8 6.29 19.47 6.49 18.79L7.84 14.33C7.9 14.14 7.93 14.04 7.92 13.95C7.92 13.87 7.89 13.79 7.85 13.72C7.8 13.64 7.72 13.58 7.56 13.46L3.85 10.65C3.29 10.22 3.01 10.01 2.97 9.82C2.94 9.65 2.99 9.48 3.12 9.36C3.26 9.23 3.61 9.22 4.31 9.21L8.97 9.11C9.18 9.11 9.28 9.11 9.36 9.07C9.44 9.04 9.5 9 9.56 8.93C9.62 8.86 9.65 8.77 9.71 8.58L11.24 4.17Z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>
                      {tour?.ratingsAverage || "4.9"} (
                      {tour?.ratingsQuantity || "12"}) đánh giá
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col gap-2">
                  {/* Location */}
                  <div className="flex items-center gap-1 text-gray-500 text-xs text-left">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5.7 15C4.03 15.63 3 16.52 3 17.5C3 19.43 7.03 21 12 21C16.97 21 21 19.43 21 17.5C21 16.52 19.96 15.63 18.3 15M12 9H12.01M18 9C18 13.06 13.5 15 12 18C10.5 15 6 13.06 6 9C6 5.69 8.69 3 12 3C15.31 3 18 5.69 18 9Z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>
                      {tour?.startLocation?.description || "Việt Nam"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 text-left">
                    {tour?.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm text-left line-clamp-2">
                    {tour?.summary || tour?.description}
                  </p>

                  {/* Footer: Price and Button */}
                  <div className="flex items-center justify-between mt-2">
                    <p
                      className="text-lg font-bold text-left"
                      style={{ color: "#0E4F4F" }}
                    >
                      {tour?.price
                        ? `${tour.price.toLocaleString()}đ / khách`
                        : "Liên hệ"}
                    </p>
                    <button
                      className="bg-cyan-400 text-white font-medium py-2 px-4 rounded-lg hover:bg-cyan-500 transition-colors text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigateToDetail(tour?.slug);
                      }}
                    >
                      Đặt ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No results */}
          {tours?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Không tìm thấy tour phù hợp
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ToursPage;
