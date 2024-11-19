import React, {useEffect, useState} from 'react';
import {Container, Row, Col, Card, Button, Table, Spinner} from 'react-bootstrap';
import axios from "axios";

// AXIOS CONNECTION FOR LOGIN //
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://127.0.0.1:3000",
})

// AXIOS CONNECTION FOR LOGIN //

const CustomerPanel = () => {
    document.body.style.backgroundColor = '#767676';

    const [currentReservation, setCurrentReservation] = useState(null);
    const [allReservations, setAllReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState([]);

    const getCsrfToken = async () => {
        const response = await fetch('http://127.0.0.1:8000/api/csrf/', {credentials: 'include'});
        const data = await response.json();
        return data.csrfToken; // Ensure this matches what your backend sends
    };

    // Fetch current reservation and all reservations (simulated fetch)
    useEffect(() => {
        setLoading(true);
        // Simulating API calls

        const fetchReservations = async () => {
            const csrfToken = await getCsrfToken();
            console.log(csrfToken)
            if (csrfToken) {
                try {
                    const response = await client.get("http://127.0.0.1:8000/api/reservations/", {
                        headers: {
                            "X-CSRFToken": csrfToken,
                        },
                        withCredentials: true, // Add this to send cookies
                    });
                    setReservations(response.data);
                    console.log(response.data)

                } catch (error) {
                    console.error("Error fetching reservations:", error);
                }
            }

        };

        setCurrentReservation({
            id: 1,
            hotel: 'Hotel Warszawa',
            date: '2024-11-15',
            roomType: 'Deluxe Suite',
            status: 'Confirmed'
        });

        if (!reservations.length) fetchReservations();
        setLoading(false);
    }, [reservations, reservations.length]);


    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary"/>
            </Container>
        );
    }

    return (
        <Container className="mt-5 mb-5">
            <Row className="mb-4">
                <Col>
                    <h2 className="text-center">Panel użytkownika</h2>
                </Col>
            </Row>

            {/* Current Reservation */}
            {currentReservation && (
                <Row className="mb-5">
                    <Col>
                        <Card className="shadow-lg">
                            <Card.Body>
                                <Card.Title>Aktualna Rezerwacja</Card.Title>
                                <Card.Text>
                                    <strong>Hotel:</strong> {currentReservation.hotel} <br/>
                                    <strong>Data rezerwacji:</strong> {currentReservation.date} <br/>
                                    <strong>Rodzaj pokoju:</strong> {currentReservation.roomType} <br/>
                                    <strong>Status:</strong> {currentReservation.status} <br/>
                                </Card.Text>
                                <Button variant="primary" href={"/manage_reservation"}>Zarządzaj rezerwacją</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Reservation History */}
            <Row>
                <Col>
                    <Card className="shadow-lg">
                        <Card.Body>
                            <Card.Title>Historia Rezerwacji</Card.Title>
                            <Table striped bordered hover responsive>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Hotel</th>
                                    <th>Data</th>
                                    <th>Rodzaj Pokoju</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {reservations.map((reservation: Reservation) => (
                                    <tr
                                        key={reservation.reservation_id}
                                        onClick={() => window.location.href = `/manage_reservation/${reservation.reservation_id}/`}
                                        style={{cursor: "pointer"}}
                                    >
                                        <td>{reservation.reservation_id}</td>
                                        <td>{reservation.hotel}</td>
                                        <td>{reservation.check_in}</td>
                                        <td>{reservation.room_type}</td>
                                        <td>{reservation.status}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                            <div style={{textAlign: "right"}}>
                                <a href="/userReservations/">Zobacz więcej...</a>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CustomerPanel;
