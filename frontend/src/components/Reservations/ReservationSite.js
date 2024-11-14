import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import RoomReservation from "./RoomReservation";
import axios from "axios";
import Hotel from "../../interfaces/Hotel.ts";

const ReservationSite = () => {
    const [roomStandard, setRoomStandard] = useState('standard');
    const [checkInDate, setCheckInDate] = useState(new Date().toISOString().slice(0, 10));
    const [checkOutDate, setCheckOutDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10));
    const [availableRooms, setAvailableRooms] = useState([]);
    const [message, setMessage] = useState('');
    const [hotelId, setHotelId] = useState(null);
    const [hotel, setHotel] = useState(null);
    const [hotels, setHotels] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [errors, setErrors] = useState({});

    // Fetch list of hotels
    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/hotels/");
                setHotels(response.data);
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };

        if (!hotels.length) fetchHotels();
    }, [hotels]);

    const validateForm = () => {
        const errors = {};
        if (!hotelId) errors.hotelId = "Proszę wybrać hotel.";
        if (!roomStandard) errors.roomStandard = "Proszę wybrać standard pokoju.";
        if (!checkInDate) errors.checkInDate = "Proszę wybrać datę zameldowania.";
        if (!checkOutDate) errors.checkOutDate = "Proszę wybrać datę wymeldowania.";
        else if (checkOutDate <= checkInDate) errors.checkOutDate = "Data wymeldowania musi być późniejsza niż zameldowania.";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const submitForm = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post("http://localhost:8000/api/rooms/", {
                type: roomStandard,
                check_in_date: checkInDate,
                check_out_date: checkOutDate,
                hotel_id: hotelId
            });
            setRooms(response.data);
            setAvailableRooms(response.data);
            setMessage('W wybranym terminie są dostępne pokoje!');
        } catch (error) {
            setMessage('W trakcie pobierania pokoi pojawił się problem!');
        }
    };

    const handleRoomStandardChange = (e) => {
        setRoomStandard(e.target.value);
        setAvailableRooms([]);
    };

    const handleHotelChange = (e) => {
        const selectedHotelId = e.target.value;
        setHotelId(selectedHotelId);
        setHotel(hotels.find(h => h.hotel_id === parseInt(selectedHotelId)));
    };

    return (
        <Container>
            <h2>Rezerwacja Pokoju</h2>
            {message && <Alert variant="info">{message}</Alert>}

            <Form onSubmit={submitForm}>
                <Form.Group controlId="roomStandard">
                    <Form.Label>Wybierz hotel</Form.Label>
                    <Form.Control as="select" value={hotelId || ''} onChange={handleHotelChange} isInvalid={!!errors.hotelId}>
                        <option value="">Wybierz hotel</option>
                        {hotels.map(h => (
                            <option key={h.hotel_id} value={h.hotel_id}>
                                Hotel Weles - {h.localization}
                            </option>
                        ))}
                    </Form.Control>
                    {errors.hotelId && <Form.Control.Feedback type="invalid">{errors.hotelId}</Form.Control.Feedback>}

                    <Form.Label>Wybierz standard pokoju</Form.Label>
                    <Form.Control as="select" value={roomStandard} onChange={handleRoomStandardChange} isInvalid={!!errors.roomStandard}>
                        <option value="standard">Standard</option>
                        <option value="deluxe">Deluxe</option>
                        <option value="suite">Apartament</option>
                    </Form.Control>
                    {errors.roomStandard && <Form.Control.Feedback type="invalid">{errors.roomStandard}</Form.Control.Feedback>}
                </Form.Group>

                <Form.Group controlId="checkInDate">
                    <Form.Label>Data zameldowania</Form.Label>
                    <Form.Control
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        isInvalid={!!errors.checkInDate}
                    />
                    {errors.checkInDate && <Form.Control.Feedback type="invalid">{errors.checkInDate}</Form.Control.Feedback>}
                </Form.Group>

                <Form.Group controlId="checkOutDate">
                    <Form.Label>Data wymeldowania</Form.Label>
                    <Form.Control
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        isInvalid={!!errors.checkOutDate}
                    />
                    {errors.checkOutDate && <Form.Control.Feedback type="invalid">{errors.checkOutDate}</Form.Control.Feedback>}
                </Form.Group>

                <Form.Group className="d-flex justify-content-center" style={{marginTop: 20}}>
                    <Button variant="primary" type="submit">
                        Sprawdź dostępność
                    </Button>
                </Form.Group>
            </Form>

            {availableRooms.length > 0 && (

                <div>
                    <RoomReservation rooms={rooms} hotel={hotel} checkIn={checkInDate} checkOut={checkOutDate}/>
                </div>
            )}
        </Container>
    );
};

export default ReservationSite;
