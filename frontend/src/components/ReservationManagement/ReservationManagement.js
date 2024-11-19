import React, {useEffect, useState} from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";


const ReservationDetails = () => {
    
    const params = useParams()
    const [reservation, setReservation] = useState(null);
    const navigate = useNavigate()

    // Fetch list of hotels
    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/reservation/${params.id}`);
                setReservation(response.data);
                console.log(response.data)
            } catch (error) {
                console.error("Error fetching reservation:", error);
            }
        };

        if (!reservation) fetchReservation();
    }, [params, reservation]);


    // Function to handle cancellation
    const handleCancelReservation = () => {
        alert(`Reservation with ID ${reservation.id} has been cancelled.`);
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4 fw-bold">Szczegóły Rezerwacji</h2>

            {/* Reservation Details Card */}
            {reservation?
                <Card className="shadow-lg border-0 rounded-3">
                <Card.Body className="p-4">
                    <Card.Title className="mb-3 fs-4 fw-semibold">
                        {reservation.hotel}
                    </Card.Title>
                    <Row className="align-items-center">
                        <Col md={8}>
                            <p className="mb-1">
                                <strong>Data zameldowania:</strong> {reservation.check_in}, 14:00
                            </p>
                            <p className="mb-1">
                                <strong>Data wymeldowania:</strong> {reservation.check_out}, 12:00
                            </p>
                            <p className="mb-1">
                                <strong>Typ pokoju:</strong> {reservation.room_type}
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
                                onClick={function (){ navigate(`/edit_reservation/${params.id}/`)}}
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
                :null}

        </Container>
    );
};

export default ReservationDetails;
