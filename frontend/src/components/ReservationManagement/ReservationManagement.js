import React, {useEffect, useState} from 'react';
import {Container, Row, Col, Card, Button, Badge, Spinner, Image} from 'react-bootstrap';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import Cookies from 'js-cookie';
import {API_BASE_URL} from '../../config';
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import StarRating from "../StarRating/StarRating";

const ReservationManagement = () => {
    const params = useParams();
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/reservation/${params.id}`);
                setReservation(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching reservation:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReservation();
    }, [params]);

    const handleCancelReservation = async () => {
        try {
            const csrfToken = Cookies.get('csrftoken');
            if (!csrfToken) {
                console.error('CSRF token not found!');
                return;
            }
            const response = await axios.post(
                `${API_BASE_URL}/reservation/${params.id}/`,
                {operation_type: 'anulowanie'},
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

    if (loading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" variant="primary"/>
                <p>Ładowanie szczegółów rezerwacji...</p>
            </div>
        );
    }

    return (
        <Container className="mt-5" style={{marginBottom: 60}}>
            {reservation && (
                <Card className="shadow-lg border-0 rounded-3">
                    {/* Sekcja ze zdjęciem */}
                    <Image
                        src={`/images/hotel_rooms_images/room_${reservation.room_type}.jpg`} // Zamień na właściwy URL zdjęcia
                        alt="Hotel Image"
                        fluid
                        style={{
                            width: "50%",
                            height: "auto",
                            margin: "20px auto",
                            objectFit: "cover",
                            borderRadius: "8px",
                        }}
                        className="rounded-top"
                    />
                    <Card.Body className="p-4">
                        <h1 className=" text-center mb-4">
                            Rezerwacja nr {reservation.reservation_id}
                        </h1>

                        {/* Informacje o gościu */}
                        <section className="mb-4">
                            <h2 className="text-secondary">Informacje o gościu</h2>
                            {reservation.guest ? <div>
                                <p><strong>Imię:</strong> {reservation.name}</p>
                                <p><strong>Nazwisko:</strong> {reservation.surname}</p>
                                <p><strong>Email:</strong> {reservation.email}</p>
                            </div> : <div>
                                <p><strong>Imię:</strong> {reservation.optional_guest_data.name}</p>
                                <p><strong>Nazwisko:</strong> {reservation.optional_guest_data.surname}</p>
                                <p><strong>Email:</strong> {reservation.optional_guest_data.email}</p>
                            </div>}

                        </section>

                        <section className="mb-4">
                            <h2 className="text-secondary">Szczegóły Rezerwacji</h2>
                            <p><strong>Numer pokoju:</strong> {reservation.room_number}</p>
                            <p><strong>Piętro:</strong> {reservation.floor_number}</p>
                            <p><strong>Typ pokoju:</strong> {reservation.room_type}</p>
                            <p>
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
                                    className="ms-2"
                                >
                                    {reservation.status}
                                </Badge>
                            </p>

                        </section>

                        {/* Szczegóły rezerwacji */}
                        <section className="mb-4">
                            <h2 className="text-secondary">Lokalizacja</h2>
                            <p><strong>{reservation?.hotel.slice(0, 18)}</strong></p>
                            <p><strong>Adres:</strong> {reservation?.hotel.slice(18)} {reservation?.hotel.slice(12, 18)}
                            </p>
                            <MapContainer
                                center={[reservation.latitude, reservation.longitude]}
                                zoom={20}
                                scrollWheelZoom={false}
                                style={{
                                    height: "500px",
                                    width: "100%",
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                    marginTop: "20px",
                                }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Marker
                                    key={reservation.hotel_id}
                                    position={[reservation.latitude, reservation.longitude]}
                                >
                                    <Popup>
                                        <h4
                                            style={{
                                                borderBottom: "2px solid black",
                                                paddingBottom: "5px",
                                                marginBottom: "5px",
                                                color: "#ff7329",
                                            }}
                                        >
                                            Hotel Weles {reservation?.hotel.slice(12, 18)}
                                        </h4>
                                        <StarRating rating={reservation.rating}/>
                                        <p style={{fontSize: "14px", color: "black"}}>
                                            {reservation?.hotel.slice(18)} {reservation?.hotel.slice(12, 18)}
                                        </p>
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </section>

                        {/* Daty i płatności */}
                        <section className="mb-4 p-3 border rounded-3 shadow-sm bg-light">
                            <h2 className="text-secondary mb-3  d-flex align-items-center">
                                {/* Ikona jako akcent */}
                                Daty i Płatności
                            </h2>
                            <p className="mb-2"><strong>Data zameldowania:</strong> {reservation.check_in}, 14:00</p>
                            <p className="mb-2"><strong>Data wymeldowania:</strong> {reservation.check_out}, 12:00</p>
                            <p className="mb-2"><strong>Zadatek:</strong> {reservation.deposit} PLN</p>
                            <div style={{marginTop: 20, marginBottom: 20}}>
                                <label style={{marginTop: 20, marginBottom: 20,}}><h4>Stopień opłacenia rezerwacji:</h4>
                                </label>
                                <div
                                    className="progress" // Outer div to hold the border
                                    style={{
                                        height: '30px', // Set the height of the progress bar
                                        borderRadius: '5px',
                                        border: '2px solid black', // Border around the entire progress bar

                                    }}
                                >
                                    <div
                                        className="progress-bar progress-bar"
                                        role="progressbar"
                                        style={{
                                            width: `${((reservation.paid_amount / reservation.price) * 100).toFixed(2)}%`,
                                            color: "black",
                                            background: "limegreen"
                                        }}
                                        aria-valuenow={((reservation.paid_amount / reservation.price) * 100).toFixed(2)}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        <h6 style={{paddingTop: 10}}>{((reservation.paid_amount / reservation.price) * 100).toFixed(0)}%</h6>
                                    </div>
                                </div>
                                <h4 style={{
                                    margin: "20px auto",
                                    textAlign: "center"
                                }}>Zapłacono <b>{reservation.paid_amount}</b> zł z <b>{reservation.price}</b> zł </h4>
                            </div>
                        </section>


                        {/* Przycisk Akcji */}
                        <section className="text-center">
                            <div>

                            </div>

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
                        </section>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default ReservationManagement;
