import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TourContext } from "../../contexts/TourContext";

const TourList = () => {
  const { tours } = useContext(TourContext);
  const navigate = useNavigate();

  const handleNavigateToDetail = (slug) => {
    if (slug) navigate(`/tour-detail/${slug}`);
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {(tours?.length ? tours : [...Array(6)]).map((tour, index) => (
            <div
              key={index}
              onClick={() => handleNavigateToDetail(tour?.slug)}
              className="bg-white rounded-3xl shadow-md overflow-hidden"
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
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.24 4.17C11.48 3.51 11.59 3.18 11.76 3.08C11.91 3 12.09 3 12.24 3.08C12.41 3.18 12.52 3.51 12.76 4.17L14.29 8.58C14.35 8.77 14.38 8.86 14.44 8.93C14.5 9 14.56 9.04 14.64 9.07C14.72 9.11 14.82 9.11 15.03 9.11L19.69 9.21C20.39 9.22 20.74 9.23 20.88 9.36C21 9.48 21.06 9.65 21.03 9.82C20.99 10.01 20.71 10.22 20.15 10.65L16.44 13.46C16.28 13.58 16.2 13.64 16.15 13.72C16.11 13.79 16.08 13.87 16.08 13.95C16.07 14.04 16.1 14.14 16.16 14.33L17.51 18.79C17.71 19.47 17.81 19.8 17.73 19.98C17.65 20.13 17.51 20.24 17.34 20.26C17.15 20.28 16.86 20.08 16.28 19.68L12.46 17.02C12.29 16.9 12.21 16.85 12.12 16.82C12.04 16.8 11.96 16.8 11.88 16.82C11.79 16.85 11.71 16.9 11.54 17.02L7.72 19.68C7.14 20.08 6.85 20.28 6.66 20.26C6.49 20.24 6.35 20.13 6.27 19.98C6.19 19.8 6.29 19.47 6.49 18.79L7.84 14.33C7.9 14.14 7.93 14.04 7.92 13.95C7.92 13.87 7.89 13.79 7.85 13.72C7.8 13.64 7.72 13.58 7.56 13.46L3.85 10.65C3.29 10.22 3.01 10.01 2.97 9.82C2.94 9.65 2.99 9.48 3.12 9.36C3.26 9.23 3.61 9.22 4.31 9.21L8.97 9.11C9.18 9.11 9.28 9.11 9.36 9.07C9.44 9.04 9.5 9 9.56 8.93C9.62 8.86 9.65 8.77 9.71 8.58L11.24 4.17Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    {tour?.rating || "4.9"} ({tour?.reviews || "12"}) đánh giá
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
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.7 15C4.03 15.63 3 16.52 3 17.5C3 19.43 7.03 21 12 21C16.97 21 21 19.43 21 17.5C21 16.52 19.96 15.63 18.3 15M12 9H12.01M18 9C18 13.06 13.5 15 12 18C10.5 15 6 13.06 6 9C6 5.69 8.69 3 12 3C15.31 3 18 5.69 18 9Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{tour?.location || "Vịnh Hạ Long"}</span>
                </div>
                {/* Title */}~
                <h3 className="text-lg font-bold text-gray-900 text-left">
                  {tour?.name || "Du thuyền Heritage Bình Chuẩn Cát Bà"}
                </h3>
                {/* Description */}
                <div className="flex items-center gap-2 text-gray-600 text-sm text-left">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.62 17.28C3.72 17.53 3.91 17.72 4.15 17.83C4.4 17.93 4.67 17.94 4.92 17.84C5.17 17.74 5.36 17.55 5.47 17.31C5.57 17.06 5.58 16.79 5.48 16.54L4.36 13.72L11 12.25V17C11 17.27 11.11 17.52 11.29 17.71C11.48 17.89 11.73 18 12 18C12.27 18 12.52 17.89 12.71 17.71C12.89 17.52 13 17.27 13 17V12.25L19.64 13.72L18.52 16.54C18.47 16.66 18.45 16.79 18.45 16.92C18.45 17.06 18.48 17.19 18.53 17.31C18.58 17.43 18.66 17.54 18.75 17.63C18.85 17.72 18.96 17.79 19.08 17.84"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    {tour?.description ||
                      "Hạ thuỷ 2019 - Tàu vỏ kim loại - 20 phòng"}
                  </span>
                </div>
                {/* Footer: Price and Button */}
                <div className="flex items-center justify-between mt-2">
                  <p
                    className="text-lg font-bold text-left"
                    style={{ color: "#0E4F4F" }}
                  >
                    {tour?.price
                      ? `${tour.price.toLocaleString()}đ / khách`
                      : "4,150,000đ / khách"}
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
      </div>
    </section>
  );
};

export default TourList;
