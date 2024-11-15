import React, {useEffect, useState} from 'react';
import './RoomReservation.css';
import {Room} from "../../interfaces/Room.ts"
import {Floor} from "../../interfaces/Floor.ts"
import axios from "axios";


const RoomReservation = ({rooms, hotel, checkIn, checkOut, roomStandard}) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [floor, setFloor] = useState(1);
    const [floors, setFloors] = useState(null);
    const [new_rooms, setNewRooms] = useState(null);


    // Generowanie pokoi dla pięter (każde piętro ma 50 pokoi)

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
        // console.log(floor)
        setSelectedRoom(null); // Resetuj wybrany pokój przy zmianie piętra
    };


    useEffect(() => {
        setNewRooms(rooms)
        if (floors === null) {
            axios.get(`http://127.0.0.1:8000/api/floors/${hotel.hotel_id}`)
                .then(response => {
                    setFloors(response.data);
                })
                .catch(function () {
                    console.log("error")
                });
        }
    }, [floors, hotel, rooms]);

    return (
        <div className="room-reservation-container">
            <h1>Room Reservation System</h1>

            {/* Wybór piętra */}
            <div className="floor-selector">
                <label>Select Floor: </label>
                <select value={floor} onChange={(e) => handleFloorChange(parseInt(e.target.value))}>
                    {floors === null ? null : floors.map((f: Floor) => (
                        <option key={f.floor_number} value={f.floor_number}>
                            Piętro {f.floor_number}
                        </option>
                    ))}
                </select>
            </div>

            <div className="rooms-floor-layout">
                <div className="corridor">Corridor</div>
                <div className="rooms-section">
                    {new_rooms === null ? null : new_rooms.map((room) => (
                        <div
                            key={room.room_id}
                            className={`
                    room-box
                    ${room.status === "Available" ? 'available' : 'unavailable'}
                    ${selectedRoom && selectedRoom.room_number === room.room_number ? 'selected' : ''}
                `}
                            onClick={() => handleRoomClick(room)}
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
                        <a href={`/reservation/room/${selectedRoom.room_id}/?checkIn=${checkIn}&checkOut=${checkOut}`}>
                            <button>Zarezerwuj</button>
                        </a> : null}
                </div>
                : ""}
        </div>
    );
};

export default RoomReservation;
