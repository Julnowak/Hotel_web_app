import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
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

  const handlePriceChange = (roomId, newPrice) => {
    setRoomPrices((prevPrices) => ({
      ...prevPrices,
      [roomId]: { ...prevPrices[roomId], price: newPrice },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://127.0.0.1:8000/api/rooms/prices/", roomPrices);
      setStatusMessage("Ceny pokoi zostały zaktualizowane.");
    } catch (error) {
      console.error("Error updating room prices:", error);
      setStatusMessage("Wystąpił błąd podczas aktualizacji cen pokoi.");
    }
  };

  const handleManageRoom = (roomId) => {
    navigate(`/manage-room/${roomId}`);
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Zarządzanie Cenami Pokoi</h1>
      {statusMessage && <Alert variant="info">{statusMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <section className="room-prices-section">
          <h2 className="mb-4">Ustawienia Cen Pokoi</h2>
          <Row className="g-4">
            {Object.keys(roomPrices).map((roomId) => (
              <Col md={6} lg={4} key={roomId}>
                <div className="room-price-setting p-3 border rounded shadow-sm">
                  <h5>Pokój {roomPrices[roomId].room_number}</h5>
                  <p>
                    Hotel: <strong>{roomPrices[roomId].hotel_name}</strong>
                  </p>
                  <label className="d-block mb-2">
                    Cena (PLN):
                    <input
                      type="number"
                      className="form-control"
                      value={roomPrices[roomId].price}
                      onChange={(e) =>
                        handlePriceChange(roomId, parseFloat(e.target.value))
                      }
                    />
                  </label>
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
        <div className="mt-4 text-center">
          <Button type="submit" variant="success" className="px-5">
            Zapisz Zmiany
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default ManageRoomPricesPage;
