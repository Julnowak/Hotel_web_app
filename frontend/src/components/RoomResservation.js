import React, { useState } from 'react';
import './RoomReservation.css'; // Import pliku CSS zdefiniowanego poniżej

const RoomReservation = () => {
  // Stan dla wybranego pokoju
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Przykładowe informacje o pokojach
  const rooms = Array.from({ length: 50 }, (_, index) => ({
    roomNumber: index + 1,
    status: index % 3 === 0 ? 'Occupied' : 'Available',
    price: 100 + (index % 5) * 20,
    guestName: index % 3 === 0 ? `Guest ${index + 1}` : null,
  }));

  // Funkcja do obsługi kliknięcia na pokój
  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  return (
    <div className="room-reservation-container">
      <h1>Room Reservation System</h1>
      <div className="rooms-grid">
        {rooms.map((room) => (
          <div
            key={room.roomNumber}
            className={`room-box ${selectedRoom && selectedRoom.roomNumber === room.roomNumber ? 'selected' : ''}`}
            onClick={() => handleRoomClick(room)}
          >
            Room {room.roomNumber}
          </div>
        ))}
      </div>

      {selectedRoom && (
        <div className="room-details">
          <h2>Room {selectedRoom.roomNumber} Details</h2>
          <p>Status: {selectedRoom.status}</p>
          <p>Price: ${selectedRoom.price}</p>
          {selectedRoom.guestName && <p>Guest: {selectedRoom.guestName}</p>}
        </div>
      )}
    </div>
  );
};

export default RoomReservation;
