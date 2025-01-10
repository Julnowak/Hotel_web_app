import React, { useState, useEffect } from 'react';
import {useParams} from "react-router-dom";
import "./ReceptionistManageReservation.css"
import client from "../client";
import {API_BASE_URL} from "../../config";
import BookingCalendar from "../BookingCalendar/BookingCalendar";


const ReceptionistManageReservation = () => {
    const [reservation, setReservation] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [flag, setFlag] = useState(false);
    const [updatedReservation, setUpdatedReservation] = useState({});
    const [error, setError] = useState('');
    const [periods, setPeriods] = useState({});
    const [guest, setGuest] = useState('');
    const params = useParams()

    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const response = await client.get(`${API_BASE_URL}/receptionist/reservation/${params.id}`);
                setReservation(response.data.reservation_data);
                console.log(response.data.reservation_data)
                setUpdatedReservation(response.data.reservation_data);
                setGuest(response.data.user_data)

                if (response.data.reservation_data){
                    fetchAvailability(response.data.reservation_data);

                }
            } catch (error) {
                setError('Błąd pobierania rezerwacji');
            }
        };

        const fetchAvailability = async (res) => {
            try {
                const response = await client.get(`${API_BASE_URL}/roomAvailability/${res.room_id}`);
                setPeriods(response.data.periods);
                setFlag(true)

            } catch (error) {
                setError('Błąd pobierania rezerwacji');
            }
        };

        if (!flag){
            fetchReservation();
        }

    }, [flag, params.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedReservation({ ...updatedReservation, [name]: value });
    };

    const handleSave = async () => {
        try {
            const csrfToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken'))
            ?.split('=')[1];

            await client.put(`${API_BASE_URL}/receptionist/reservation/${params.id}/`, updatedReservation,{
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json',
            }});
            setIsEditing(false);
        } catch (error) {
            setError('Błąd podczas zapisywania rezerwacji');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setUpdatedReservation(reservation); // Reset to original reservation
    };


    if (!reservation) {
        return <div>Ładowanie rezerwacji...</div>;
    }

    return (
        <div className="reservation-details-receptionist" style={{marginTop: 40, marginBottom: 40}}>
            <h1>Szczegóły Rezerwacji</h1>
            {error && <p className="error">{error}</p>}
            <div className="reservation-form">
                <div className="form-group">
                    <label>Numer rezerwacji:</label>
                    <input
                        type="text"
                        name="reservation_number"
                        value={params.id}
                        disabled={true}
                    />
                </div>
                <div className="form-group">
                    <label>Imię gościa:</label>
                    <input
                        type="text"
                        name="guest_name"
                        value={guest.username}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>

                <div className="form-group">
                    <label>Data zameldowania:</label>
                    <input
                        type="date"
                        name="check_in"
                        value={updatedReservation.check_in}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>

                <div className="form-group">
                    <label>Data wymeldowania:</label>
                    <input
                        type="date"
                        name="check_out"
                        value={updatedReservation.check_out}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>
                { periods.length > 0?
                 <div style={{ marginTop: 20, marginBottom: 20}}>
                    <BookingCalendar bookedPeriods={periods} />
                 </div>: null}


                <div className="form-group">
                    <label>Liczba gości:</label>
                    <input
                        type="number"
                        name="people_number"
                        value={updatedReservation.people_number}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>

                <div className="form-group">
                    <label>Status:</label>
                    <select
                        name="status"
                        value={updatedReservation.status}
                        onChange={handleChange}
                        disabled={!isEditing}
                    >
                        <option value="Oczekująca">Oczekująca</option>
                        <option value="W trakcie">W trakcie</option>
                        <option value="Częściowo opłacona">Częściowo opłacona</option>
                        <option value="Opłacona">Opłacona</option>
                        <option value="Anulowana">Anulowana</option>

                        <option value="Zakończona">Zakończona</option>

                    </select>
                </div>
                <div className="form-actions">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave}>Zapisz</button>
                            <button onClick={handleCancel}>Anuluj</button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)}>Edytuj</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReceptionistManageReservation;
