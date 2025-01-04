import React, {useEffect, useState} from 'react';
import {Container, Row, Col, Card, Button, Table, Spinner, Badge, Pagination} from 'react-bootstrap';
import client from "../client"
import Cookies from "js-cookie";
import "./CustomerPanel.css"

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

    // Handle page change
    const handlePageChange = (page: number) => setCurrentPage(page);

    // Fetch current reservation and all reservations (simulated fetch)
    useEffect(() => {

        const fetchReservations = async () => {
            try {
                const csrfToken = Cookies.get("csrftoken"); // Extract CSRF token from cookies
                if (!csrfToken) {
                    console.error("CSRF token not found!");
                    return;
                }

                const response = await client.get("http://127.0.0.1:8000/api/reservations/", {},
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
                                            <Card.Img variant="top"
                                                      src="https://catpaw.pl/wp-content/uploads/2024/09/Kot-Europjeski.png"/>
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
                                    <Pagination className="mt-4">
                                        <Pagination.First onClick={() => handlePageChange(1)}
                                                          disabled={currentPage === 1}/>
                                        <Pagination.Prev
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        />
                                        {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                                            <Pagination.Item
                                                key={page}
                                                active={page === currentPage}
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        />
                                        <Pagination.Last
                                            onClick={() => handlePageChange(totalPages)}
                                            disabled={currentPage === totalPages}
                                        />
                                    </Pagination>
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
