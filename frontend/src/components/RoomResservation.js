import React, { useState } from 'react';
import './RoomReservation.css'; // Import pliku CSS zdefiniowanego poniżej

const RoomReservation = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [floor, setFloor] = useState(1);

  // Generowanie pokoi dla pięter (każde piętro ma 50 pokoi)
  const roomsPerFloor = Array.from({ length: 50 }, (_, index) => ({
    roomNumber: index + 1 + (floor - 1) * 50,
    status: index % 3 === 0 ? 'Occupied' : 'Available',
    price: 100 + (index % 5) * 20,
    guestName: index % 3 === 0 ? `Guest ${index + 1 + (floor - 1) * 50}` : null,
  }));

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  const handleFloorChange = (newFloor) => {
    setFloor(newFloor);
    setSelectedRoom(null); // Resetuj wybrany pokój przy zmianie piętra
  };

  return (
    <div className="room-reservation-container">
      <h1>Room Reservation System</h1>

      {/* Wybór piętra */}
      <div className="floor-selector">
        <label>Select Floor: </label>
        <select value={floor} onChange={(e) => handleFloorChange(parseInt(e.target.value))}>
          {[1, 2, 3, 4, 5].map((floorNumber) => (
            <option key={floorNumber} value={floorNumber}>
              Floor {floorNumber}
            </option>
          ))}
        </select>
      </div>

      {/* Siatka pokoi z symulacją korytarza */}
      <div className="rooms-floor-layout">
        <div className="rooms-section">
          {roomsPerFloor.slice(0, 25).map((room) => (
            <div
              key={room.roomNumber}
              className={`room-box ${selectedRoom && selectedRoom.roomNumber === room.roomNumber ? 'selected' : ''}`}
              onClick={() => handleRoomClick(room)}
            >
              Room {room.roomNumber}
            </div>
          ))}
        </div>
        <div className="corridor">Corridor</div>
        <div className="rooms-section">
          {roomsPerFloor.slice(25, 50).map((room) => (
            <div
              key={room.roomNumber}
              className={`room-box ${selectedRoom && selectedRoom.roomNumber === room.roomNumber ? 'selected' : ''}`}
              onClick={() => handleRoomClick(room)}
            >
              Room {room.roomNumber}
            </div>
          ))}
        </div>
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
