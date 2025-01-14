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

                            <div className="row">
                                {/* Kolumna z numerem pokoju */}
                                <div className="col-md-4 d-flex flex-column"
                                     style={{alignItems: "center", textAlign: "center", justifyContent: "center",
                                     border: "1px solid gray", borderRadius: 20}}>
                                    <h5>Nr pokoju</h5>
                                    <p style={{fontSize: "36px", fontWeight: "bold"}}>
                                        {reservation.room_number}
                                    </p>

                                </div>

                                {/* Kolumna z resztą danych */}
                                <div className="col-md-8">
                                    <br></br>
                                    <p style={{display: "flex", alignItems: "center"}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                             fill="currentColor" className="bi bi-building" viewBox="0 0 16 16">
                                            <path
                                                d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/>
                                            <path
                                                d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z"/>
                                        </svg>
                                        <strong style={{paddingLeft: 20}}>Piętro nr {reservation.floor_number}</strong>
                                    </p>

                                    <p style={{display: "flex", alignItems: "center"}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                             fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                                            <path
                                                d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
                                        </svg>
                                        <strong style={{paddingLeft: 20}}>Typ pokoju: {reservation.room_type}</strong>
                                    </p>
                                    <br></br>

                                        <strong>Dodatkowe usługi</strong>
                                        <ul>
                                            {/* Śniadanie */}
                                            <li
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "40px auto 160px",
                                                    marginTop: 20,
                                                    marginBottom: 20,
                                                    alignItems: "center",
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                     fill="currentColor"
                                                     className="bi bi-cup-hot-fill" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd"
                                                          d="M.5 6a.5.5 0 0 0-.488.608l1.652 7.434A2.5 2.5 0 0 0 4.104 16h5.792a2.5 2.5 0 0 0 2.44-1.958l.131-.59a3 3 0 0 0 1.3-5.854l.221-.99A.5.5 0 0 0 13.5 6zM13 12.5a2 2 0 0 1-.316-.025l.867-3.898A2.001 2.001 0 0 1 13 12.5"/>
                                                    <path
                                                        d="m4.4.8-.003.004-.014.019a4 4 0 0 0-.204.31 2 2 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.6.6 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3 3 0 0 1-.202.388 5 5 0 0 1-.253.382l-.018.025-.005.008-.002.002A.5.5 0 0 1 3.6 4.2l.003-.004.014-.019a4 4 0 0 0 .204-.31 2 2 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.6.6 0 0 0-.09-.252A4 4 0 0 0 3.6 2.8l-.01-.012a5 5 0 0 1-.37-.543A1.53 1.53 0 0 1 3 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a6 6 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 4.4.8m3 0-.003.004-.014.019a4 4 0 0 0-.204.31 2 2 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.6.6 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3 3 0 0 1-.202.388 5 5 0 0 1-.253.382l-.018.025-.005.008-.002.002A.5.5 0 0 1 6.6 4.2l.003-.004.014-.019a4 4 0 0 0 .204-.31 2 2 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.6.6 0 0 0-.09-.252A4 4 0 0 0 6.6 2.8l-.01-.012a5 5 0 0 1-.37-.543A1.53 1.53 0 0 1 6 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a6 6 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 7.4.8m3 0-.003.004-.014.019a4 4 0 0 0-.204.31 2 2 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.6.6 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3 3 0 0 1-.202.388 5 5 0 0 1-.252.382l-.019.025-.005.008-.002.002A.5.5 0 0 1 9.6 4.2l.003-.004.014-.019a4 4 0 0 0 .204-.31 2 2 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.6.6 0 0 0-.09-.252A4 4 0 0 0 9.6 2.8l-.01-.012a5 5 0 0 1-.37-.543A1.53 1.53 0 0 1 9 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a6 6 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 10.4.8"/>
                                                </svg>
                                                <div style={{marginLeft: 10, paddingTop: 10}}>Śniadanie (40 zł/os):
                                                </div>
                                                <button
                                                    style={{
                                                        padding: "5px 15px",
                                                        backgroundColor: reservation?.additions?.breakfast ? "limegreen" : "#d7162f",
                                                        color: reservation?.additions?.breakfast ? "black" : "white",
                                                        border: "none",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {reservation?.additions?.breakfast ? "Tak" : "Nie"}
                                                </button>
                                            </li>

                                            {/* Parking */}
                                            <li
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "40px auto 160px",
                                                    marginTop: 20,
                                                    marginBottom: 20,
                                                    alignItems: "center",
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                     fill="currentColor"
                                                     className="bi bi-car-front-fill" viewBox="0 0 16 16">
                                                    <path
                                                        d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"/>
                                                </svg>
                                                <div style={{marginLeft: 10, paddingTop: 10}}>
                                                    Parking (50 zł/doba):
                                                </div>
                                                <button
                                                    style={{
                                                        padding: "5px 15px",
                                                        backgroundColor: reservation?.additions?.parking ? "limegreen" : "#d7162f",
                                                        color: reservation?.additions?.parking ? "black" : "white",
                                                        border: "none",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {reservation?.additions?.parking ? "Tak" : "Nie"}
                                                </button>
                                            </li>

                                            {/* Wi-Fi */}
                                            <li
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "40px auto 160px",
                                                    marginTop: 20,
                                                    marginBottom: 20,
                                                    alignItems: "center",
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                     fill="currentColor"
                                                     className="bi bi-wifi" viewBox="0 0 16 16">
                                                    <path
                                                        d="M15.384 6.115a.485.485 0 0 0-.047-.736A12.44 12.44 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.52.52 0 0 0 .668.05A11.45 11.45 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164.205.148.49.13.668-.049"/>
                                                    <path
                                                        d="M13.229 8.271a.482.482 0 0 0-.063-.745A9.46 9.46 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.576 1.336c.206.132.48.108.653-.065m-2.183 2.183c.226-.226.185-.605-.1-.75A6.5 6.5 0 0 0 8 9c-1.06 0-2.062.254-2.946.704-.285.145-.326.524-.1.75l.015.015c.16.16.407.19.611.09A5.5 5.5 0 0 1 8 10c.868 0 1.69.201 2.42.56.203.1.45.07.61-.091zM9.06 12.44c.196-.196.198-.52-.04-.66A2 2 0 0 0 8 11.5a2 2 0 0 0-1.02.28c-.238.14-.236.464-.04.66l.706.706a.5.5 0 0 0 .707 0l.707-.707z"/>
                                                </svg>
                                                <div style={{marginLeft: 10, paddingTop: 10}}>Wi-Fi (bezpłatne):</div>
                                                <button
                                                    style={{
                                                        padding: "5px 15px",
                                                        backgroundColor: reservation?.additions?.wifi ? "limegreen" : "#d7162f",
                                                        color: reservation?.additions?.wifi ? "black" : "black",
                                                        border: "none",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Tak
                                                </button>
                                            </li>
                                        </ul>
                                    <br></br>
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
                                                                ? 'success'
                                                                : 'secondary'
                                            }
                                            className="ms-2"
                                        >
                                            {reservation.status}
                                        </Badge>
                                    </p>
                                </div>
                            </div>
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
                            <p className="mb-2">
                                <strong>Wartość zadatku: </strong>
                                <div style={{display: "inline"}}>{reservation.deposit} zł</div>

                                {reservation.is_paid ?
                                    <div style={{display: "inline", marginLeft: 30}}>
                                        <svg color="green" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                             fill="currentColor"
                                             className="bi bi-check" viewBox="0 0 16 16">
                                            <path
                                                d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                                        </svg>
                                        <span style={{marginLeft: -2, marginTop: 5}}>Opłacona</span>
                                    </div>
                                    :
                                    <div style={{display: "inline", marginLeft: 30}}>
                                        <svg color="red" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                             fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                            <path
                                                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                        </svg>
                                        <span style={{marginLeft: -2, marginTop: 5}}>Nieopłacona</span>
                                    </div>
                                }


                            </p>
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
                                    target="_blank"
                                    rel="noopener noreferrer"
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
