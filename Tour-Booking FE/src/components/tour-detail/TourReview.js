import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const TourReviews = ({ tourId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tourId) {
      setLoading(false);
      return;
    }

    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}reviews/tour/${tourId}`
        );
        setReviews(res.data.data || []);
      } catch (err) {
        console.error("Lỗi khi lấy đánh giá:", err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [tourId]);

  return (
    <div className="mt-10 border-t pt-8">
      <h2 className="text-2xl font-semibold text-cyan-700 mb-4">
        Đánh giá Tour
      </h2>

      {loading ? (
        <p>Đang tải đánh giá...</p>
      ) : reviews.length === 0 ? (
        <p>Chưa có đánh giá nào cho tour này.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((rev) => (
            <li key={rev._id} className="border rounded-lg p-4 bg-gray-50">
              <div className="text-yellow-500">
                {"⭐".repeat(rev.rating)}{" "}
                <span className="text-gray-600 text-sm ml-2">
                  {rev.user?.name || "Người dùng ẩn danh"}
                </span>
              </div>
              <p className="text-gray-800 mt-2">{rev.review}</p>
              <p className="text-gray-500 text-sm mt-1">
                {dayjs(rev.createdAt).format("HH:mm DD/MM/YYYY")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TourReviews;
