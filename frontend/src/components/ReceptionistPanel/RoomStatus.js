import React from 'react';

const RoomStatus = ({ roomStatuses, onUpdateStatus }) => {
  const handleRoomStatusChange = (roomNumber, newStatus) => {
    onUpdateStatus(prev =>
      prev.map(room =>
        room.roomNumber === roomNumber ? { ...room, status: newStatus } : room
      )
    );
  };

  return (
    <div className="room-status-list">
      {roomStatuses.map(room => (
        <div key={room.roomNumber} className="room-card">
          <p>Room {room.roomNumber}</p>
          <select
            value={room.status}
            onChange={(e) => handleRoomStatusChange(room.roomNumber, e.target.value)}
          >
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default RoomStatus;
