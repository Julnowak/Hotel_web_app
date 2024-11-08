import React, { useState } from 'react';
import './PhotoCarousel.css';

const PhotoCarousel = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex + 1) % (photos.length-2)
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + photos.length) % photos.length
    );
  };

  return (
    <div className="carousel-container">
      <button onClick={handlePrev} className="carousel-button">
        &#10094;
      </button>
      <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * 100 / 3}%)` }}>
        {photos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Slide ${index + 1}`}
            className="carousel-photo"
          />
        ))}
      </div>
      <button onClick={handleNext} className="carousel-button">
        &#10095;
      </button>
    </div>
  );
};

export default PhotoCarousel;
