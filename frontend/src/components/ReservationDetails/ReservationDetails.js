import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";
import "./ReservationDetails.css"
const ReservationDetails = ({ reservationId }) => {
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const params = useParams();

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/newReservation/${params.id}/`)
            .then(response => {
                setReservation(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Error fetching reservation details');
                setLoading(false);
            });
    }, [params.id]);

    const handlePayment = () => {
        axios.post(`http://127.0.0.1:8000/api/reservation/${reservationId}/pay/`)
            .then(response => {
                setPaymentSuccess(true);
                setReservation({ ...reservation, is_paid: true });
            })
            .catch(err => {
                setError('Payment failed');
            });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="reservation-details">
            <h2>Reservation Details</h2>
            <p><strong>Reservation ID:</strong> {reservation.reservation_id}</p>
            <p><strong>User:</strong> {reservation.user}</p>
            <p><strong>Room Type:</strong> {reservation.room_type}</p>
            <p><strong>Check-in Date:</strong> {reservation.check_in}</p>
            <p><strong>Check-out Date:</strong> {reservation.check_out}</p>
            <p><strong>Total Price:</strong> ${reservation.total_price}</p>
            <p><strong>Payment Status:</strong> {reservation.is_paid ? 'Paid' : 'Pending'}</p>
            {!reservation.is_paid && (
                <button onClick={handlePayment} className="pay-button">Pay Now</button>
            )}
            {paymentSuccess && <p className="success-message">Payment was successful!</p>}
        </div>
    );
};

export default ReservationDetails;
