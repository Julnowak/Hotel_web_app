import React, { useState, useEffect } from "react";
import { Button, Container, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageRoomPricesPage = () => {
  const [roomPrices, setRoomPrices] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoomPrices();
  }, []);

  const fetchRoomPrices = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/rooms/prices/");
      setRoomPrices(response.data);
    } catch (error) {
      console.error("Error fetching room prices:", error);
    }
  };

  const handleManageRoom = (roomId) => {
    navigate(`/manage_room/${roomId}`);
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Ceny Pokoi</h1>
      {statusMessage && <Alert variant="info">{statusMessage}</Alert>}
      <section className="room-prices-section">
        <h2 className="mb-4 text-center">Lista Cen Pokoi</h2>
        <Row className="g-4">
          {Object.keys(roomPrices).map((roomId) => (
            <Col md={6} lg={4} key={roomId}>
              <div className="room-price-card p-3 border rounded shadow-sm bg-light">
                <h5 className="mb-3 text-primary">Pokój {roomPrices[roomId].room_number}</h5>
                <p className="mb-1">
                  <strong>Hotel:</strong> {roomPrices[roomId].hotel_name}
                </p>
                <p className="mb-3">
                  <strong>Cena:</strong> {roomPrices[roomId].price} PLN
                </p>
                <Button
                  variant="primary"
                  onClick={() => handleManageRoom(roomId)}
                  className="w-100"
                >
                  Zarządzaj Pokojem
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      </section>
    </Container>
  );
};

export default ManageRoomPricesPage;
