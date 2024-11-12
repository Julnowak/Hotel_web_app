import React from 'react';

const StarRating = ({ rating }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<i key={i} className="fa-solid fa-star" />);
      } else if (rating >= i - 0.5) {
        stars.push(<i className="fa-solid fa-star-half-stroke"/>);
      } else {
        stars.push(<i key={i} className="fa-regular fa-star" />);
      }
    }
    return stars;
  };

  return <div className="star-rating">{renderStars()}</div>;
};

export default StarRating;
