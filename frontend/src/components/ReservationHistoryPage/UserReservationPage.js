import React, { useState, useEffect } from "react";
import { Button, Pagination, Container, Row, Col, Badge } from "react-bootstrap";
import axios from "axios";
import './UserReservationPage.css';

const UserReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const reservationsPerPage = 5; // Liczba rezerwacji na stronie

  useEffect(() => {
    fetchReservations(currentPage);
  }, [currentPage]);

  const fetchReservations = async (page) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/userReservations/?page=${page}&per_page=${reservationsPerPage}`
      );

      setReservations(response.data.results); // Zakładamy, że wyniki są w `results`
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Moje Rezerwacje</h1>
      <div className="reservation-list">
        {reservations.map((reservation) => (
          <div key={reservation.reservation_id} className="reservation-item shadow-sm">
            <Row className="align-items-center g-3">
              {/* Zdjęcie pokoju */}
              <Col xs={12} md={4}>
                <img
                  src={"https://catpaw.pl/wp-content/uploads/2024/09/Kot-Europjeski.png" || "/images/default-room.jpg"} // Domyślny obrazek jeśli brak
                  alt={reservation.room_type}
                  className="img-fluid rounded reservation-image"
                />
              </Col>
              {/* Informacje o rezerwacji */}
              <Col xs={12} md={8}>
                <div >
                  <h4>{reservation.hotel}</h4>
                  <p>
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
                    >
                      {reservation.status}
                    </Badge>
                  </p>
                  <Button
                    variant="primary"
                    href={`/manage_reservation/${reservation.reservation_id}`}
                    className="mt-2"
                  >
                    Zarządzaj
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        ))}
      </div>
      {/* Paginacja */}
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </Container>
  );
};

export default UserReservationsPage;
