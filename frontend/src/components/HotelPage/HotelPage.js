import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './HotelPage.css';

const hotelData = {
  1: { name: 'Hotel Kraków', image: '/images/krakow.jpg', reviews: [4, 5, 5, 3], description: 'Hotel w sercu Krakowa.' },
  2: { name: 'Hotel Warszawa', image: '/images/warszawa.jpg', reviews: [5, 4, 5, 5], description: 'Nowoczesny hotel w Warszawie.' },
  3: { name: 'Hotel Poznań', image: '/images/poznan.jpg', reviews: [3, 4, 3, 4], description: 'Hotel przyjazny rodzinom w Poznaniu.' },
};

const HotelPage = () => {
  const { id } = useParams();
  const hotel = hotelData[id];
  const averageRating = (hotel.reviews.reduce((sum, rating) => sum + rating, 0) / hotel.reviews.length).toFixed(1);

  return (
    <div className="hotel-page">
      <img src={hotel.image} alt={hotel.name} className="hotel-image" />
      <h2>{hotel.name}</h2>
      <p>{hotel.description}</p>
      <p>Średnia ocen: {averageRating} / 5 ⭐</p>

      <div className="buttons">
        <button className="reserve-button">Zarezerwuj</button>
        <Link to={`/hotel/${id}/gallery`} className="gallery-button">Zobacz galerię</Link>
      </div>

      <div className="reviews">
        <h3>Opinie</h3>
        {hotel?.reviews.map((rating, index) => (
          <p key={index}>Ocena: {rating} / 5 ⭐</p>
        ))}
      </div>
    </div>
  );
};

export default HotelPage;
