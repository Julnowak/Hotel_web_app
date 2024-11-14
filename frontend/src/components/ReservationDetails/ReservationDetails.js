import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import "./ReservationDetails.css"


const ReservationDetails = () => {
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const params = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const checkIn = queryParams.get('checkIn');
    const checkOut = queryParams.get('checkOut');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/newReservation/${params.id}/`, {
            params: {
                checkIn: checkIn,
                checkOut: checkOut
            }
        })
            .then(response => {
                setReservation(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Error fetching reservation details');
                setLoading(false);
            });
    }, [checkIn, checkOut, params.id]);

    const handlePayment = () => {
        axios.post(`http://127.0.0.1:8000/api/newReservation/${params.id}/`,
            {
            checkIn: checkIn,
            checkOut: checkOut,
            peopleNumber: reservation.people_number
        },
        {
            headers: {
                'X-CSRFToken': document.cookie
                    .split('; ')
                    .find(row => row.startsWith('csrftoken'))
                    ?.split('=')[1],  // Ensure CSRF token is correctly extracted
                'Content-Type': 'application/json'
            }
        }
    )
            .then(response => {
                setPaymentSuccess(true);
                // setReservation({...reservation, is_paid: true});
                if (localStorage.getItem("klient")){
                    navigate("/customer/panel/")
                }
                else {
                    navigate("/")
                }

            })
            .catch(err => {
                setError('Payment failed');
            });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="reservation-details">
            <h2 className="reservation-title">Szczegóły Rezerwacji</h2>

            {/* Room Image */}
            <div className="room-image-container">
                <img src={"https://johndog.pl/wp-content/uploads/2023/05/artykul-john-dog-rasy-kotow-kot-bengalski-803x503px.jpg"} alt="Room" className="room-image"/>
            </div>

            <div className="reservation-info">
                <p><strong>Użytkownik:</strong> {reservation.user}</p>

                {reservation.name && (
                    <p><strong>Imię:</strong> {reservation.name}</p>
                )}

                {reservation.surname && (
                    <p><strong>Nazwisko:</strong> {reservation.surname}</p>
                )}

                <p><strong>Typ pokoju:</strong> {reservation.room_type}</p>
                <p><strong>Data zameldowania:</strong> {checkIn}, 14:00</p>
                <p><strong>Data wymeldowania:</strong> {checkOut}, 12:00</p>

                {/* Price and deposit */}
                <div className="price-info">
                    <p><strong>Cena całkowita:</strong> {reservation.price.toFixed(2)} zł</p>
                    <p><strong>Zadatek:</strong> {(reservation.price * 0.3).toFixed(2)} zł</p>
                </div>

                {/* People number with icons */}
                <p className="people-count">
                    <strong>Liczba osób:</strong>
                    {[...Array(reservation.people_number)].map((_, index) => (
                        <i className="fa-solid fa-user" key={index}></i>
                    ))}  x {reservation.people_number}
                </p>

                {/* Payment button */}
                {!reservation.is_paid && (
                    <button onClick={handlePayment} className="pay-button">Zatwierdź i zapłać</button>
                )}
                <button onClick={() => navigate(-1)} className="return-button">Wróć</button>
                {paymentSuccess && <p className="success-message">Płatność zakończona sukcesem!</p>}
            </div>
        </div>
    );
};

export default ReservationDetails;
