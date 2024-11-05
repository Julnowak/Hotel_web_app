import React, {useState} from 'react';
import './RoomReservation.css'; // Import pliku CSS zdefiniowanego poniżej
import {Room} from "../../interfaces/Room.ts"


const RoomReservation = ({rooms}) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [floor, setFloor] = useState(1);


  // Generowanie pokoi dla pięter (każde piętro ma 50 pokoi)

  const handleRoomClick = (room) => {
        setSelectedRoom(room);
        console.log(room)
  };

  const handleFloorChange = (newFloor) => {
    setFloor(newFloor);
    setSelectedRoom(null); // Resetuj wybrany pokój przy zmianie piętra
  };


  // useEffect(() => {
  //   async function fetchData() {
  //     // You can await here
  //     const response = await fetch('http://localhost:8000/api/rooms/', {
  //       method: 'GET',
  //       headers: {'Content-Type': 'application/json'},
  //     });
  //     const data = await response.json();
  //     console.log(data);
  //     console.log()
  //   }
  //   fetchData();
  // }, []); // Or [] if effect doesn't need props or state


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
        <div className="corridor">Corridor</div>
        <div className="rooms-section">
          {rooms === null? <div></div>: rooms.map((room:Room) => (
            <div
              key={room.room_id}
              className={`
              ${
              room? room.status === "Available"
                  ? 'room-box'
                  : room.status === "Unavailable"
                  ? 'room-box-box'
                  : ''
                : ''
                }
                
                ${
              selectedRoom && selectedRoom.room_number === room.room_number
                ? selectedRoom.status === "Available"
                  ? 'selected': '': ''
                }`}

              onClick={(e) => handleRoomClick(room)}
            >
              Room {room.room_number}
            </div>
          ))}
        </div>
      </div>

      {selectedRoom?
        <div className="room-details" style={{color: "black"}}>
          <h2>Room {selectedRoom.room_number} Details</h2>
          <p>Status: {selectedRoom.status}</p>
          <p>Type: {selectedRoom.type}</p>
          <p>Price: ${selectedRoom.price}</p>
            {selectedRoom.status === "Available"? <button>Zarezerwuj</button>: null}
        </div>
      : ""}
    </div>
  );
};

export default RoomReservation;
