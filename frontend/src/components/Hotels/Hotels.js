import React from 'react';
import { Link } from 'react-router-dom';
import './Hotels.css';

const hotels = [
  { id: 1, name: 'Hotel Kraków', city: 'Kraków', image: '/images/krakow.jpg' },
  { id: 2, name: 'Hotel Warszawa', city: 'Warszawa', image: '/images/warszawa.jpg' },
  { id: 3, name: 'Hotel Poznań', city: 'Poznań', image: '/images/poznan.jpg' },
];

const Hotels = () => {
  return (
    <div className="hotel-list">
      <h2>Nasze Hotele</h2>
      <div className="hotel-list-container">
        {hotels.map(hotel => (
          <div key={hotel.id} className="hotel-card">
            <img src={hotel.image} alt={hotel.name} />
            <h3>{hotel.name}</h3>
            <p>{hotel.city}</p>
            <Link to={`/hotel/${hotel.id}`} className="button">Zobacz szczegóły</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hotels;
