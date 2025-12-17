import { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";

import MapLocation from "../components/tour-detail/MapLocation";
import TourBanner from "../components/tour-detail/TourBanner";
import TourHeader from "../components/tour-detail/TourHeader";
import TourInfo from "../components/tour-detail/TourInfo";
import { TOUR_SAMPLE } from "../data/tour";
import { getTourBySlug } from "../services/api";
import TourReviews from "../components/tour-detail/TourReview";

const TourDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await getTourBySlug(slug);
        setTour(response.data.data.tour);
        setSelectedLocation(response.data.data.tour.locations[0]);
      } catch (err) {
        console.error("Failed to fetch tour:", err);
        setError("Tour not found");
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [slug]);

  if (loading) {
    return (
      <div className="p-12 text-center">
        <p className="text-xl font-semibold text-cyan-600">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-bold text-red-500">{error}</h2>
        <button
          onClick={() => navigate("/tour-list")}
          className="mt-4 bg-cyan-500 text-white py-2 px-4 rounded-lg"
        >
          Quay lại danh sách tour
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white text-black py-4 px-12">
      <TourHeader tour={tour} />

      <TourBanner images={tour?.images} />

      <TourInfo
        tour={tour}
        onSelectLocation={(location) => setSelectedLocation(location)}
      />

      <MapLocation
        locations={tour?.locations }
        startLocation={tour?.startLocation}
        selectedLocation={selectedLocation}
      />
      {tour && <TourReviews tourId={tour.id} />}
    </div>
  );
};

export default TourDetailPage;
