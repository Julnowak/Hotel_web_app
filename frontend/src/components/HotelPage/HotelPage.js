import React, {useEffect, useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import './HotelPage.css';
import StarRating from "../StarRating/StarRating";
import client from "../client";
import Cookies from "js-cookie";


const HotelPage = () => {
    const {id} = useParams();
    const [hotel, setHotel] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);
    const [newRating, setNewRating] = useState(0);
    const [newReview, setNewReview] = useState("");

    const handleAddReview = () => {
        if (newReview && newRating) {
            setReviews([...reviews, {rating: newRating, review: newReview}]);
            setNewRating(0);
            setNewReview("");
            setShowForm(false);
            const csrfToken = Cookies.get("csrftoken"); // Extract CSRF token from cookies
            if (!csrfToken) {
                console.error("CSRF token not found!");
                return;
            }

            client.post('http://127.0.0.1:8000/api/reviews/', {
                rating: newRating,
                description: newReview,
                hotel: hotel,

            }, {
                headers: {
                    "X-CSRFToken": csrfToken,
                },
            },)
                .then(response => {
                    if (response.status === 200) {
                        setReviews(response.data)
                        console.log("Udało się");
                    } else {
                        console.log("Failed to update user");
                    }
                })
                .catch(error => console.error('Error:', error));


        }
    };

    function changeReview(e) {
        e.preventDefault()
        setNewReview(e.target.value)
        // setReviews(null)
    }

    const renderStars = (rating, onHover = () => {
    }, onClick = () => {
    }) => {
        return Array.from({length: 5}, (_, index) => (
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
        if (!hotel) fetchHotels();

        const fetchReviews = async () => {
            try {
                const response = await client.get(`http://127.0.0.1:8000/api/reviews/`,
                    {
                        params: {
                            hotel_id: id
                        }
                    });
                setReviews(response.data)
                console.log(response.data)
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };
        if (!reviews) fetchReviews();


    }, [hotel, id, reviews]);

    console.log("frontend/public/images/media/fox-study_44rp7YD.jpg".slice(15))
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

    if (hotel) {
        return (
            <div className="hotel-page">
                <img src={"/images/hotel_loc_images/" + normalizeString(hotel.localization) + ".jpg"}
                     alt={`Hotel Weles ${hotel?.localization}`} className="hotel-image"/>
                <h2>Hotel Weles {hotel.localization}</h2>
                <h5 style={{color: "gray"}}>{hotel.address}</h5>
                <span>&nbsp;</span>
                <div className="hotel-info-container">
                    <p className="hotel-description">{hotel.description}</p>
                    <div
                        className="hotel-rating"
                        style={{
                            padding: "20px",
                            height: "100%", // Adjust height
                            display: "flex", // Optional: Ensures contents align nicely
                            flexDirection: "column", // Optional: Vertical alignment of content
                            justifyContent: "center", // Center vertically
                        }}
                    >
                        <StarRating rating={hotel.rating}/>
                        <p className="rating-average">
                            Średnia ocen:
                            <pre style={{fontFamily: "courier new"}}>{hotel.rating} / 5.00</pre>
                        </p>
                    </div>
                </div>

                <span>&nbsp;</span>
                <div className="buttons">
                    <Link className="reserve-button" to={`/reservation/?hotelId=${hotel.hotel_id}`}>Zarezerwuj</Link>
                    <Link to={`/gallery/${id}/`} className="gallery-button">Zobacz galerię</Link>
                    {/*<Link to={`/gallery/`} className="gallery-button">Zobacz galerię</Link>*/}
                </div>
                <span>&nbsp;</span>
                <div className="reviews" style={{padding: "20px", maxWidth: "600px", margin: "auto"}}>
                    <div className="reviews" style={{
                        padding: "20px",
                        maxWidth: "600px",
                        margin: "auto",
                        borderRadius: "10px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
                    }}>
                        <h3 style={{textAlign: "center", color: "#333", fontWeight: "bold", marginBottom: "20px"}}>
                            Najnowsze opinie
                        </h3>
                        {reviews?.length === 0 ? (
                            <p style={{textAlign: "center", color: "#666", fontStyle: "italic"}}>
                                Brak recenzji hotelu. Bądź pierwszym, który oceni nasz hotel!
                            </p>
                        ) : (
                            reviews?.map((review, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        padding: "15px",
                                        borderBottom: "1px solid #eee",
                                        marginBottom: "10px",
                                    }}
                                >
                                    {/* Profile Picture */}
                                    <img
                                        src={review.user?.profile_image?.slice(15) || "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"}
                                        alt="Profile"
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            marginRight: "15px",
                                            border: "2px solid #ccc",
                                        }}
                                    />
                                    {/* Review Content */}
                                    <div style={{flex: 1}}>
                                        {/* Username and Star Rating */}
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}>
                                            <p style={{margin: 0, fontWeight: "bold", color: "#444"}}>
                                                {review.user?.username || "Anonimowy Użytkownik"}
                                            </p>
                                            <StarRating rating={review.rating}/>
                                        </div>
                                        {/* Review Text */}
                                        <p style={{margin: "5px 0 0", color: "#555", lineHeight: "1.5"}}>
                                            {review.description || "Brak opisu dla tej recenzji."}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div style={{width: "100%", textAlign: "center"}}>
                        {showForm ? null :
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="reserve-button"
                        >
                             Dodaj opinię
                        </button>}
                    </div>


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
                            <h4 style={{textAlign: "center"}}>Dodaj swoją opinię</h4>
                            <div style={{marginBottom: "10px"}}>
                                <p style={{display: "inline", marginRight: 20 }}>Wybierz ocenę:</p>
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

                            <label style={{display: "block", margin: "10px 0"}}>
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

                            <div style={{width: "100%", textAlign: "center"}}>
                                <button
                                    onClick={handleAddReview}
                                    className="reserve-button"
                                    style={{textAlign: "center", margin: 20}}
                                >
                                    Dodaj
                                </button>

                                {showForm ?
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="reserve-button"
                                    style={{textAlign: "center", margin: 20}}
                                >
                                     Anuluj
                                </button>: null}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

};

export default HotelPage;
