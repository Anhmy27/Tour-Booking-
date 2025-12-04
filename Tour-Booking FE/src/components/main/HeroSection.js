import React, { useState, useContext } from "react";
import { TourContext } from "../../contexts/TourContext";
//import banner from "assets/banner.mp4";
const HeroSection = () => {
  const { searchTours } = useContext(TourContext);
  const [location, setLocation] = useState("");
  const [keyword, setKeyword] = useState("");
  const [price, setPrice] = useState("");

  const handleSearch = () => {
    const [minPrice, maxPrice] = price ? price.split("-") : [null, null];

    const params = {
      search: keyword,
      location: location !== "Tất cả địa điểm" ? location : undefined,
      minPrice: minPrice ? Number(minPrice) * 1000 : undefined,
      maxPrice: maxPrice ? Number(maxPrice) * 1000 : undefined,
    };

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

              {/* Location Dropdown */}
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
                      d="M5.7 15C4.03377 15.6353 3 16.5205 3 17.4997C3 19.4329 7.02944 21 12 21C16.9706 21 21 19.4329 21 17.4997C21 16.5205 19.9662 15.6353 18.3 15M12 9H12.01M18 9C18 13.0637 13.5 15 12 18C10.5 15 6 13.0637 6 9C6 5.68629 8.68629 3 12 3C15.3137 3 18 5.68629 18 9ZM13 9C13 9.55228 12.5523 10 12 10C11.4477 10 11 9.55228 11 9C11 8.44772 11.4477 8 12 8C12.5523 8 13 8.44772 13 9Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="p-3  w-full border-none rounded-2xl focus:ring-2 focus:ring-cyan-400 appearance-none"
                  >
                    <option>Tất cả địa điểm</option>
                    <option>Hạ Long</option>
                    <option>Đà Nẵng</option>
                    <option>Phú Quốc</option>
                    <option>Hội An</option>
                    <option>Huế</option>
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
