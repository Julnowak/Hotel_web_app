import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import RoomReservation from "../Reservations/RoomReservation";

const EditReservationPage = () => {
  const params= useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");



  const fetchReservationData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/reservation/${params.id}/`);
      setReservation(response.data);
      setSelectedRoom(response.data.room);
    } catch (error) {
      console.error("Error fetching reservation data:", error);
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/rooms/available/");
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching available rooms:", error);
    }
  };

    useEffect(() => {
    fetchReservationData();
    fetchAvailableRooms();
  }, [fetchReservationData]);

  const handleUpdateReservation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/reservation/${params.id}/`, {
        ...reservation,
        room: selectedRoom,
      });
      setStatusMessage("Rezerwacja została zaktualizowana.");
    } catch (error) {
      console.error("Error updating reservation:", error);
      setStatusMessage("Wystąpił błąd podczas aktualizacji rezerwacji.");
    }
  };

  const handleDeleteReservation = async () => {
    if (window.confirm("Czy na pewno chcesz usunąć tę rezerwację?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/reservation/${params.id}/`);
        navigate("/user-reservations"); // Powrót do listy rezerwacji
      } catch (error) {
        console.error("Error deleting reservation:", error);
        setStatusMessage("Wystąpił błąd podczas usuwania rezerwacji.");
      }
    }
  };

  if (!reservation) return <p>Wczytywanie danych rezerwacji...</p>;

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Edycja Rezerwacji</h1>
      {statusMessage && <Alert variant="info">{statusMessage}</Alert>}
      <div>
                    <RoomReservation rooms={rooms} hotel={reservation.hotel} checkIn={reservation.check_in} checkOut={reservation.check_out} roomStandard={reservation.standard}/>
                </div>
      <Form onSubmit={handleUpdateReservation}>
        <Form.Group controlId="room">
          <Form.Label>Pokój</Form.Label>
          <Form.Select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            {rooms.map((room) => (
              <option key={room.room_id} value={room.room_id}>
                {room.hotel} - Pokój {room.room_number} ({room.type})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="status" className="mt-3">
          <Form.Label>Status Rezerwacji</Form.Label>
          <Form.Control
            type="text"
            value={reservation.status}
            onChange={(e) => setReservation({ ...reservation, status: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="people_number" className="mt-3">
          <Form.Label>Liczba osób</Form.Label>
          <Form.Control
            type="number"
            value={reservation.people_number}
            onChange={(e) => setReservation({ ...reservation, people_number: e.target.value })}
          />
        </Form.Group>

        <Row className="mt-4">
          <Col>
            <Button variant="success" type="submit" className="w-100">
              Zapisz Zmiany
            </Button>
          </Col>
          <Col>
            <Button variant="danger" className="w-100" onClick={handleDeleteReservation}>
              Usuń Rezerwację
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default EditReservationPage;
