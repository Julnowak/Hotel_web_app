import React, {useEffect, useState} from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner } from 'react-bootstrap';
import axios from "axios";

// AXIOS CONNECTION FOR LOGIN //
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://127.0.0.1:3000"
})

// AXIOS CONNECTION FOR LOGIN //

const CustomerPanel = () => {
    document.body.style.backgroundColor = '#767676';

const [currentReservation, setCurrentReservation] = useState(null);
    const [allReservations, setAllReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState([]);


    // Fetch current reservation and all reservations (simulated fetch)
    useEffect(() => {
        setLoading(true);
        // Simulating API calls
            const fetchReservations = async () => {
                try {
                    const response = await client.get("http://127.0.0.1:8000/api/reservations/",
                        );
                    setReservations(response.data);
                } catch (error) {
                    console.error("Error fetching hotels:", error);
                }
            };

            setCurrentReservation({
                id: 1,
                hotel: 'Hotel Warszawa',
                date: '2024-11-15',
                roomType: 'Deluxe Suite',
                status: 'Confirmed'
            });
            setAllReservations([
                { id: 1, hotel: 'Hotel Warszawa', date: '2024-10-20', roomType: 'Standard Room', status: 'Completed' },
                { id: 2, hotel: 'Hotel Kraków', date: '2024-09-10', roomType: 'Suite', status: 'Cancelled' },
                { id: 3, hotel: 'Hotel Gdańsk', date: '2024-08-05', roomType: 'Luxury Room', status: 'Completed' }
            ]);

            if (!reservations.length) fetchReservations();
            setLoading(false);
    }, [reservations.length]);

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    return (
        <Container className="mt-5">
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
                                    <strong>Hotel:</strong> {currentReservation.hotel} <br />
                                    <strong>Data rezerwacji:</strong> {currentReservation.date} <br />
                                    <strong>Rodzaj pokoju:</strong> {currentReservation.roomType} <br />
                                    <strong>Status:</strong> {currentReservation.status} <br />
                                </Card.Text>
                                <Button variant="primary" href={"/your_reservation"}>Zarządzaj rezerwacją</Button>
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
                                        <tr key={reservation.reservation_id}>
                                            <td>{reservation.reservation_id}</td>
                                            <td>"{reservation.h}"</td>
                                            <td>{reservation.check_in}</td>
                                            <td>{reservation.roomType}</td>
                                            <td>{reservation.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <div style={{textAlign: "right"}}>Zobacz więcej...</div>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CustomerPanel;
