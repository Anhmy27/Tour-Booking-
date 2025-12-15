import { createContext, useEffect, useState } from "react";
import { getTours } from "../services/api";

const TourContext = createContext({
  tours: [],
  loading: true,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    results: 0,
  },
  searchTours: () => {},
});

const TourProvider = ({ children }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    results: 0,
  });
  const [currentFilters, setCurrentFilters] = useState({});

  const fetchTours = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getTours(params);
      setTours(response.data.data.tours);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        results: response.data.results,
      });
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
    const mergedParams = { ...currentFilters, ...params };
    setCurrentFilters(mergedParams);
    fetchTours(mergedParams);
  };

  return (
    <TourContext.Provider value={{ tours, loading, pagination, searchTours }}>
      {children}
    </TourContext.Provider>
  );
};

export { TourContext, TourProvider };
