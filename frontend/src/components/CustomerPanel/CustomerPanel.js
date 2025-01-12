import React, {useEffect, useState} from 'react';
import {Container, Row, Col, Card, Button, Table, Spinner, Badge, Pagination} from 'react-bootstrap';
import client from "../client"
import Cookies from "js-cookie";
import "./CustomerPanel.css"
import {API_BASE_URL} from "../../config";

const CustomerPanel = () => {

    const [currentReservation, setCurrentReservation] = useState(null);
    const [allReservations, setAllReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState([]);

    const reservationsPerPage = 1; // Number of reservations per page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate indices for slicing
    const indexOfLastReservation = currentPage * reservationsPerPage;
    const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;

    // Paginated data
    const currentReservationsPaginated = currentReservation?.slice(indexOfFirstReservation, indexOfLastReservation);

    // Calculate total pages
    const totalPages = Math.ceil((currentReservation?.length || 0) / reservationsPerPage);

    const generatePageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        const halfRange = Math.floor(maxPagesToShow / 2);

        let startPage = Math.max(1, currentPage - halfRange);
        let endPage = Math.min(totalPages, currentPage + halfRange);

        if (currentPage <= halfRange) {
            endPage = Math.min(maxPagesToShow, totalPages);
        } else if (currentPage + halfRange >= totalPages) {
            startPage = Math.max(1, totalPages - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    // Fetch current reservation and all reservations (simulated fetch)
    useEffect(() => {
        console.log(Cookies.get("csrftoken"))
        const fetchReservations = async () => {
            try {
                const csrfToken = Cookies.get("csrftoken"); // Extract CSRF token from cookies
                if (!csrfToken) {
                    console.error("CSRF token not found!");
                    return;
                }

                const response = await client.get(`${API_BASE_URL}/reservations/`, {},
                    {
                        headers: {
                            "X-CSRFToken": csrfToken,
                        },
                    },);

                console.log(response.data.current_data)
                setReservations(response.data.main_data);
                setCurrentReservation(response.data.current_data);

            } catch (error) {
                console.error("Error fetching reservations:", error);
            }

        };

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

            <Row className="mb-5">
                <Col>
                    <Card className="shadow-lg">
                        <Card.Body>
                            <Card.Title>Trwające rezerwacje</Card.Title>
                            {/* Current Reservation */}
                            {currentReservationsPaginated?.length > 0 ? (

                                <div>
                                    {currentReservationsPaginated?.map((cr: Reservation) => (
                                        <div key={cr.reservation_id}>
                                            <Card.Img variant="top" style={{objectFit: "cover", width: "100%", height: 200}}
                                                      src={`/images/hotel_rooms_images/room_${cr.room_type}.jpg`}/>
                                            <Card.Text>
                                                <strong>{cr.hotel}</strong> <br/>
                                                <strong>Nr rezerwacji:</strong> {cr.reservation_id} <br/>
                                                <strong>Data zameldowania:</strong> {cr.check_in}, 14:00 <br/>
                                                <strong>Data wymeldowania:</strong> {cr.check_out}, 12:00 <br/>
                                                <strong>Rodzaj pokoju:</strong> {cr.room_type} <br/>
                                                <strong>Status:</strong> {cr.status} <br/>
                                            </Card.Text>
                                            <Button variant="primary" href={`/manage_reservation/${cr.reservation_id}`}>
                                                Zarządzaj rezerwacją
                                            </Button>
                                        </div>
                                    ))}

                                    {/* Pagination */}
                                    <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom: '20px'
                                    }}>
                                    <button
                                        onClick={() => setCurrentPage((prev) => 1)}
                                        disabled={currentPage === 1}
                                        style={{
                                            padding: "8px 12px",
                                            margin: "0 5px",
                                            background: currentPage === 1 ? "#fff" : "#333",
                                            color: currentPage === 1 ? "#333" : "#fff",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {`<<`}
                                    </button>

                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        style={{
                                            padding: "8px 12px",
                                            margin: "0 5px",
                                            background: currentPage === 1 ? "#fff" : "#333",
                                            color: currentPage === 1 ? "#333" : "#fff",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {'<'}
                                    </button>
                                    {generatePageNumbers().map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            style={{
                                                padding: '5px 10px',
                                                margin: '0 5px',
                                                cursor: 'pointer',
                                                backgroundColor: page === currentPage ? 'gray' : 'white',
                                                color: page === currentPage ? 'black' : 'black',
                                            }}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        style={{
                                            padding: "8px 12px",
                                            margin: "0 5px",
                                            background: currentPage === totalPages ? "#fff" : "#333",
                                            color: currentPage === totalPages ? "#333" : "#fff",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        >
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage((prev) => totalPages)}
                                        disabled={currentPage === totalPages}
                                        style={{
                                            padding: "8px 12px",
                                            margin: "0 5px",
                                            background: currentPage === totalPages ? "#fff" : "#333",
                                            color: currentPage === totalPages ? "#333" : "#fff",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        >>
                                    </button>
                                </div>
                                </div>


                            ) :
                                <h6>
                                    Brak trwających rezerwacji w tym momencie.
                                </h6>
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>


            {/* Reservation History */}
            <Row>
                <Col>
                    <Card className="shadow-lg">
                        <Card.Body>
                            <Card.Title>Historia Rezerwacji</Card.Title>
                            {reservations?.length > 0?
                                <div>
                                    <Table striped bordered hover responsive style={{textAlign: "center"}}>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Hotel</th>
                                    <th>Data zameldowania</th>
                                    <th>Data wymeldowania</th>
                                    <th>Rodzaj Pokoju</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {reservations.slice(0, -4).map((reservation: Reservation) => (
                                    <tr
                                        key={reservation.reservation_id}
                                        onClick={() => window.location.href = `/manage_reservation/${reservation.reservation_id}/`}
                                        style={{cursor: "pointer"}}
                                    >
                                        <td>{reservation.reservation_id}</td>
                                        <td>{reservation.hotel}</td>
                                        <td>{reservation.check_in}</td>
                                        <td>{reservation.check_out}</td>
                                        <td>{reservation.room_type}</td>
                                        <td style={{
                                            backgroundColor: reservation.status === 'Opłacona' ? 'lightgreen' :
                                                reservation.status === 'Anulowana' ? 'palevioletred' :
                                                    reservation.status === 'W trakcie' ? 'lightblue' :
                                                        reservation.status === 'Zakończona' ? 'lightcyan' : 'lightgray',

                                        }}>
                                            {reservation.status}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                            <div style={{textAlign: "right"}}>
                                <a href="/userReservations/">Zobacz więcej...</a>
                            </div>
                                </div>
                                :
                                <h6>
                                    Brak historii poprzednich rezerwacji. Gdy zaczniesz rezerwować nasze pokoje, rezerwacje oraz ich statusy pojawią się w tym miejscu.
                                    Pokój możesz zarezerwować w zakładce <a href={"/reservation/"}>"Zarezerwuj"</a>.
                                </h6>}

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CustomerPanel;
