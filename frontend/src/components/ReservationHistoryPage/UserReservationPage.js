import React, {useState, useEffect} from "react";
import {Button, Container, Row, Col, Badge} from "react-bootstrap";
import './UserReservationPage.css';
import {API_BASE_URL} from "../../config";
import client from "../client";

const UserReservationsPage = () => {
    const [reservations, setReservations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const reservationsPerPage = 5; // Liczba rezerwacji na stronę

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await client.get(`${API_BASE_URL}/userReservations/`);
            console.log(response.data);

            setReservations(response.data); // Zakładamy, że odpowiedź to lista rezerwacji
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };

    const getPaginatedReservations = () => {
        const startIndex = (currentPage - 1) * reservationsPerPage;
        const endIndex = startIndex + reservationsPerPage;
        return reservations.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(reservations.length / reservationsPerPage);

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
            <h1 className="text-center mb-4">Moje Rezerwacje</h1>
            <div className="reservation-list">
                {getPaginatedReservations().map((reservation) => (
                    <div key={reservation.reservation_id} className="reservation-item shadow-sm">
                        <Row
  className="align-items-center shadow-sm rounded g-3"
  style={{
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
  }}
>
  {/* Zdjęcie pokoju */}
  <Col xs={12} md={4}>
    <img
      src={`/images/hotel_rooms_images/room_${reservation.room_type}.jpg` || "/images/default-room.jpg"}
      alt={reservation.room_type}
      className="img-fluid rounded reservation-image"
      style={{
        width: "100%",
        height: "auto",
        objectFit: "cover",
        borderRadius: "8px",
      }}
    />
  </Col>
  {/* Informacje o rezerwacji */}
  <Col xs={12} md={8}>
    <div>
      <h4
        style={{
          color: "#333",
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      >
        {reservation.hotel.slice(0, 18)}
      </h4>
      <p
        style={{
          color: "#555",
          fontSize: "14px",
          lineHeight: "1.6",
          marginBottom: "15px",
        }}
      >
        <strong>Adres:</strong> {reservation.hotel.slice(18)} <br />
        <strong>Numer pokoju:</strong> {reservation.room_number} <br />
        <strong>Rodzaj pokoju:</strong> {reservation.room_type} <br />
        <strong>Data zameldowania:</strong> {reservation.check_in} <br />
        <strong>Data wymeldowania:</strong> {reservation.check_out} <br />
        <strong>Liczba osób:</strong> {reservation.people_number} <br />
        <strong>Status:</strong>{" "}
        <Badge
          bg={
            reservation.status === "Opłacona"
              ? "success"
              : reservation.status === "Anulowana"
              ? "danger"
              : reservation.status === "W trakcie"
              ? "warning"
              : reservation.status === "Zakończona"
              ? "primary"
              : "secondary"
          }
          style={{
            fontSize: "12px",
            padding: "5px 10px",
            borderRadius: "20px",
          }}
        >
          {reservation.status}
        </Badge>
      </p>
      <div style={{ textAlign: "right" }}>
        <Button
          variant="dark"
          href={`/manage_reservation/${reservation.reservation_id}`}
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            fontWeight: "bold",
            borderRadius: "6px",
            backgroundColor: "#333",
            borderColor: "#333",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#555")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#333")}
        >
          Zarządzaj
        </Button>
      </div>
    </div>
  </Col>
</Row>

                    </div>
                ))}
            </div>
            {/* Paginacja */}
            <div
                style={{
                    display: "flex",
                    marginTop: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <button
                    onClick={() => setCurrentPage(1)}
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
                    {"<"}
                </button>
                {generatePageNumbers().map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        style={{
                            padding: "5px 10px",
                            margin: "0 5px",
                            cursor: "pointer",
                            backgroundColor: page === currentPage ? "gray" : "white",
                            color: page === currentPage ? "black" : "black",
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
                    {">"}
                </button>
                <button
                    onClick={() => setCurrentPage(totalPages)}
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
                    {">>"}
                </button>
            </div>
        </Container>
    );
};

export default UserReservationsPage;
