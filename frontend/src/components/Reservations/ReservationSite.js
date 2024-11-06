import React, {useEffect, useState} from 'react';
import {Container, Form, Button, Alert} from 'react-bootstrap';
import RoomReservation from "./RoomReservation";
import axios from "axios";
import Hotel from "../../interfaces/Hotel.ts"

const ReservationSite = () => {

    const [roomStandard, setRoomStandard] = useState('standard');
    const [checkInDate, setCheckInDate] = useState(new Date().toISOString().slice(0, 10));
    const [checkOutDate, setCheckOutDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10));
    const [availableRooms, setAvailableRooms] = useState([]);
    const [message, setMessage] = useState('');
    const [hotelId, setHotelId] = useState(null);
    const [hotel, setHotel] = useState(null);
    const [hotels, setHotels] = useState(null);
    const [rooms, setRooms] = useState(null);


    useEffect(() => {
        if (hotels === null){
            axios.get("http://127.0.0.1:8000/api/hotels/")
            .then(response => {
                setHotels(response.data);
            })
            .catch(function () {
                console.log("error")
            });
        }
    }, [hotels]);

    async function submitForm({e}: { e: any }) {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/rooms/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    type: roomStandard,
                    check_in_date: checkInDate,
                    check_out_date: checkOutDate,
                    hotel_id: hotelId
                }),
            });
            const data = await response.json();

            console.log(data);

            setRooms(data)


        } catch (error) {
            console.log('Error fetching likes:', error);
        }
    }


    const roomData = {
        standard: [
            {id: 1, name: 'Standard', price: 100},
            {id: 2, name: 'Deluxe', price: 150},
            {id: 3, name: 'Apartament', price: 200},
        ],
    };

    const checkAvailability = () => {
        // Simulate an API call to check room availability
        const startDate = new Date(checkInDate);
        const endDate = new Date(checkOutDate);
        const today = new Date();

        if (!checkInDate || !checkOutDate || startDate.getDay() < today.getDay() || endDate <= startDate) {
            setMessage('Proszę wprowadzić prawidłowe daty.');
            setAvailableRooms([]);
            return;
        }

        const available = roomData[roomStandard]; // Replace with actual availability check logic
        setAvailableRooms(available);
        setMessage('');
    };

    const handleRoomStandardChange = (e) => {
        setRoomStandard(e.target.value);
        setAvailableRooms([]); // Reset available rooms when changing the room standard
    };

    const handleHotelChange = (e) => {
        console.log(e.target.value)
        setHotelId(e.target.value);
        setHotel(hotels[e.target.value-1])
    };

    return (
        <Container>
            <h2>Rezerwacja Pokoju</h2>
            {message && <Alert variant="danger">{message}</Alert>}
            <Form onSubmit={e => submitForm({e: e})}>
                <Form.Group controlId="roomStandard">

                    <Form.Label>Wybierz hotel</Form.Label>
                    <Form.Control as="select" value={hotelId} onChange={handleHotelChange}>
                        <option value="">Wybierz hotel</option>
                        {hotels && hotels.map((h: Hotel) => (
                            <option key={h.hotel_id} value={h.hotel_id}>
                                Hotel Weles - {h.localization}
                            </option>
                        ))}
                    </Form.Control>

                    <Form.Label>Wybierz standard pokoju</Form.Label>
                    <Form.Control as="select" value={roomStandard} onChange={handleRoomStandardChange}>
                        <option value="standard">Standard</option>
                        <option value="deluxe">Deluxe</option>
                        <option value="suite">Apartament</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="checkInDate">
                    <Form.Label>Data zameldowania</Form.Label>
                    <Form.Control
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="checkOutDate">
                    <Form.Label>Data wymeldowania</Form.Label>
                    <Form.Control
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" onClick={checkAvailability} type={"submit"}>
                    Sprawdź dostępność
                </Button>
            </Form>

            {availableRooms.length > 0 && (

                <div>
                    <RoomReservation rooms={rooms} hotel={hotel}/>
                </div>
            )}
        </Container>
    );
};

export default ReservationSite;