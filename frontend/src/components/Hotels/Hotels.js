import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import './Hotels.css';
import StarRating from "../StarRating/StarRating";

import axios from "axios";
import {API_BASE_URL} from "../../config";

// const hotels = [
//   { id: 1, name: 'Hotel Weles', city: 'Kraków', image: '/images/hotel_loc_images/krakow.jpg' },
//   { id: 2, name: 'Hotel Weles', city: 'Warszawa', image: '/images/hotel_loc_images/warszawa.jpg' },
//   { id: 3, name: 'Hotel Weles', city: 'Zakopane', image: '/images/hotel_loc_images/zakopane.jpg' },
// ];

function normalizeString(text) {
  // Mapowanie polskich znaków na ich odpowiedniki bez ogonków
  const polishCharMap = {
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
    'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
    'Ą': 'a', 'Ć': 'c', 'Ę': 'e', 'Ł': 'l', 'Ń': 'n',
    'Ó': 'o', 'Ś': 's', 'Ź': 'z', 'Ż': 'z'
  };

  // Konwertuj string na małe litery i zamień polskie znaki
  return text.toLowerCase().replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, char => polishCharMap[char] || char);
}

const Hotels = () => {

    const [hotels, setHotels] = useState([]);

    // Fetch list of hotels
    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/hotels/`);
                setHotels(response.data);
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };

        if (!hotels.length) fetchHotels();
    }, [hotels]);

  return (
    <div className="hotel-list">
      <h2>Nasze Hotele</h2>
      <div className="hotel-list-container">
        {hotels.map(hotel => (
          <div key={hotel.hotel_id} className="hotel-card">
            <img src={"/images/hotel_loc_images/" + normalizeString(hotel.localization) + ".jpg"} alt={hotel.name} />
            <h4 style={{margin:5}}>{hotel.localization}</h4>
            <p>{hotel.address}</p>
            <StarRating rating={hotel.rating}/>
            <Link to={`/hotel/${hotel.hotel_id}`} className="button reserve-button">Zobacz szczegóły</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hotels;
