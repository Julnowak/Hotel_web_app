import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {API_BASE_URL} from "../../config";

const ManageRoomPage = () => {
  const params = useParams(); // Get room ID from URL
  const [roomData, setRoomData] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
      const fetchRoomDetails = async () => {
        try {
          console.log(params)
          const response = await axios.get(`${API_BASE_URL}/manage/room/${params.id}/`);
          setRoomData(response.data);
        } catch (error) {
          setErrorMessage("Błąd podczas ładowania danych pokoju.");
          console.error("Error fetching room details:", error);
        }
      };

    fetchRoomDetails();
  }, );



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/rooms/${params.id}/`, roomData);
      setStatusMessage("Dane pokoju zostały zaktualizowane.");
    } catch (error) {
      setErrorMessage("Błąd podczas aktualizacji danych pokoju.");
      console.error("Error updating room details:", error);
    }
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Zarządzanie Pokojem</h1>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {statusMessage && <Alert variant="success">{statusMessage}</Alert>}

      {roomData ? (
        <Form onSubmit={handleSubmit}>
          <Row className="g-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Numer Pokoju</Form.Label>
                <Form.Control
                  type="number"
                  name="room_number"
                  value={roomData.room_number}
                  onChange={handleInputChange}
                  disabled
                  readOnly
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Typ Pokoju</Form.Label>
                <Form.Control
                  type="text"
                  name="type"
                  value={roomData.type}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Hotel</Form.Label>
                <Form.Control
                  type="text"
                  name="hotel"
                  value={roomData.hotel}
                  onChange={handleInputChange}
                  disabled
                  readOnly
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Cena (PLN)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="price"
                  value={roomData.price}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={roomData.status}
                  onChange={handleInputChange}
                >
                  <option value="Available">Dostępny</option>
                  <option value="Occupied">Zajęty</option>
                  <option value="Maintenance">W Remoncie</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Pojemność Osób</Form.Label>
                <Form.Control
                  type="number"
                  name="people_capacity"
                  value={roomData.people_capacity}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Piętro</Form.Label>
                <Form.Control
                  type="text"
                  name="floor"
                  value={roomData.floor}
                  onChange={handleInputChange}
                  disabled
                  readOnly
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Dostosowany</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="custom"
                  label="Tak"
                  checked={roomData.custom}
                  onChange={(e) =>
                    setRoomData((prevData) => ({
                      ...prevData,
                      custom: e.target.checked,
                    }))
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="text-center mt-4">
            <Button type="submit" variant="primary" className="px-5">
              Zapisz Zmiany
            </Button>
            <Button
              variant="secondary"
              className="px-5 ms-3"
              onClick={() => navigate(-1)}
            >
              Powrót
            </Button>
          </div>
        </Form>
      ) : (
        <p className="text-center">Ładowanie danych pokoju...</p>
      )}
    </Container>
  );
};

export default ManageRoomPage;
