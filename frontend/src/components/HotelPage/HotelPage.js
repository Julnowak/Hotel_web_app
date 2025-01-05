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
    const [liked, setLiked] = useState(null);
    const [hoverRating, setHoverRating] = useState(0);
    const [newRating, setNewRating] = useState(0);
    const [newReview, setNewReview] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5;

    // Calculate the index range for the current page
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews?.slice(indexOfFirstReview, indexOfLastReview);

    // Calculate total pages
    const totalPages = Math.ceil(reviews?.length / reviewsPerPage);

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

    function onLike(e) {
        e.preventDefault()
        const csrfToken = Cookies.get("csrftoken"); // Extract CSRF token from cookies
        if (!csrfToken) {
            console.error("CSRF token not found!");
            return;
        }

        client.post(`http://127.0.0.1:8000/api/like/${hotel.hotel_id}/`, {}, {
            headers: {
                "X-CSRFToken": csrfToken,
            },
        },)
            .then(response => {
                setLiked(!liked)
            })
            .catch(error => console.error('Error:', error));

        client.get(`http://127.0.0.1:8000/api/like/${id}/`)
            .then(response => {
                setLiked(response.data.ans)
            })
            .catch(error => console.error('Error:', error));
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
                client.get(`http://127.0.0.1:8000/api/like/${id}/`)
                    .then(response => {
                        setLiked(response.data.ans)
                        console.log(response.data.ans)
                    })
                    .catch(error => console.error('Error:', error));
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };
        if (!hotel) {
            fetchHotels();

        }

        const fetchReviews = async () => {
            try {
                const response = await client.get(`http://127.0.0.1:8000/api/reviews/`,
                    {
                        params: {
                            hotel_id: id
                        }
                    });
                setReviews(response.data)
                console.log(response.data[0].user.profile_picture.slice(15))
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };
        if (!reviews) fetchReviews();


    }, [hotel, id, reviews]);

    const generatePageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        const halfRange = Math.floor(maxPagesToShow / 2);

        let startPage = Math.max(1, currentPage - halfRange);
        let endPage = Math.min(totalPages, currentPage + halfRange);

        if (currentPage <= halfRange) {
            endPage = Math.min(maxPagesToShow, totalPages);
        } else if (currentPage + halfRange >= totalPages) {
            startPage = Math.max(1, totalPages - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

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
                    {localStorage.getItem("user_type") === "klient" || null ?
                        <Link style={{color: "white"}} className="reserve-button"
                              to={`/reservation/?hotelId=${hotel.hotel_id}`}>Zarezerwuj</Link> : null}

                    <Link to={`/gallery/${id}/`} style={{color: "white"}} className="reserve-button">Zobacz
                        galerię</Link>
                    {localStorage.getItem("user_type") === "klient" ? (!liked ?

                            <Link style={{color: "white"}}
                                  onClick={onLike}
                                  className="reserve-button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                     className="bi bi-suit-heart" viewBox="0 0 16 16">
                                    <path
                                        d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.6 7.6 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"/>
                                </svg>
                                <span>Polub</span>
                            </Link>
                            : <Link style={{color: "white"}}
                                    onClick={onLike}
                                    className="reserve-button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-suit-heart-fill" viewBox="0 0 16 16">
                                    <path
                                        d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1"/>
                                </svg>
                                <span>Polubiono</span>
                            </Link>
                    ) : null}
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
                            currentReviews?.map((review, index) => (
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
                                        src={review.user?.profile_picture?.slice(15) || "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"}
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
                    {localStorage.getItem("user_type") === "klient" ?
                        <div style={{width: "100%", textAlign: "center", marginTop: 20}}>
                            {showForm ? null :
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="reserve-button"
                                >
                                    Dodaj opinię
                                </button>}
                        </div>
                        : null}

                    <div
                        style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px'}}>
                        <button
                            onClick={() => setCurrentPage((prev) => 1)}
                            disabled={currentPage === 1}
                            style={{padding: "8px 12px",
                                    margin: "0 5px",
                                    background: currentPage === 1 ? "#fff" : "#333",
                                    color: currentPage === 1 ? "#333" : "#fff",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    cursor: "pointer",}}
                        >
                            {`<<`}
                        </button>

                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={{padding: "8px 12px",
                                    margin: "0 5px",
                                    background: currentPage === 1 ? "#fff" : "#333",
                                    color: currentPage === 1 ? "#333" : "#fff",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    cursor: "pointer",}}
                        >
                            {'<'}
                        </button>
                        {generatePageNumbers().map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                style={{
                                    padding: '5px 10px',
                                    margin: '0 5px',
                                    cursor: 'pointer',
                                    backgroundColor: page === currentPage ? 'gray' : 'white',
                                    color: page === currentPage ? 'black' : 'black',
                                }}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            style={{padding: "8px 12px",
                                    margin: "0 5px",
                                    background: currentPage === totalPages ? "#fff" : "#333",
                                    color: currentPage === totalPages ? "#333" : "#fff",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    cursor: "pointer",}}
                        >
                            >
                        </button>
                        <button
                            onClick={() => setCurrentPage((prev) => totalPages)}
                            disabled={currentPage === totalPages}
                            style={{padding: "8px 12px",
                                    margin: "0 5px",
                                    background: currentPage === totalPages ? "#fff" : "#333",
                                    color: currentPage === totalPages ? "#333" : "#fff",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    cursor: "pointer",}}
                        >
                            >>
                        </button>
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
                                <p style={{display: "inline", marginRight: 20}}>Wybierz ocenę:</p>
                                {renderStars(
                                    hoverRating || newRating,
                                    (rating) => setHoverRating(rating),
                                    (rating) => {
                                        setNewRating(rating);
                                        setHoverRating(0);
                                    }
                                )}
                            </div>

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
                                    </button> : null}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

};

export default HotelPage;
