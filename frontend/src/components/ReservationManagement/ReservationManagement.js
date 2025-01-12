import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import client from '../client';
import { API_BASE_URL } from '../../config';

const ReservationManagement = () => {
    const params = useParams();
    const [reservation, setReservation] = useState({});
    const [localStat, setLocalStat] = useState(null);
    const [flag, setFlag] = useState(true);
    const navigate = useNavigate();

    // Fetch reservation details
    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/reservation/${params.id}`);
                setReservation(response.data);
                setFlag(false);
            } catch (error) {
                console.error('Error fetching reservation:', error);
            }
        };
        if (flag) {
            fetchReservation();
        }
    }, [flag, params]);

    // Function to handle cancellation
    const handleCancelReservation = async () => {
        try {
            const csrfToken = Cookies.get('csrftoken'); // Extract CSRF token from cookies
            if (!csrfToken) {
                console.error('CSRF token not found!');
                return;
            }
            const response = await client.post(
                `${API_BASE_URL}/reservation/${params.id}/`,
                { operation_type: 'anulowanie' },
                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                    },
                }
            );
            setReservation(response.data);
            alert(`Reservation with ID ${reservation.id} has been cancelled.`);
        } catch (error) {
            console.error('Error canceling reservation:', error);
        }
    };

    return (
        <Container className="mt-5">
            {reservation ? (
                <Card className="shadow-lg border-0 rounded-3">
                    <Card.Body className="p-4">
                        <Card.Title className="mb-3 fs-4 fw-bold">
                            <h2> Rezerwacja nr {reservation.reservation_id}</h2>
                        </Card.Title>
                        <Row className="align-items-center">
                            <Col md={8}>
                                <p className="mb-1">
                                    <strong>Gość:</strong> {reservation.guest} ({reservation.email})
                                </p>
                                <p className="mb-1">
                                    <strong>Lokalizacja:</strong> {reservation.hotel}
                                </p>
                                <p className="mb-1">
                                    <strong>Numer pokoju:</strong> {reservation.room_number}
                                </p>
                                <p className="mb-1">
                                    <strong>Typ pokoju:</strong> {reservation.room_type}
                                </p>
                                <p className="mb-1">
                                    <strong>Data zameldowania:</strong> {reservation.check_in}, 14:00
                                </p>
                                <p className="mb-1">
                                    <strong>Data wymeldowania:</strong> {reservation.check_out}, 12:00
                                </p>
                                <p className="mb-1">
                                    <strong>Data utworzenia rezerwacji:</strong> {reservation.creation_date}
                                </p>
                                <p className="mb-1">
                                    <strong>Cena całkowita:</strong> {reservation.price} PLN
                                </p>
                                <p className="mb-1">
                                    <strong>Kwota zapłacona:</strong> {reservation.paid_amount} PLN
                                </p>
                                <p className="mb-1">
                                    <strong>Depozyt:</strong> {reservation.deposit} PLN
                                </p>
                                <p className="mb-1">
                                    <strong>Liczba osób:</strong> {reservation.people_number}
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
                                        {localStat ? localStat : reservation.status}
                                    </Badge>
                                </p>
                            </Col>
                            <Col md={4} className="text-end">
                                {reservation.status === 'Oczekująca' ? (
                                    <Button
                                        variant="outline-success"
                                        className="me-2 rounded-pill px-3 py-2"
                                        onClick={() => navigate(`/payment/${params.id}`)}
                                    >
                                        Opłać
                                    </Button>
                                ) : null}

                                {reservation.status === 'Anulowana' || reservation.status === 'Zakończona' ? null : (
                                    <Button
                                        variant="outline-danger"
                                        className="rounded-pill px-3 py-2"
                                        onClick={handleCancelReservation}
                                    >
                                        Anuluj
                                    </Button>
                                )}

                                {reservation.status === 'Zakończona' ? (
                                    <Button
                                        variant="outline-success"
                                        className="rounded-pill px-3 py-2"
                                        href="https://qualtricsxmkbklbynbg.qualtrics.com/jfe/form/SV_bggYg15rEEDFJ4y"
                                    >
                                        Wypełnij ankietę
                                    </Button>
                                ) : null}
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            ) : (
                <div>Ładowanie szczegółów rezerwacji...</div>
            )}
        </Container>
    );
};

export default ReservationManagement;
