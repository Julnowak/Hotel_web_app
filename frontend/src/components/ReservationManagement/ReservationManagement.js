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
            alert(`Rezerwacja z ID ${reservation.reservation_id} została anulowana.`);
        } catch (error) {
            console.error('Error canceling reservation:', error);
        }
    };

    return (
        <Container className="mt-5">
            {reservation ? (
                <Card className="shadow-lg border-0 rounded-3">
                    <Card.Body className="p-4">
                        <Card.Title className="mb-3 fs-4 fw-bold text-center text-primary">
                            <h2>Rezerwacja nr {reservation.reservation_id}</h2>
                        </Card.Title>
                        <Row className="align-items-center">
                            <Col md={8}>
                                {reservation.guest ? (
                                    <p className="mb-2 text-muted">
                                        <strong>Gość:</strong> {reservation.guest} ({reservation.email})
                                    </p>
                                ) : null}

                                <p className="mb-2">
                                    <strong>{reservation?.hotel?.slice(0, 18)}</strong>
                                </p>
                                <p className="mb-2">
                                    <strong>Lokalizacja:</strong> {reservation?.hotel?.slice(18)} {reservation?.hotel?.slice(12, 18)}
                                </p>
                                <p className="mb-2">
                                    <strong>Numer pokoju:</strong> {reservation.room_number}
                                </p>
                                <p className="mb-2">
                                    <strong>Typ pokoju:</strong> {reservation.room_type}
                                </p>
                                <p className="mb-2">
                                    <strong>Data zameldowania:</strong> {reservation.check_in}, 14:00
                                </p>
                                <p className="mb-2">
                                    <strong>Data wymeldowania:</strong> {reservation.check_out}, 12:00
                                </p>
                                <p className="mb-2">
                                    <strong>Data utworzenia rezerwacji:</strong> {reservation.creation_date}
                                </p>
                                <p className="mb-2">
                                    <strong>Cena całkowita:</strong> {reservation.price} PLN
                                </p>

                                <p className="mb-2">
                                    <strong>Zadatek:</strong> {reservation.deposit} PLN
                                </p>
                                <p className="mb-2">
                                    <strong>Kwota zapłacona:</strong> {reservation.paid_amount} PLN
                                </p>

                                <p className="mb-2">
                                    <strong>Liczba osób:</strong> {reservation.people_number}
                                </p>
                                <p className="mb-2">
                                    <strong>Status:</strong>
                                    <Badge
                                        bg={
                                            reservation.status === 'Opłacona'
                                                ? 'success'
                                                : reservation.status === 'Anulowana'
                                                    ? 'danger'
                                                    : reservation.status === 'W trakcie'
                                                        ? 'warning'
                                                        : reservation.status === 'Zakończona'
                                                            ? 'primary'
                                                            : 'secondary'
                                        }
                                        className="fs-6"
                                    >
                                        {localStat ? localStat : reservation.status}
                                    </Badge>
                                </p>
                            </Col>
                            <Col md={4}>
                                <div className="d-flex flex-wrap justify-content-between">
                                    {reservation.status === 'Oczekująca' && (
                                        <>
                                            <Button
                                                variant="outline-success"
                                                className="rounded-pill px-3 py-2 mb-2"
                                                onClick={() =>
                                                    navigate(`/payment/${params.id}/?type=${reservation.status === 'Oczekująca' ? 'full' : null}`)
                                                }
                                            >
                                                Opłać
                                            </Button>
                                            <Button
                                                variant="outline-success"
                                                className="rounded-pill px-3 py-2 mb-2"
                                                onClick={() =>
                                                    navigate(`/payment/${params.id}/?type=${reservation.status === 'Oczekująca' ? 'deposit' : null}`)
                                                }
                                            >
                                                Opłać zadatek
                                            </Button>
                                        </>
                                    )}

                                    {reservation.status === 'Opłacona częściowo' && (
                                        <Button
                                            variant="outline-success"
                                            className="rounded-pill px-3 py-2 mb-2"
                                            onClick={() =>
                                                navigate(`/payment/${params.id}/?type=${reservation.status === 'Opłacona częściowo' ? 'additional' : null}`)
                                            }
                                        >
                                            Dopłać
                                        </Button>
                                    )}

                                    {reservation.status !== 'Anulowana' && reservation.status !== 'Zakończona' && (
                                        <Button
                                            variant="outline-danger"
                                            className="rounded-pill px-3 py-2 mb-2"
                                            onClick={handleCancelReservation}
                                        >
                                            Anuluj
                                        </Button>
                                    )}

                                    {reservation.status === 'Zakończona' && (
                                        <Button
                                            variant="outline-success"
                                            className="rounded-pill px-3 py-2 mb-2"
                                            href="https://qualtricsxmkbklbynbg.qualtrics.com/jfe/form/SV_bggYg15rEEDFJ4y"
                                        >
                                            Wypełnij ankietę
                                        </Button>
                                    )}
                                </div>
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
