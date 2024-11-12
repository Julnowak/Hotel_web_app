import React, {useEffect, useState} from 'react';
import './RoomReservation.css';
import {Room} from "../../interfaces/Room.ts"
import {Floor} from "../../interfaces/Floor.ts"
import RoomRoom from "../Reservations/Room"
import axios from "axios";


const RoomReservation = ({rooms, hotel}) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [floor, setFloor] = useState(1);
    const [floors, setFloors] = useState(null);


    // Generowanie pokoi dla pięter (każde piętro ma 50 pokoi)

    const handleRoomClick = (room) => {
        setSelectedRoom(room);
        console.log(room)
    };

    const handleFloorChange = (newFloor) => {
        setFloor(newFloor);
        setSelectedRoom(null); // Resetuj wybrany pokój przy zmianie piętra
    };

    console.log(floors)


    useEffect(() => {
        if (floors === null) {
            axios.get(`http://127.0.0.1:8000/api/floors/${hotel.hotel_id}`)
                .then(response => {
                    setFloors(response.data);
                })
                .catch(function () {
                    console.log("error")
                });
        }
    }, [floors,hotel]);

    return (
        <div className="room-reservation-container">
            <h1>Room Reservation System</h1>

            {/*<div*/}
            {/*  style={{*/}
            {/*    display: 'grid', // Adjust to flex if needed*/}
            {/*    gridTemplateColumns: 'repeat(5, 1fr)', // Adjust columns based on room layout*/}
            {/*    gap: '10px',*/}
            {/*    maxWidth: '600px', // Limit layout width for better visuals*/}
            {/*    margin: 'auto',*/}
            {/*  }}*/}
            {/*>*/}
            {/*  {[...Array(20).keys()].map((i) => (*/}

            {/*    <RoomRoom*/}
            {/*      key={i + 1}*/}
            {/*      roomNumber={i + 1}*/}
            {/*      onClick={handleRoomClick}*/}
            {/*      isSelected={selectedRoom === i + 1}*/}
            {/*    />*/}
            {/*  ))}*/}
            {/*</div>*/}

            {/* Wybór piętra */}
            <div className="floor-selector">
                <label>Select Floor: </label>
                <select value={floor} onChange={(e) => handleFloorChange(parseInt(e.target.value))}>
                    {floors === null ? null :floors.map((f:Floor) => (
                        <option key={f.floor_id} value={f.floor_number}>
                            Piętro {f.floor_number}
                        </option>
                    ))}
                </select>
            </div>

            {/* Siatka pokoi z symulacją korytarza */}
            <div className="rooms-floor-layout">
                <div className="corridor">Corridor</div>
                <div className="rooms-section">
                    {rooms === null ? null : rooms.map((room: Room) => (
                        <div
                            key={room.room_id}
                            className={`
              ${
                                room ? room.status === "Available"
                                        ? 'room-box'
                                        : room.status === "Unavailable"
                                            ? 'room-box-box'
                                            : ''
                                    : ''
                            }
                
                ${
                                selectedRoom && selectedRoom.room_number === room.room_number
                                    ? selectedRoom.status === "Available"
                                        ? 'selected' : '' : ''
                            }`}

                            onClick={(e) => handleRoomClick(room)}
                        >
                            Room {room.room_number}
                        </div>
                    ))}
                </div>
            </div>

            {selectedRoom ?
                <div className="room-details" style={{color: "black"}}>
                    <h2>Room {selectedRoom.room_number} Details</h2>
                    <p>Status: {selectedRoom.status}</p>
                    <p>Type: {selectedRoom.type}</p>
                    <p>Price: ${selectedRoom.price}</p>
                    {selectedRoom.status === "Available" ?
                        <a href={`/reservation/room/${selectedRoom.room_id}/`}>
                            <button>Zarezerwuj</button>
                        </a> : null}
                </div>
                : ""}
        </div>
    );
};

export default RoomReservation;
