import React, { useState } from "react";

const TourBanner = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full flex flex-col items-center my-10 container mx-auto">
      {/* Slider chính */}
      <div className="w-full h-[500px] rounded-lg overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={`Tour ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>

      {/* Thumbnail preview */}
      <div className="mt-4 flex gap-4 flex-wrap justify-center">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`w-16 h-16 cursor-pointer border-4 rounded-lg overflow-hidden ${
              currentIndex === idx
                ? "border-cyan-500"
                : "border-transparent hover:border-gray-300"
            }`}
            onClick={() => handleThumbnailClick(idx)}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourBanner;
