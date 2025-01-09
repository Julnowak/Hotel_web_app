import React, { useState, useEffect } from "react";
import { Button, Container, Alert, Row, Col, Form, Card } from "react-bootstrap";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config";

const ManageRoomPricesPage = () => {
    const [roomPrices, setRoomPrices] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [roomNumberFilter, setRoomNumberFilter] = useState("");
    const [roomTypeFilter, setRoomTypeFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage] = useState(20);
    const [statusMessage, setStatusMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const hotelId = queryParams.get("hotelId");
    const [flag, setFlag] = useState(false);

    useEffect(() => {
        const fetchRoomPrices = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/rooms/prices/`, {
                    params: { hotelId },
                });
                if (Array.isArray(response.data)) {
                    setRoomPrices(response.data);
                    setFilteredRooms(response.data);
                } else {
                    console.error("Unexpected API response format:", response.data);
                }
            } catch (error) {
                console.error("Error fetching room prices:", error);
            }
        };

        if (!flag) {
            fetchRoomPrices();
            setFlag(true);
        }
    }, [flag, hotelId]);



    const handleFilter = () => {
        const filtered = roomPrices.filter((room) => {
            const matchesNumber =
                roomNumberFilter === "" ||
                room.room_number.toString().includes(roomNumberFilter);
            const matchesType =
                roomTypeFilter === "" || room.room_type === roomTypeFilter;
            return matchesNumber && matchesType;
        });
        setFilteredRooms(filtered);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

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

    return (
        <Container className="py-5">
            <h1 className="text-center mb-4">Zarządzaj pokojami</h1>
            {statusMessage && <Alert variant="info">{statusMessage}</Alert>}

            <Form className="mb-4">
                <Row>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Filtruj po numerze pokoju:</Form.Label>
                            <Form.Control
                                type="text"
                                value={roomNumberFilter}
                                placeholder="Wpisz numer..."
                                onChange={(e) => setRoomNumberFilter(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Filtruj po typie pokoju:</Form.Label>
                            <Form.Select
                                value={roomTypeFilter}
                                onChange={(e) => setRoomTypeFilter(e.target.value)}
                            >
                                <option value="">Wszystkie</option>
                                <option value="standard">Standard</option>
                                <option value="deluxe">Deluxe</option>
                                <option value="suite">Apartament</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4} className="d-flex align-items-end">
                        <Button variant="primary" onClick={handleFilter} className="w-100">
                            Filtruj
                        </Button>
                    </Col>
                </Row>
            </Form>

            <section className="room-prices-section">
                <h2 className="mb-4 text-center">Lista Pokoi</h2>
                <Row className="g-4">
                    {filteredRooms
                        .filter(
                            (_, index) =>
                                index >= (currentPage - 1) * roomsPerPage &&
                                index < currentPage * roomsPerPage
                        )
                        .map((room) => (
                            <Col md={6} lg={4} key={room.room_id}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Pokój {room.room_number}</Card.Title>
                                        <Card.Text>
                                            Typ: {room.room_type}
                                            <br />
                                            Cena: {room.price} PLN
                                        </Card.Text>
                                        <Button
                                            variant="primary"
                                            onClick={() => navigate(`/manage_room/${room.room_number}?hotelId=${hotelId}`)}
                                        >
                                            Zarządzaj
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                </Row>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "20px",
                    }}
                >
                    <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        style={{ margin: "0 5px", padding: "8px 12px" }}
                    >
                        {"<<"}
                    </button>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        style={{ margin: "0 5px", padding: "8px 12px" }}
                    >
                        {"<"}
                    </button>
                    {generatePageNumbers().map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            style={{
                                margin: "0 5px",
                                padding: "8px 12px",
                                backgroundColor: page === currentPage ? "gray" : "white",
                            }}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        style={{ margin: "0 5px", padding: "8px 12px" }}
                    >
                        {">"}
                    </button>
                    <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        style={{ margin: "0 5px", padding: "8px 12px" }}
                    >
                        {">>"}
                    </button>
                </div>
            </section>
        </Container>
    );
};

export default ManageRoomPricesPage;
