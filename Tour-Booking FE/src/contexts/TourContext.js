import { createContext, useEffect, useState } from "react";
import { getTours } from "../services/api";

const TourContext = createContext({
  tours: [],
  loading: true,
  searchTours: () => {},
});

const TourProvider = ({ children }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTours = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getTours(params);
      setTours(response.data.data.tours);
    } catch (error) {
      console.error("Failed to fetch tours:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const searchTours = (params) => {
    fetchTours(params);
  };

  return (
    <TourContext.Provider value={{ tours, loading, searchTours }}>
      {children}
    </TourContext.Provider>
  );
};

export { TourContext, TourProvider };
