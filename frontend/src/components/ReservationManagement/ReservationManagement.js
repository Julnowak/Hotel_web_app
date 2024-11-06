import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';


const ReservationDetails = () => {
    // Sample reservation details (replace with dynamic data as needed)
    const reservation = {
        id: 1,
        hotel: 'Hotel Warszawa',
        date: '2024-11-15',
        roomType: 'Deluxe Suite',
        status: 'Confirmed'
    };

    // Function to handle modification
    const handleModifyReservation = () => {
        alert('Feature to modify reservation coming soon!');
    };

    // Function to handle cancellation
    const handleCancelReservation = () => {
        alert(`Reservation with ID ${reservation.id} has been cancelled.`);
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4 fw-bold">Szczegóły Rezerwacji</h2>

            {/* Reservation Details Card */}
            <Card className="shadow-lg border-0 rounded-3">
                <Card.Body className="p-4">
                    <Card.Title className="mb-3 fs-4 fw-semibold">
                        Hotel: {reservation.hotel}
                    </Card.Title>
                    <Row className="align-items-center">
                        <Col md={8}>
                            <p className="mb-1">
                                <strong>Data:</strong> {reservation.date}
                            </p>
                            <p className="mb-1">
                                <strong>Typ pokoju:</strong> {reservation.roomType}
                            </p>
                            <p className="mb-1">
                                <strong>Status:</strong>{' '}
                                <Badge
                                    bg={
                                        reservation.status === 'Confirmed'
                                            ? 'success'
                                            : reservation.status === 'Cancelled'
                                            ? 'danger'
                                            : 'secondary'
                                    }
                                    className="fs-6"
                                >
                                    {reservation.status}
                                </Badge>
                            </p>
                        </Col>
                        <Col md={4} className="text-end">
                            <Button
                                variant="outline-primary"
                                className="me-2 rounded-pill px-3 py-2"
                                onClick={handleModifyReservation}
                            >
                                Zmień
                            </Button>
                            <Button
                                variant="outline-danger"
                                className="rounded-pill px-3 py-2"
                                onClick={handleCancelReservation}
                            >
                                Anuluj
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ReservationDetails;
