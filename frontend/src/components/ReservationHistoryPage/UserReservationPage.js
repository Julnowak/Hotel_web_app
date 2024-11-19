import React, { useState, useEffect } from "react";
import { Card, Button, Pagination, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import './UserReservationPage.css'

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
      <Row className="g-4">
        {reservations.map((reservation) => (
          <Col md={6} lg={4} key={reservation.reservation_id}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>{reservation.hotel}</Card.Title>
                <Card.Text>
                  <strong>Rodzaj pokoju:</strong> {reservation.room_type} <br />
                  <strong>Status:</strong> {reservation.status} <br />
                  <strong>Data zameldowania:</strong> {reservation.check_in} <br />
                  <strong>Data wymeldowania:</strong> {reservation.check_out} <br />
                  <strong>Liczba osób:</strong> {reservation.people_number} <br />
                </Card.Text>
                <Button variant="primary" href={`/manage_reservation/${reservation.reservation_id}`}>
                  Zarządzaj
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
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
