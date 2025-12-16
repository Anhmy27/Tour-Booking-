import React, { useState, useContext } from "react";
import { TourContext } from "../../contexts/TourContext";
//import banner from "assets/banner.mp4";
const HeroSection = () => {
  const { searchTours } = useContext(TourContext);
  const [rating, setRating] = useState("");
  const [keyword, setKeyword] = useState("");
  const [price, setPrice] = useState("");

  const handleSearch = () => {
    const [minPrice, maxPrice] = price ? price.split("-") : [null, null];

    const params = {
      page: 1,
      search: keyword,
      ratingsAverage: rating !== "all" ? rating : undefined,
      minPrice: minPrice ? Number(minPrice) * 1000 : undefined,
      maxPrice: maxPrice ? Number(maxPrice) * 1000 : undefined,
    };

    // Xóa URL params khi search mới
    window.history.replaceState({}, "", window.location.pathname);
    searchTours(params);
  };
  return (
    <>
      <section className="relative w-full h-[950px] overflow-hidden">
        {/* Background Video */}
        <div className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden">
          <video
            className="w-full h-full object-cover"
            src="assets/banner.mp4"
            autoPlay
            playsInline
            loop
            muted
          ></video>
        </div>

        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-6 transition-transform duration-300">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-10 max-w-4xl w-full mx-4">
            {/* Title and Description */}
            <div className="flex flex-col gap-4 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Bạn lựa chọn chuyến đi nào?
              </h1>
              <p className="text-lg text-gray-700">
                Hàng trăm tour du lịch hạng sang giá tốt đang chờ bạn
              </p>
            </div>

            {/* Search Form */}
            <div className="flex flex-col md:flex-row gap-5 w-full">
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
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="p-3  w-full border-none rounded-2xl focus:ring-2 focus:ring-cyan-400"
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
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="p-3  w-full border-none rounded-2xl focus:ring-2 focus:ring-cyan-400 appearance-none"
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
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="p-3  w-full border-none rounded-2xl focus:ring-2 focus:ring-cyan-400 appearance-none"
                  >
                    <option>Tất cả mức giá</option>
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

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="bg-cyan-400 text-white font-medium py-3 px-6 rounded-2xl hover:bg-cyan-500 transition-colors"
              >
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-96">
            {/* Left Column: Title */}
            <div className="flex-1 flex flex-col gap-4">
              <h2 className="text-3xl md:text-4xl text-left font-bold text-gray-900">
                Tours mới và phổ biến nhất
              </h2>
              <div className="w-16 h-1 bg-cyan-400"></div>
            </div>

            {/* Right Column: Description */}
            <div className="flex-1">
              <p className="text-lg text-gray-700 text-left">
                Hãy sẵn sàng cho một hành trình du lịch đỉnh cao trên du thuyền
                sang trọng bậc nhất hiện nay. Tour du lịch của chúng tôi mang
                đến cho bạn cơ hội tận hưởng không gian xa hoa, dịch vụ chuẩn 5
                sao và những tiện nghi hiện đại giữa khung cảnh thiên nhiên
                tuyệt đẹp
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
