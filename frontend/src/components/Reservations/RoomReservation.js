import React, { useEffect, useState } from 'react';
import './RoomReservation.css';
import { Room } from "../../interfaces/Room.ts";
import { Floor } from "../../interfaces/Floor.ts";
import axios from "axios";

const RoomReservation = ({ rooms, hotel, checkIn, checkOut, roomStandard }) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [floor, setFloor] = useState(1);
    const [floors, setFloors] = useState([]);
    const [newRooms, setNewRooms] = useState(null);

    const handleRoomClick = (room) => {
        setSelectedRoom(room);
    };

    const handleFloorChange = (newFloor) => {
        const fetchRooms = async () => {
            try {
                const response = await axios.put("http://127.0.0.1:8000/api/rooms/", {
                    type: roomStandard,
                    check_in_date: checkIn,
                    check_out_date: checkOut,
                    hotel_id: hotel.hotel_id,
                    floor_number: newFloor
                });
                setNewRooms(response.data);
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };
        fetchRooms();
        setFloor(newFloor);
        setSelectedRoom(null); // Reset selected room on floor change
    };

    useEffect(() => {
        setNewRooms(rooms);
        if (floors.length === 0) {  // Ensuring `floors` is an array before fetching
            axios.get(`http://127.0.0.1:8000/api/floors/${hotel.hotel_id}`)
                .then(response => {
                    setFloors(response.data);
                })
                .catch(() => {
                    console.log("Error fetching floors");
                });
        }
    }, [hotel, rooms, floors]);

    return (
        <div className="room-reservation-container">
            <h1>Room Reservation System</h1>

            {/* Floor Selection */}
            <div className="floor-selector">
                <label>Select Floor: </label>
                <div>
                    {floors.map((f) => (
                        <button
                            key={f.floor_number}
                            className={floor === f.floor_number ? 'selected' : ''}
                            onClick={() => handleFloorChange(f.floor_number)}
                        >
                            Piętro {f.floor_number}
                        </button>
                    ))}
                </div>
            </div>

            <div className="rooms-floor-layout">
                <div className="corridor">Corridor</div>
                <div className="rooms-section">
                    {newRooms ? newRooms.map((room) => (
                        <div
                            key={room.room_id}
                            className={`room-box
                            ${room.status === "Available" ? 'available' : 'unavailable'}
                            ${selectedRoom && selectedRoom.room_number === room.room_number ? 'selected' : ''}
                            ${room.status === "Unavailable" && selectedRoom && selectedRoom.room_number === room.room_number ? 'unavailable-selected' : ''}`}
                            onClick={() => handleRoomClick(room)}
                        >
                            Room {room.room_number}
                        </div>
                    )) : <div>Loading rooms...</div>}
                </div>
            </div>

            {selectedRoom && (
                <div className="room-details" style={{ color: "black" }}>
                    <h2>Room {selectedRoom.room_number} Details</h2>
                    <p>Status: {selectedRoom.status}</p>
                    <p>Type: {selectedRoom.type}</p>
                    <p>Price: ${selectedRoom.price}</p>
                    {selectedRoom.status === "Available" && (
                        <a href={`/reservation/room/${selectedRoom.room_id}/?checkIn=${checkIn}&checkOut=${checkOut}`}>
                            <button>Reserve</button>
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

export default RoomReservation;
