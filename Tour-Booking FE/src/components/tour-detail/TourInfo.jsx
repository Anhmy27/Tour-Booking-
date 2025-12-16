import { useState, useEffect } from "react";
import { FaClock, FaUsers, FaMapMarkerAlt } from "react-icons/fa";
import dayjs from "dayjs";
import ResponsiveDatePickers from "../tour-detail/ResponsiveDatePickers";
import { getBookingSession, createMoMoPayment, getAvailableSlots } from "../../services/api";

const TourInfo = ({ tour, onSelectLocation }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [numAdults, setNumAdults] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  const totalPrice = numAdults * (tour?.price || 0);

  // Gọi API để lấy số chỗ còn trống khi chọn ngày
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDate || !tour?.id) return;
      
      setLoadingAvailability(true);
      try {
        const response = await getAvailableSlots(tour.id, selectedDate);
        setAvailability(response.data.data);
      } catch (error) {
        console.error("Error fetching availability:", error);
        setAvailability(null);
      } finally {
        setLoadingAvailability(false);
      }
    };

    fetchAvailability();
  }, [selectedDate, tour?.id]);
  const handleScrollToMap = (location) => {
    const mapElement = document.getElementById("tour-map");
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: "smooth" });
    }
    if (onSelectLocation) {
      onSelectLocation(location);
    }
  };

  const confirmBooking = async () => {
    try {
      setIsLoading(true);
      const res = await getBookingSession(tour.id, numAdults, selectedDate);
      window.location.href = res.data.session?.url;
    } catch (error) {
      window.alert("Xảy ra lỗi khi đặt tour. Hãy thử lại sau!");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmMoMoPayment = async () => {
    try {
      setIsLoading(true);

      const res = await createMoMoPayment({
        tourId: tour.id,
        numberOfPeople: numAdults,
        startDate: selectedDate,
      });

      console.log("=== MOMO API RESPONSE ===");
      console.log("Full response:", res.data);
      console.log("Pay URL:", res.data.data?.payUrl);

      if (res.data.status === "success" && res.data.data?.payUrl) {
        // Chuyển thẳng sang trang thanh toán MoMo
        window.location.href = res.data.data.payUrl;
      } else {
        window.alert("Không thể tạo link thanh toán MoMo!");
      }
    } catch (error) {
      console.error("MoMo error:", error);
      window.alert(
        error.response?.data?.message || "Lỗi tạo thanh toán MoMo!"
      );
      setIsLoading(false);
    }
  };

  const handleBookingClick = () => {
    const isValidDate = tour?.startDates?.some((date) =>
      dayjs(date).isSame(selectedDate, "day")
    );

    if (!selectedDate) {
      alert("Vui lòng chọn ngày khởi hành.");
      return;
    } else if (!isValidDate) {
      alert("Ngày khởi hành không hợp lệ.");
      return;
    }
    
    // Kiểm tra số chỗ còn trống
    if (availability) {
      if (availability.remainingSlots === 0) {
        alert("Ngày này đã hết chỗ. Vui lòng chọn ngày khác.");
        return;
      }
      if (numAdults > availability.remainingSlots) {
        alert(`Chỉ còn ${availability.remainingSlots} chỗ trống. Vui lòng giảm số lượng khách.`);
        return;
      }
    }
    
    // Gọi MoMo payment luôn không cần modal xác nhận
    confirmMoMoPayment();
  };

  return (
    <section className="container max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left: Các điểm đến */}
      <div className="md:col-span-2 bg-white rounded-2xl p-6">
        <h1 className="text-2xl font-semibold mb-4 text-cyan-700">
          Lộ trình tour
        </h1>
        
        {/* Điểm xuất phát */}
        {tour.startLocation && tour.startLocation.coordinates && (
          <div className="mb-6 pb-6 border-b-2 border-cyan-200">
            <h2 className="text-lg font-semibold text-green-600 mb-3 flex items-center gap-2">
              🚩 Điểm xuất phát
            </h2>
            <div
              className="flex items-start gap-3 py-3 px-4 rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 border-2 border-green-200 transition"
              onClick={() => handleScrollToMap(tour.startLocation)}
            >
              <FaMapMarkerAlt className="text-green-600 mt-1" size={18} />
              <div>
                <p className="font-medium text-green-800">{tour.startLocation.address}</p>
                <p className="text-sm text-gray-600">{tour.startLocation.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Các điểm đến */}
        <h2 className="text-lg font-semibold text-cyan-600 mb-3 flex items-center gap-2">
          📍 Các điểm đến
        </h2>
        <ul className="space-y-3">
          {tour.locations.map((loc, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 py-3 px-4 rounded-lg cursor-pointer hover:text-cyan-600 hover:bg-cyan-50 border border-gray-200 transition"
              onClick={() => handleScrollToMap(loc)}
            >
              <FaMapMarkerAlt className="text-cyan-500 mt-1" size={18} />
              <div>
                <p className="font-medium">
                  Ngày {loc.day}: {loc.address}
                </p>
                <p className="text-sm text-gray-500">{loc.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: Thông tin + chọn ngày + số lượng + giá */}
      <div className="md:col-span-1 bg-white rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-5 text-cyan-700">
            Thông tin chuyến đi
          </h1>
          <ul className="space-y-4 text-gray-700 text-base">
            <li className="flex items-start gap-3">
              <FaClock className="text-cyan-500 mt-1" size={20} />
              <span>
                <strong>Thời gian:</strong> {tour.duration} ngày 
              </span>
            </li>
            
            {/* Hiển thị thông tin booking khi đã chọn ngày */}
            {selectedDate && availability && (
              <li className="flex flex-col gap-2 p-4 bg-cyan-50 rounded-lg border-2 border-cyan-200">
                <div className="flex items-center gap-2 mb-1">
                  <FaUsers className="text-cyan-600" size={18} />
                  <span className="font-semibold text-cyan-800">
                    Tình trạng ngày {dayjs(selectedDate).format("DD/MM/YYYY")}:
                  </span>
                </div>
                {loadingAvailability ? (
                  <p className="text-sm text-gray-500 ml-7">Đang tải...</p>
                ) : (
                  <div className="ml-7">
                    {availability.remainingSlots === 0 ? (
                      <p className="text-red-600 font-bold">
                        ❌ Tour đã đủ người
                      </p>
                    ) : (
                      <p className="text-green-600 font-semibold">
                        ✅ Có thể đặt tour
                      </p>
                    )}
                  </div>
                )}
              </li>
            )}
            
            <li className="flex items-start gap-3">
              <span>{tour.description}</span>
            </li>
          </ul>

          {/* Ngày khởi hành */}
          <div className="max-w-md mx-auto mt-8">
            <ResponsiveDatePickers
              label="Chọn ngày khởi hành"
              availableDates={tour?.startDates || []}
              selectedDate={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
          </div>

          {/* Số lượng người lớn */}
          <div className="mt-6">
            <div className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <p className="font-medium">Người lớn</p>
                <p className="text-sm text-gray-500">&gt; 10 tuổi</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`px-3 py-1 rounded ${
                    numAdults <= 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => {
                    if (numAdults > 1) setNumAdults(numAdults - 1);
                  }}
                  disabled={numAdults <= 1}
                >
                  -
                </button>
                <span className="w-6 text-center">{numAdults}</span>
                <button
                  className={`px-3 py-1 rounded ${
                    numAdults >= (availability?.remainingSlots || tour?.maxGroupSize)
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => {
                    const maxAllowed = availability 
                      ? availability.remainingSlots 
                      : tour?.maxGroupSize;
                    if (numAdults < maxAllowed) {
                      setNumAdults(numAdults + 1);
                    }
                  }}
                  disabled={numAdults >= (availability?.remainingSlots || tour?.maxGroupSize)}
                >
                  +
                </button>
              </div>
            </div>
            
            {!selectedDate && (
              <p className="text-sm text-gray-500 mt-2">
                Vui lòng chọn ngày khởi hành để xem tình trạng tour
              </p>
            )}
            {/* Tổng giá */}
            <div className="text-center mt-4">
              <p className="text-lg font-semibold text-orange-500">
                Tổng Giá Tour: {totalPrice.toLocaleString()} đ
              </p>
            </div>
          </div>
        </div>

        {/* Nút đặt tour */}
        <div className="text-center mt-6">
          <button
            onClick={handleBookingClick}
            className="bg-cyan-500 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl text-lg"
          >
            Yêu cầu đặt
          </button>
        </div>
      </div>
    </section>
  );
};

export default TourInfo;
