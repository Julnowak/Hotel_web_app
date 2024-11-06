import React, {useEffect, useState} from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner } from 'react-bootstrap';

const CustomerPanel = () => {
    document.body.style.backgroundColor = '#767676';
 // const userData = {
 //    name: localStorage.getItem("username"),
 //  };
 //
 //  const favoriteHotels = [
 //    { id: 1, name: 'Hotel A', location: 'Warszawa' },
 //    { id: 2, name: 'Hotel B', location: 'Kraków' },
 //  ];
 //
 //  const reservations = [
 //    {
 //      id: 1,
 //      hotel: 'Hotel A',
 //      checkIn: '2024-10-01',
 //      checkOut: '2024-10-05',
 //      status: 'Potwierdzona',
 //    },
 //    {
 //      id: 2,
 //      hotel: 'Hotel B',
 //      checkIn: '2024-11-10',
 //      checkOut: '2024-11-15',
 //      status: 'Oczekująca',
 //    },
 //  ]
const [currentReservation, setCurrentReservation] = useState(null);
    const [allReservations, setAllReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch current reservation and all reservations (simulated fetch)
    useEffect(() => {
        setLoading(true);
        // Simulating API calls
        setTimeout(() => {
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
            setLoading(false);
        }, 1000); // Simulate API delay
    }, []);

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
                                    {allReservations.map((reservation) => (
                                        <tr key={reservation.id}>
                                            <td>{reservation.id}</td>
                                            <td>{reservation.hotel}</td>
                                            <td>{reservation.date}</td>
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
