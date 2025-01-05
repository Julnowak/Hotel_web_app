import React, {useEffect, useState} from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import Cookies from "js-cookie";
import client from "../client";


const ReservationDetails = () => {
    
    const params = useParams()
    const [reservation, setReservation] = useState(null);
    const [localStat, setLocalStat] = useState(null);
    const navigate = useNavigate()

    // Fetch list of hotels
    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/reservation/${params.id}`);
                console.log(response.data)
            } catch (error) {
                console.error("Error fetching reservation:", error);
            }
        };

        if (!reservation) fetchReservation();
    }, [params, reservation]);


    // Function to handle cancellation
    const handleCancelReservation = () => {
         try {
                const csrfToken = Cookies.get("csrftoken"); // Extract CSRF token from cookies
                if (!csrfToken) {
                    console.error("CSRF token not found!");
                    return;
                }
                      const response = client.post(`http://127.0.0.1:8000/api/reservation/${params.id}/`,{
                          operation_type: "anulowanie"
                          }, // Your data payload goes here if needed
                {
                  headers: {
                    "X-CSRFToken": csrfToken,
                  },
                },
                      );
                setReservation(response.data)
                console.log(response.data)

            } catch (error) {
                console.error("Error fetching reservation:", error);
            }
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
                        Numer rezerwacji - {reservation.reservation_id}
                    </Card.Title>
                    <Row className="align-items-center">
                        <Col md={8}>
                            <p className="mb-1">
                                <strong>Lokalizacja:</strong> {reservation.hotel}
                            </p>
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
                                        reservation.status === 'Opłacona'
                                            ? 'success'
                                            : reservation.status === 'Anulowana'
                                            ? 'danger'
                                            : reservation.status === 'W trakcie'
                                            ? 'success'
                                            : reservation.status === 'Zakończona'
                                            ? 'success'
                                            : 'secondary'
                                    }
                                    className="fs-6"
                                >
                                    {localStat?localStat:reservation.status}
                                </Badge>
                            </p>
                        </Col>
                        <Col md={4} className="text-end">
                            {reservation.status === "Oczekująca"?
                                <Button
                                variant="outline-success"
                                className="me-2 rounded-pill px-3 py-2"
                                onClick={function (){ navigate(`/payment/${params.id}`)}}
                            >
                                Opłać
                            </Button>
                                :null}

                            {reservation.status === "Anulowana"?
                                null
                                :
                            <Button
                                variant="outline-primary"
                                className="me-2 rounded-pill px-3 py-2"
                                onClick={function (){ navigate(`/edit_reservation/${params.id}/`)}}
                            >
                                Zmień
                            </Button>
                            }
                            {reservation.status === "Anulowana"?
                                null
                                :
                            <Button
                                variant="outline-danger"
                                className="rounded-pill px-3 py-2"
                                onClick={handleCancelReservation}
                            >
                                Anuluj
                            </Button>
                            }


                        </Col>
                    </Row>
                </Card.Body>
            </Card>
                :null}

        </Container>
    );
};

export default ReservationDetails;
