import React, {useEffect, useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import './HotelPage.css';
import StarRating from "../StarRating/StarRating";
import client from "../client";
import Cookies from "js-cookie";
import {API_BASE_URL} from "../../config";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";


const HotelPage = () => {
    const {id} = useParams();
    const [hotel, setHotel] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [liked, setLiked] = useState(null);
    const [hoverRating, setHoverRating] = useState(0);
    const [newRating, setNewRating] = useState(0);
    const [tempRating, setTempRating] = useState(0);
    const [newReview, setNewReview] = useState("");
    const [error, setError] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5;

    const [sortOption, setSortOption] = useState("newest");

    // Calculate total pages
    const totalPages = Math.ceil(reviews?.length / reviewsPerPage);
    const handleSortChange = (option) => {
        let sortedReviews = [...reviews];
        if (option === "newest") {
            sortedReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (option === "oldest") {
            sortedReviews.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else if (option === "ratingAsc") {
            sortedReviews.sort((a, b) => a.rating - b.rating);
        } else if (option === "ratingDesc") {
            sortedReviews.sort((a, b) => b.rating - a.rating);
        }
        setSortOption(option);
        setReviews(sortedReviews);
    };
    const handleAddReview = () => {
        setError("")
        if (newReview && newRating) {

            setSortOption("newest");
            setTempRating(((Number(tempRating) * reviews.length) / (reviews.length + 1) + newRating / (reviews.length + 1)).toFixed(2));
            setReviews([...reviews, {rating: newRating, review: newReview}]);
            setNewRating(0);
            setNewReview("");

            setShowForm(false);
            const csrfToken = Cookies.get("csrftoken"); // Extract CSRF token from cookies
            if (!csrfToken) {
                console.error("CSRF token not found!");
                return;
            }

            client.post(`${API_BASE_URL}/reviews/`, {
                rating: newRating, description: newReview, hotel: hotel,

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


        } else {
            if (!newRating) {
                setError("Proszę wybrać prawidłową ocenę od 1 do 5.")
            } else {
                setError("Proszę wpisać opinię.")
            }
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

        client.post(`${API_BASE_URL}/like/${hotel.hotel_id}/`, {}, {
            headers: {
                "X-CSRFToken": csrfToken,
            },
        },)
            .then(response => {
                setLiked(!liked)
            })
            .catch(error => console.error('Error:', error));

        client.get(`${API_BASE_URL}/like/${id}/`)
            .then(response => {
                setLiked(response.data.ans)
            })
            .catch(error => console.error('Error:', error));
    }

    const renderStars = (rating, onHover = () => {
    }, onClick = () => {
    }) => {
        return Array.from({length: 5}, (_, index) => (<span
            key={index}
            style={{
                fontSize: "24px", cursor: "pointer", color: index < rating ? "#FFD700" : "#ddd",
            }}
            onMouseEnter={() => onHover(index + 1)}
            onMouseLeave={() => onHover(0)}
            onClick={() => onClick(index + 1)}
        >
        ★
      </span>));
    };


    // Fetch list of hotels
    useEffect(() => {

        const fetchHotels = async () => {
            try {
                const response = await client.get(`${API_BASE_URL}/hotel/${id}/`);
                setHotel(response.data)
                setTempRating(response.data.rating)
                client.get(`${API_BASE_URL}/like/${id}/`)
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
                const response = await client.get(`${API_BASE_URL}/reviews/`, {
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
            'ą': 'a',
            'ć': 'c',
            'ę': 'e',
            'ł': 'l',
            'ń': 'n',
            'ó': 'o',
            'ś': 's',
            'ź': 'z',
            'ż': 'z',
            'Ą': 'a',
            'Ć': 'c',
            'Ę': 'e',
            'Ł': 'l',
            'Ń': 'n',
            'Ó': 'o',
            'Ś': 's',
            'Ź': 'z',
            'Ż': 'z'
        };

        // Konwertuj string na małe litery i zamień polskie znaki
        return text.toLowerCase().replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, char => polishCharMap[char] || char);
    }

    if (hotel) {
        return (<div className="hotel-page">
            <img src={"/images/hotel_loc_images/" + normalizeString(hotel.localization) + ".jpg"}
                 alt={`Hotel Weles ${hotel?.localization}`} className="hotel-image"/>
            <h2>Hotel Weles {hotel.localization}</h2>
            <h5 style={{color: "gray"}}>{hotel.address}</h5>
            <span>&nbsp;</span>
            <div className="hotel-info-container">
                <div className="hotel-description">
                    {hotel.description}

                </div>
                <div
                    className="hotel-rating"
                    style={{
                        padding: "20px", height: "100%", // Adjust height
                        display: "flex", // Optional: Ensures contents align nicely
                        flexDirection: "column", // Optional: Vertical alignment of content
                        justifyContent: "center", // Center vertically
                    }}
                >
                    <StarRating rating={tempRating}/>
                    <p className="rating-average">
                        Średnia ocen:
                        <pre style={{fontFamily: "courier new"}}>{Number(tempRating).toFixed(2)} / 5.00</pre>
                    </p>
                </div>
            </div>

            <div style={{marginTop: 40}}>
                <h4 style={{textAlign: "center", fontWeight: "bold", marginBottom: "20px"}}>
                    Dodatkowe usługi
                </h4>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <div style={{textAlign: 'center'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                             className="bi bi-cup-hot-fill" viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                  d="M.5 6a.5.5 0 0 0-.488.608l1.652 7.434A2.5 2.5 0 0 0 4.104 16h5.792a2.5 2.5 0 0 0 2.44-1.958l.131-.59a3 3 0 0 0 1.3-5.854l.221-.99A.5.5 0 0 0 13.5 6zM13 12.5a2 2 0 0 1-.316-.025l.867-3.898A2.001 2.001 0 0 1 13 12.5"/>
                            <path
                                d="m4.4.8-.003.004-.014.019a4 4 0 0 0-.204.31 2 2 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.6.6 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3 3 0 0 1-.202.388 5 5 0 0 1-.253.382l-.018.025-.005.008-.002.002A.5.5 0 0 1 3.6 4.2l.003-.004.014-.019a4 4 0 0 0 .204-.31 2 2 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.6.6 0 0 0-.09-.252A4 4 0 0 0 3.6 2.8l-.01-.012a5 5 0 0 1-.37-.543A1.53 1.53 0 0 1 3 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a6 6 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 4.4.8"/>
                        </svg>
                        <div>Śniadanie (40 zł/doba/os)</div>
                    </div>

                    <div style={{textAlign: 'center'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                             className="bi bi-car-front-fill" viewBox="0 0 16 16">
                            <path
                                d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"/>
                        </svg>
                        <div>Parking (50 zł/doba)</div>
                    </div>

                    <div style={{textAlign: 'center'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                             className="bi bi-wifi" viewBox="0 0 16 16">
                            <path
                                d="M15.384 6.115a.485.485 0 0 0-.047-.736A12.44 12.44 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.52.52 0 0 0 .668.05A11.45 11.45 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164.205.148.49.13.668-.049"/>
                            <path
                                d="M13.229 8.271a.482.482 0 0 0-.063-.745A9.46 9.46 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.576 1.336c.206.132.48.108.653-.065m-2.183 2.183c.226-.226.185-.605-.1-.75A6.5 6.5 0 0 0 8 9c-1.06 0-2.062.254-2.946.704-.285.145-.326.524-.1.75l.015.015c.16.16.407.19.611.09A5.5 5.5 0 0 1 8 10c.868 0 1.69.201 2.42.56.203.1.45.07.61-.091zM9.06 12.44c.196-.196.198-.52-.04-.66A2 2 0 0 0 8 11.5a2 2 0 0 0-1.02.28c-.238.14-.236.464-.04.66l.706.706a.5.5 0 0 0 .707 0l.707-.707z"/>
                        </svg>
                        <div>Wi-Fi (bezpłatne)</div>
                    </div>
                </div>

            </div>
            <section style={{marginTop: 40}}>
                <h4 style={{textAlign: "center", fontWeight: "bold", marginBottom: "20px"}}>
                    Lokalizacja
                </h4>

                <MapContainer
                    center={[hotel.latitude, hotel.longitude]}
                    zoom={20}
                    scrollWheelZoom={false}
                    style={{
                        height: "500px",
                        width: "100%",
                        borderRadius: "10px",
                        overflow: "hidden",
                        marginTop: "20px",
                    }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker
                        key={hotel.hotel_id}
                        position={[hotel.latitude, hotel.longitude]}
                    >
                        <Popup>
                            <h4
                                style={{
                                    borderBottom: "2px solid black",
                                    paddingBottom: "5px",
                                    marginBottom: "5px",
                                    color: "#ff7329",
                                }}
                            >
                                Hotel Weles {hotel?.localization}
                            </h4>
                            <div style={{paddingBottom: 10}}>{hotel?.address} {hotel?.localization}</div>
                            <StarRating rating={hotel.rating}/>
                            <p style={{fontSize: "14px", color: "black"}}>
                                Godziny otwarcia:
                                <br></br>
                                <small>Poniedziałek - Niedziela: 8:00 - 20:00</small>
                                <br></br>
                            </p>
                        </Popup>
                    </Marker>
                </MapContainer>
            </section>

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
                    </Link> : <Link style={{color: "white"}}
                                    onClick={onLike}
                                    className="reserve-button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-suit-heart-fill" viewBox="0 0 16 16">
                            <path
                                d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1"/>
                        </svg>
                        <span>Polubiono</span>
                    </Link>) : null}
            </div>
            <span>&nbsp;</span>
            <div className="reviews" style={{padding: "20px", maxWidth: "600px", margin: "auto"}}>
                <div className="reviews" style={{padding: "20px", maxWidth: "600px", margin: "auto"}}>
                    <div style={{
                        padding: "20px",
                        maxWidth: "600px",
                        margin: "auto",
                        borderRadius: "10px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
                    }}>
                        <h3 style={{textAlign: "center", color: "#333", fontWeight: "bold", marginBottom: "20px"}}>
                            Opinie
                        </h3>

                        {/* Sort Options */}
                        <div style={{marginBottom: "20px", textAlign: "center"}}>
                            <label htmlFor="sort" style={{marginRight: "10px", color: "#555"}}>Sortuj
                                według:</label>
                            <select
                                id="sort"
                                value={sortOption}
                                onChange={(e) => handleSortChange(e.target.value)}
                                style={{
                                    padding: "5px 10px",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    color: "#444",
                                }}
                            >
                                <option value="newest">Najnowsze</option>
                                <option value="oldest">Najstarsze</option>
                                <option value="ratingDesc">Ocena: od najwyższej</option>
                                <option value="ratingAsc">Ocena: od najniższej</option>
                            </select>
                        </div>

                        {/* Reviews */}
                        {reviews?.length === 0 ? (
                            <p style={{textAlign: "center", color: "#666", fontStyle: "italic"}}>
                                Brak recenzji hotelu. Bądź pierwszym, który oceni nasz hotel!
                            </p>) : (reviews
                            ?.slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage)
                            .map((review, index) => (<div key={index}
                                                          style={{
                                                              display: "flex",
                                                              padding: "15px",
                                                              borderTop: "2px solid lightgray",
                                                              borderBottom: "2px solid lightgray",
                                                              borderRadius: "10px",
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
                                    <div style={{
                                        display: "flex", justifyContent: "space-between", alignItems: "center",
                                    }}>
                                        <div>
                                            <h5 style={{margin: 0, fontWeight: "bold", color: "#444"}}>
                                                {review.user?.username || "Anonimowy Użytkownik"}
                                            </h5>
                                            <small
                                                style={{display: "block", color: "#888", marginBottom: "8px"}}>
                                                Dodano: {new Date(review.created_at).toLocaleString().slice(0, -3) || "Brak daty"}
                                            </small>
                                        </div>
                                        <StarRating rating={review.rating}/>
                                    </div>
                                    <p style={{margin: "5px 0 0", color: "#555", lineHeight: "1.5"}}>
                                        {review.description || "Brak opisu dla tej recenzji."}
                                    </p>
                                </div>
                            </div>)))}
                    </div>
                </div>


                {localStorage.getItem("user_type") === "klient" ?
                    <div style={{width: "100%", textAlign: "center", marginTop: 20}}>
                        {showForm ? null : <button
                            onClick={() => setShowForm(!showForm)}
                            className="reserve-button"
                        >
                            Dodaj opinię
                        </button>}
                    </div> : null}

                {reviews?.length > 0 ? <div
                    style={{
                        display: 'flex',
                        marginTop: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}>
                    <button
                        onClick={() => setCurrentPage((prev) => 1)}
                        disabled={currentPage === 1}
                        style={{
                            padding: "8px 12px",
                            margin: "0 5px",
                            background: currentPage === 1 ? "#fff" : "#333",
                            color: currentPage === 1 ? "#333" : "#fff",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        {`<<`}
                    </button>

                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        style={{
                            padding: "8px 12px",
                            margin: "0 5px",
                            background: currentPage === 1 ? "#fff" : "#333",
                            color: currentPage === 1 ? "#333" : "#fff",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        {'<'}
                    </button>
                    {generatePageNumbers().map((page) => (<button
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
                    </button>))}
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={{
                            padding: "8px 12px",
                            margin: "0 5px",
                            background: currentPage === totalPages ? "#fff" : "#333",
                            color: currentPage === totalPages ? "#333" : "#fff",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        >
                    </button>
                    <button
                        onClick={() => setCurrentPage((prev) => totalPages)}
                        disabled={currentPage === totalPages}
                        style={{
                            padding: "8px 12px",
                            margin: "0 5px",
                            background: currentPage === totalPages ? "#fff" : "#333",
                            color: currentPage === totalPages ? "#333" : "#fff",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        >>
                    </button>
                </div> : null}

                {showForm && (<div
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
                        {renderStars(hoverRating || newRating, (rating) => setHoverRating(rating), (rating) => {
                            setNewRating(rating);
                            setHoverRating(0);
                        })}
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
                                        maxHeight: "300px"
                                    }}
                                />
                    </label>

                    {error ? <p style={{textAlign: "center", color: "red"}}>{error}</p> : null}

                    <div style={{width: "100%", textAlign: "center"}}>
                        <button
                            onClick={handleAddReview}
                            className="reserve-button"
                            style={{textAlign: "center", margin: 20}}
                        >
                            Dodaj
                        </button>

                        {showForm ? <button
                            onClick={() => setShowForm(!showForm)}
                            className="reserve-button"
                            style={{textAlign: "center", margin: 20}}
                        >
                            Anuluj
                        </button> : null}
                    </div>
                </div>)}
            </div>
        </div>);
    }

};

export default HotelPage;
