import React, { useState } from 'react';
import { Container, Form, Button, Table, Alert } from 'react-bootstrap';

const ReservationSite = () => {
  const [roomStandard, setRoomStandard] = useState('standard');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [message, setMessage] = useState('');

  const roomData = {
    standard: [
      { id: 1, name: 'Standard Room', price: 100 },
      { id: 2, name: 'Deluxe Room', price: 150 },
      { id: 3, name: 'Suite', price: 200 },
    ],
  };

  const checkAvailability = () => {
    // Simulate an API call to check room availability
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const today = new Date();

    if (!checkInDate || !checkOutDate || startDate < today || endDate <= startDate) {
      setMessage('Proszę wprowadzić prawidłowe daty.');
      setAvailableRooms([]);
      return;
    }

    const available = roomData[roomStandard]; // Replace with actual availability check logic
    setAvailableRooms(available);
    setMessage('');
  };

  const handleRoomStandardChange = (e) => {
    setRoomStandard(e.target.value);
    setAvailableRooms([]); // Reset available rooms when changing the room standard
  };

  return (
    <Container>
      <h2>Rezerwacja Pokoju</h2>
      {message && <Alert variant="danger">{message}</Alert>}
      <Form>
        <Form.Group controlId="roomStandard">
          <Form.Label>Wybierz standard pokoju</Form.Label>
          <Form.Control as="select" value={roomStandard} onChange={handleRoomStandardChange}>
            <option value="standard">Standard Room</option>
            <option value="deluxe">Deluxe Room</option>
            <option value="suite">Suite</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="checkInDate">
          <Form.Label>Data zameldowania</Form.Label>
          <Form.Control
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="checkOutDate">
          <Form.Label>Data wymeldowania</Form.Label>
          <Form.Control
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" onClick={checkAvailability}>
          Sprawdź dostępność
        </Button>
      </Form>

      {availableRooms.length > 0 && (
        <div className="mt-4">
          <h4>Dostępne pokoje:</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nazwa</th>
                <th>Cena (PLN)</th>
              </tr>
            </thead>
            <tbody>
              {availableRooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.name}</td>
                  <td>{room.price}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default ReservationSite;