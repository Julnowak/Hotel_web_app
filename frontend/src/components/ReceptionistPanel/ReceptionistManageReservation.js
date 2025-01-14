import React, {useState, useEffect} from 'react';
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
    const [room, setRoom] = useState({});
    const [error, setError] = useState('');
    const [periods, setPeriods] = useState({});
    const [guest, setGuest] = useState('');
    const params = useParams()

    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const response = await client.get(`${API_BASE_URL}/receptionist/reservation/${params.id}`);
                setReservation(response.data.reservation_data);
                console.log(response.data.reservation_data.optional_guest_data)
                setUpdatedReservation(response.data.reservation_data);
                setRoom(response.data.room_data);
                setGuest(response.data.user_data)

                if (response.data.reservation_data) {
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

        if (!flag) {
            fetchReservation();
        }

    }, [flag, params.id]);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        console.log(name)
        console.log(value)
        if (name === "check_in" && value >= updatedReservation.check_out){
            return;
        }
        else if (name === "check_out" && value <= updatedReservation.check_in){
            return;
        }
        else if (name === "people_number" && (value <= 0 || value > room.people_capacity)){
            return;
        }

        else if (name === "paid_amount" && (value <= 0 || value > updatedReservation.price)){
            console.log("ds")
            return;
        }

        else if (name === "price" && value <= 0){
            return;
        }
        else {

        // For checkboxes, we need to use 'checked' instead of 'value'
        setUpdatedReservation({
            ...updatedReservation,
            [name]: type === "checkbox" ? checked : value,
        });
        }

    };


    const handleSave = async () => {
        try {
            const csrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken'))
                ?.split('=')[1];

            await client.put(`${API_BASE_URL}/receptionist/reservation/${params.id}/`, updatedReservation, {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                }
            });
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
                    <p><b>Numer rezerwacji: </b>{params.id}</p>
                    <p><b>Data utworzenia: </b>{updatedReservation.creation_date?.toString()}</p>
                </div>
                <div className="form-group">
                    <label>Nazwa użytkownika:</label>
                    <input
                        type="text"
                        name="user_name"
                        value={reservation.guest? guest.username: "---"}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>

                <div className="form-group">
                    <label>Imię i nazwisko:</label>
                    <input
                        type="text"
                        name="name"
                        value={(updatedReservation.guest && guest) ? guest.name: updatedReservation.optional_guest_data.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                    <input
                        type="text"
                        name="surname"
                        value={updatedReservation.guest? guest.surname: updatedReservation.optional_guest_data.surname}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="text"
                        name="email"
                        value={updatedReservation.guest? guest.email: updatedReservation.optional_guest_data['email']}
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
                {periods.length > 0 ?
                    <div style={{marginTop: 20, marginBottom: 20}}>
                        <BookingCalendar bookedPeriods={periods}/>
                    </div> : null}


                <div className="form-group">
                    <label>Liczba gości:</label>
                    <input
                        type="number"
                        name="people_number"
                        value={updatedReservation.people_number}
                        max={room.people_capacity}
                        min={0}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-control"
                    />

                    <div style={{marginTop: 20, marginBottom: 20}}>
                        <label style={{marginTop: 20, marginBottom: 20,}}>Zapełnienie:</label>
                        <div
                            className="progress" // Outer div to hold the border
                            style={{
                                height: '30px', // Set the height of the progress bar
                                borderRadius: '5px',
                                border: '2px solid black', // Border around the entire progress bar

                            }}
                        >
                            <div
                                className="progress-bar progress-bar"
                                role="progressbar"
                                style={{
                                    width: `${((updatedReservation.people_number / room.people_capacity) * 100).toFixed(2)}%`,
                                    color: "black",
                                    background: "limegreen"
                                }}
                                aria-valuenow={((updatedReservation.people_number / room.people_capacity) * 100).toFixed(2)}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            >
                                {((updatedReservation.people_number / room.people_capacity) * 100).toFixed(0)}%
                            </div>
                        </div>
                        <div style={{
                            textAlign: "center",
                            marginTop: 20
                        }}>Zajęto <b>{updatedReservation.people_number}</b> z <b>{room.people_capacity}</b> dostępnych
                            miejsc.
                        </div>
                    </div>

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
                        <option value="Opłacona częściowo">Częściowo opłacona</option>
                        <option value="Opłacona">Opłacona</option>
                        <option value="Anulowana">Anulowana</option>

                        <option value="Zakończona">Zakończona</option>

                    </select>
                </div>

                <div className="form-group">
                    <label>Cena rezerwacji:</label>
                    <input
                        type="number"
                        name="price"
                        value={updatedReservation.price}
                        min={0}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-control"
                    />
                </div>

                <div className="form-group">

                    <label>Wpłacona kwota:</label>
                    <input
                        type="number"
                        name="paid_amount"
                        value={updatedReservation.paid_amount}
                        min={0}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-control"
                    />
                </div>

                <div className="form-group d-flex align-items-center">

                    <label style={{display: "inline", marginRight: 20, flex: "10"}}>Czy wpłacono zadatek?</label>
                    <input
                        style={{
                            display: "inline",
                            width: 20,
                            height: 20,
                            margin: "auto",
                            accentColor: "black",
                            flex: "1",
                        }}
                        type="checkbox"
                        name="is_paid"
                        checked={updatedReservation.is_paid ? true : false}
                        value={updatedReservation.is_paid}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />

                </div>

                <div className="form-group">
                    <div style={{marginTop: 20, marginBottom: 20}}>
                        <label style={{marginTop: 20, marginBottom: 20,}}>Zapełnienie:</label>
                        <div
                            className="progress" // Outer div to hold the border
                            style={{
                                height: '30px', // Set the height of the progress bar
                                borderRadius: '5px',
                                border: '2px solid black', // Border around the entire progress bar

                            }}
                        >


                            <div
                                className="progress-bar progress-bar"
                                role="progressbar"
                                style={{
                                    width: `${((updatedReservation.paid_amount / updatedReservation.price) * 100).toFixed(2)}%`,
                                    color: "black",
                                    background: "limegreen"
                                }}
                                aria-valuenow={((updatedReservation.paid_amount / updatedReservation.price) * 100).toFixed(2)}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            >
                                {((updatedReservation.paid_amount / updatedReservation.price) * 100).toFixed(0)}%
                            </div>
                        </div>
                        <div style={{
                            textAlign: "center",
                            marginTop: 20
                        }}>Zapłacono <b>{updatedReservation.paid_amount}</b> zł
                            z <b>{updatedReservation.price}</b> zł.
                        </div>
                    </div>
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
