import React, {useEffect, useState} from 'react';
import { useParams, Link } from 'react-router-dom';
import './HotelPage.css';
import axios from "axios";
import StarRating from "../StarRating/StarRating";
import client from "../client";


const HotelPage = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState("");

  const handleAddReview = () => {
    if (newReview && newRating) {
      setReviews([...reviews, { rating: newRating, review: newReview }]);
      setNewRating(0);
      setNewReview("");
      setShowForm(false);


        client.post('http://127.0.0.1:8000/api/reviews/', {
            rating: newRating,
            description: newReview,
            hotel: hotel,

        })
            .then(response => {
                if (response.status === 200) {
                    console.log("Udało się");
                } else {
                    console.log("Failed to update user");
                }
            })
            .catch(error => console.error('Error:', error));


    }
  };

  function changeReview(e){
      e.preventDefault()
      setNewReview(e.target.value)
      setReviews(null)
  }

  const renderStars = (rating, onHover = () => {}, onClick = () => {}) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        style={{
          fontSize: "24px",
          cursor: "pointer",
          color: index < rating ? "#FFD700" : "#ddd",
        }}
        onMouseEnter={() => onHover(index + 1)}
        onMouseLeave={() => onHover(0)}
        onClick={() => onClick(index + 1)}
      >
        ★
      </span>
    ));
  };


    // Fetch list of hotels
    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await client.get(`http://127.0.0.1:8000/api/hotel/${id}/`);
                setHotel(response.data)
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };
        console.log(hotel)
        if (!hotel) fetchHotels();

        const fetchReviews = async () => {
            try {
                const response = await client.get(`http://127.0.0.1:8000/api/reviews/`);
                setReviews(response.data)
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };
        console.log(hotel)
        if (!reviews) fetchReviews ();



    }, [hotel, id, reviews]);

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
        <Link className="reserve-button">Zarezerwuj</Link>
        <Link to={`/hotel/${id}/gallery`} className="gallery-button">Zobacz galerię</Link>
      </div>

     <div className="reviews" style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h3>Opinie</h3>
      {reviews?.length === 0 ? (
        <p>Brak recenzji hotelu. Bądź pierwszym, który oceni nasz hotel!</p>
      ) : (
        reviews?.map((review, index) => (
          <p key={index}>
            <StarRating rating={review.rating}/> - {review.description? review.description: newReview}
          </p>
        ))
      )}
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "15px",
        }}
      >
        {showForm ? "Anuluj" : "Dodaj opinię"}
      </button>

      {showForm && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h4>Dodaj swoją opinię</h4>
          <div style={{ marginBottom: "10px" }}>
            <p>Wybierz ocenę:</p>
            {renderStars(
              hoverRating || newRating,
              (rating) => setHoverRating(rating),
              (rating) => {
                setNewRating(rating);
                setHoverRating(0);
              }
            )}
          </div>


          {/*<label style={{ display: "block", margin: "10px 0" }}>*/}
          {/*  Nazwa:*/}
          {/*  <input*/}
          {/*    value={newReview}*/}
          {/*    onChange={(e) => setNewReview(e.target.value)}*/}
          {/*    placeholder="Podaj swoją nazwę..."*/}
          {/*    style={{*/}
          {/*      width: "100%",*/}
          {/*      padding: "8px",*/}
          {/*      borderRadius: "4px",*/}
          {/*      border: "1px solid #ccc",*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</label>*/}

          <label style={{ display: "block", margin: "10px 0" }}>
            Opinia:
            <textarea
              value={newReview}
              onChange={changeReview}
              placeholder="Podziel się swoimi wrażeniami..."
              style={{
                width: "100%",
                height: "80px",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </label>
          <button
            onClick={handleAddReview}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Dodaj opinię
          </button>
        </div>
      )}
    </div>
    </div>
  );
  }

};

export default HotelPage;
