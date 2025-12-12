import { FaStar } from "react-icons/fa";

const TourHeader = ({ tour }) => {
  return (
    <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Left: Tour Info */}
      <div className="flex-1 min-w-[280px]">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          {tour.name}
        </h1>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          {/* Chỉ hiển thị rating khi có đánh giá */}
          {tour.reviews > 0 && (
            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
              <FaStar className="text-yellow-500" />
              <span>{tour.rating}</span>
              <span>({tour.reviews} đánh giá)</span>
            </div>
          )}

          <div className="flex items-center flex-wrap gap-1 text-gray-600 text-sm">
            <span>{tour.summary}</span>
          </div>
        </div>
      </div>

      {/* Right: Giá tour */}
      <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-emerald-800 whitespace-nowrap text-left sm:text-right">
        {tour.price.toLocaleString()} đ/khách
      </div>
    </div>
  );
};

export default TourHeader;
