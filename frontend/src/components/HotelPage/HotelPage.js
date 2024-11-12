import React, {useEffect, useState} from 'react';
import { useParams, Link } from 'react-router-dom';
import './HotelPage.css';
import axios from "axios";
import StarRating from "../StarRating/StarRating";

const hotelData = {
  1: { name: 'Hotel Kraków', image: '/images/krakow.jpg', reviews: [4, 5, 5, 3], description: 'Hotel w sercu Krakowa.' },
  2: { name: 'Hotel Warszawa', image: '/images/warszawa.jpg', reviews: [5, 4, 5, 5], description: 'Nowoczesny hotel w Warszawie.' },
  3: { name: 'Hotel Poznań', image: '/images/poznan.jpg', reviews: [3, 4, 3, 4], description: 'Hotel przyjazny rodzinom w Poznaniu.' },
};


const HotelPage = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  // const averageRating = (hotel.reviews.reduce((sum, rating) => sum + rating, 0) / hotel.reviews.length).toFixed(1);

    // Fetch list of hotels
    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/hotel/${id}/`);
                setHotel(response.data)
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };
        console.log(hotel)
        if (!hotel) fetchHotels();
    }, [hotel, id]);

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

  if(hotel){
      return (
    <div className="hotel-page">
      <img src={"/images/hotel_loc_images/" + normalizeString(hotel.localization) + ".jpg"} alt={`Hotel Weles ${hotel?.localization}`} className="hotel-image" />
      <h2>Hotel Weles {hotel.localization}</h2>
      <p>{hotel.description}</p>
      <StarRating rating={hotel.rating}/>
      <p>Średnia ocen: {hotel.rating} / 5</p>

      <div className="buttons">
        <button className="reserve-button">Zarezerwuj</button>
        <Link to={`/hotel/${id}/gallery`} className="gallery-button">Zobacz galerię</Link>
      </div>

      <div className="reviews">
        <h3>Opinie</h3>
        {[5, 4, 5, 5].map((rating, index) => (
          <p key={index}>Ocena: {rating} / 5 ⭐</p>
        ))}
      </div>
    </div>
  );
  }

};

export default HotelPage;
