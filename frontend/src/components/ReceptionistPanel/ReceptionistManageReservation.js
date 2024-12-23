import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";
import "./ReceptionistManageReservation.css"

const ReceptionistManageReservation = () => {
    const [reservation, setReservation] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedReservation, setUpdatedReservation] = useState({});
    const [error, setError] = useState('');
    const params = useParams()
    

    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/reservation/${params.id}`);
                setReservation(response.data);
                setUpdatedReservation(response.data);
            } catch (error) {
                setError('Błąd pobierania rezerwacji');
            }
        };

        fetchReservation();
    }, [params.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedReservation({ ...updatedReservation, [name]: value });
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/reservations/${params.id}/`, updatedReservation);
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
        <div className="reservation-details">
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
                        value={updatedReservation.guest_name}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="form-group">
                    <label>Data rezerwacji:</label>
                    <input
                        type="date"
                        name="reservation_date"
                        value={updatedReservation.reservation_date}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>

                <div className="form-group">
                    <label>Liczba gości:</label>
                    <input
                        type="number"
                        name="guests_number"
                        value={updatedReservation.guests_number}
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
                        <option value="Opłacona">Opłacona</option>
                        <option value="Częściowo opłacona">Częściowo opłacona</option>
                        <option value="Anulowana">Anulowana</option>
                        <option value="Edytowana">Edytowana</option>
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
