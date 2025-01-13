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

    const generatePageNumbersHistory = () => {
        return Array.from({ length: totalPagesHistory }, (_, i) => i + 1);
    };

        // Ustawienia paginacji
    const [currentPageHistory, setCurrentPageHistory] = useState(1);
    const itemsPerPageHistory = 10;

    // Wyliczanie stron
    const totalPagesHistory = Math.ceil(reservations.length / itemsPerPageHistory);
    const currentReservationsHistory = reservations.slice(
        (currentPageHistory - 1) * itemsPerPageHistory,
        currentPageHistory * itemsPerPageHistory
    );

    const handlePageChangeHistory = (pageNumber) => {
        setCurrentPageHistory(pageNumber);
    };

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
                    <h1 className="text-center">Panel użytkownika</h1>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col>
                    <Card className="shadow-lg">
                        <Card.Body>
                            <Card.Title><h2>Trwające rezerwacje</h2></Card.Title>

                            {/* Current Reservation */}
                            {currentReservationsPaginated?.length > 0 ? (

                                    <div>
                                        {currentReservationsPaginated?.map((cr: Reservation) => (
                                            <div
                                                key={cr.reservation_id}
                                                style={{
                                                    display: "flex",
                                                    flexWrap: "wrap", // Pozwala zawijać elementy, jeśli nie mieszczą się w jednej linii
                                                    gap: "10px",
                                                    alignItems: "flex-start",
                                                    marginBottom: "20px",
                                                }}
                                            >
                                                {/* Obraz */}
                                                <div
                                                    style={{
                                                        flex: "1 1 50%", // 40% szerokości kontenera, ale dostosowuje się w zależności od miejsca
                                                        maxWidth: "400px", // Maksymalna szerokość obrazu
                                                        margin: "auto",
                                                    }}
                                                >
                                                    <Card.Img
                                                        variant="top"
                                                        style={{
                                                            objectFit: "cover",
                                                            width: "100%",
                                                            marginTop: 20,
                                                            height: "200px",
                                                            borderRadius: "10px",
                                                        }}
                                                        src={`/images/hotel_rooms_images/room_${cr.room_type}.jpg`}
                                                    />
                                                    <div style={{
                                                        textAlign: "center",
                                                        margin: "20px auto",
                                                        padding: "15px",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "10px",
                                                        backgroundColor: "#f7f7f7",
                                                        maxWidth: "400px",
                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                                                    }}>
                                                        <h4 style={{
                                                            marginBottom: "10px",
                                                            fontWeight: "bold",
                                                            color: "#2c3e50"
                                                        }}>
                                                            Status rezerwacji:
                                                        </h4>
                                                        <Badge
                                                            bg={
                                                                cr.status === "Opłacona"
                                                                    ? "success"
                                                                    : cr.status === "Anulowana"
                                                                        ? "danger"
                                                                        : cr.status === "W trakcie"
                                                                            ? "warning"
                                                                            : cr.status === "Zakończona"
                                                                                ? "primary"
                                                                                : "secondary"
                                                            }
                                                            style={{
                                                                fontSize: "1rem",
                                                                padding: "10px 20px",
                                                                borderRadius: "30px",
                                                                textTransform: "uppercase",
                                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                                                            }}
                                                        >
                                                            {cr.status}
                                                        </Badge>
                                                    </div>


                                                </div>
                                                {/* Tekst */}
                                                <div
                                                    style={{
                                                        flex: "1 2 50%", // 60% szerokości kontenera, ale dostosowuje się do miejsca
                                                        minWidth: "100px", // Minimalna szerokość, aby tekst nie ścieśniał się za bardzo
                                                        margin: "auto",
                                                    }}
                                                >
                                                    <Card.Text style={{
                                                        textAlign: "justify",
                                                        maxWidth: "600px",
                                                        margin: "20px auto",
                                                        padding: "20px",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "10px",
                                                        backgroundColor: "#f9f9f9",
                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                                                    }}>
                                                        <div style={{
                                                            maxWidth: "400px",
                                                            margin: "auto",
                                                            lineHeight: "1.6",
                                                            color: "#333",
                                                            fontFamily: "Arial, sans-serif"
                                                        }}>
                                                            <h3 style={{
                                                                marginBottom: "10px",
                                                                fontWeight: "bold",
                                                                color: "#2c3e50"
                                                            }}>{cr.hotel.slice(0, 18)}</h3>
                                                            <h4 style={{
                                                                marginBottom: "20px",
                                                                color: "#7f8c8d"
                                                            }}>{cr.hotel.slice(18)} {cr.hotel.slice(12, 18)}</h4>
                                                            <p style={{
                                                                marginBottom: "10px"
                                                            }}>
                                                                <strong>Nr rezerwacji:</strong> {cr.reservation_id}
                                                            </p>
                                                            <p style={{
                                                                marginBottom: "10px"
                                                            }}>
                                                                <strong>Nr pokoju:</strong> {cr.room_number}
                                                            </p>
                                                            <p style={{
                                                                marginBottom: "10px"
                                                            }}>
                                                                <strong>Data zameldowania:</strong> {cr.check_in}, 14:00
                                                            </p>
                                                            <p style={{
                                                                marginBottom: "10px"
                                                            }}>
                                                                <strong>Data wymeldowania:</strong> {cr.check_out}, 12:00
                                                            </p>
                                                            <p style={{
                                                                marginBottom: "10px"
                                                            }}>
                                                                <strong>Rodzaj pokoju:</strong> {cr.room_type}
                                                            </p>
                                                        </div>
                                                        <div style={{textAlign: "center", marginTop: 20}}>
                                                            <Button
                                                                variant="dark"
                                                                href={`/manage_reservation/${cr.reservation_id}`}
                                                            >
                                                                Zarządzaj rezerwacją
                                                            </Button>
                                                        </div>
                                                    </Card.Text>


                                                </div>
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
                        <Card.Title>
                            <h2>Historia Rezerwacji</h2>
                        </Card.Title>
                        {reservations?.length > 0 ? (
                            <div>
                                <Table striped bordered hover responsive style={{ textAlign: "center" }}>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Hotel</th>
                                            <th>Adres</th>
                                            <th>Data zameldowania</th>
                                            <th>Data wymeldowania</th>
                                            <th>Numer pokoju</th>
                                            <th>Rodzaj pokoju</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentReservationsHistory.map((reservation) => (
                                            <tr
                                                key={reservation.reservation_id}
                                                onClick={() =>
                                                    window.location.href = `/manage_reservation/${reservation.reservation_id}/`
                                                }
                                                style={{ cursor: "pointer" }}
                                            >
                                                <td>{reservation.reservation_id}</td>
                                                <td>{reservation.hotel.slice(0, 18)}</td>
                                                <td>{reservation.hotel.slice(18)}, {reservation.hotel.slice(12, 18)}</td>
                                                <td>{reservation.check_in}</td>
                                                <td>{reservation.check_out}</td>
                                                <td>{reservation.room_number}</td>
                                                <td>{reservation.room_type}</td>
                                                <td
                                                    style={{
                                                        backgroundColor:
                                                            reservation.status === "Opłacona"
                                                                ? "lightgreen"
                                                                : reservation.status === "Anulowana"
                                                                ? "palevioletred"
                                                                : reservation.status === "W trakcie"
                                                                ? "lightblue"
                                                                : reservation.status === "Zakończona"
                                                                ? "lightcyan"
                                                                : "lightgray",
                                                    }}
                                                >
                                                    {reservation.status}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <div style={{textAlign: "right", marginBottom: 20}}>
                                    <a href="/userReservations/" style={{color: "#000000"}}>Zobacz więcej...</a>
                                </div>

                                {/* Paginacja */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: "20px",
                                    }}
                                >
                                    <button
                                        onClick={() => handlePageChangeHistory(1)}
                                        disabled={currentPageHistory === 1}
                                        style={{
                                            padding: "8px 12px",
                                            margin: "0 5px",
                                            background: currentPageHistory === 1 ? "#fff" : "#333",
                                            color: currentPageHistory === 1 ? "#333" : "#fff",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {"<<"}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handlePageChangeHistory(Math.max(currentPageHistory - 1, 1))
                                        }
                                        disabled={currentPageHistory === 1}
                                        style={{
                                            padding: "8px 12px",
                                            margin: "0 5px",
                                            background: currentPageHistory === 1 ? "#fff" : "#333",
                                            color: currentPageHistory === 1 ? "#333" : "#fff",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {"<"}
                                    </button>
                                    {generatePageNumbersHistory().map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChangeHistory(page)}
                                            style={{
                                                padding: "5px 10px",
                                                margin: "0 5px",
                                                cursor: "pointer",
                                                backgroundColor:
                                                    page === currentPageHistory ? "gray" : "white",
                                                color: page === currentPageHistory ? "white" : "black",
                                                border: "1px solid #ccc",
                                                borderRadius: "4px",
                                            }}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() =>
                                            handlePageChangeHistory(
                                                Math.min(currentPageHistory + 1, totalPagesHistory)
                                            )
                                        }
                                        disabled={currentPageHistory === totalPagesHistory}
                                        style={{
                                            padding: "8px 12px",
                                            margin: "0 5px",
                                            background: currentPageHistory === totalPagesHistory ? "#fff" : "#333",
                                            color: currentPageHistory === totalPagesHistory ? "#333" : "#fff",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {">"}
                                    </button>
                                    <button
                                        onClick={() => handlePageChangeHistory(totalPagesHistory)}
                                        disabled={currentPageHistory === totalPagesHistory}
                                        style={{
                                            padding: "8px 12px",
                                            margin: "0 5px",
                                            background: currentPageHistory === totalPagesHistory ? "#fff" : "#333",
                                            color: currentPageHistory === totalPagesHistory ? "#333" : "#fff",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {">>"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <h6>
                                Brak historii poprzednich rezerwacji. Gdy zaczniesz rezerwować nasze pokoje,
                                rezerwacje oraz ich statusy pojawią się w tym miejscu.
                                Pokój możesz zarezerwować w zakładce{" "}
                                <a href={"/reservation/"}>"Zarezerwuj"</a>.
                            </h6>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        </Container>
    );
};

export default CustomerPanel;
