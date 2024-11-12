// Room.js
import React from 'react';

function RoomRoom({ roomNumber, onClick, isSelected }) {
  return (
    <div
      onClick={() => onClick(roomNumber)}
      style={{
        cursor: 'pointer',
        padding: '20px',
        margin: '5px',
        backgroundColor: isSelected ? '#ADD8E6' : '#f0f0f0', // Change color if selected
        border: '1px solid #ccc',
        textAlign: 'center',
      }}
    >
      Room {roomNumber}
    </div>
  );
}

export default RoomRoom;
