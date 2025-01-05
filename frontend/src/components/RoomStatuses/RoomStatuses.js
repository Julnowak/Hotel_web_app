import React, {useEffect, useState} from "react";
import RoomList from "./RoomList";
import RoomModal from "./RoomModel";
import "./RoomStatuses.css"
import axios from "axios";
import {useParams} from "react-router-dom";
import client from "../client";

const RoomStatuses = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const params = useParams();
  const [floors, setFloors] = useState([]);

  useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await client.get(`http://127.0.0.1:8000/api/rooms/${params.id}`,{
                    params: {
                        check_in: new Date(),
                        check_out: new Date(),

                    }
                });
                setRooms(response.data);
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };
        
        if (floors.length === 0) {  // Ensuring `floors` is an array before fetching
        client.get(`http://127.0.0.1:8000/api/floors/${params.id}`)
            .then(response => {
                setFloors(response.data);
            })
            .catch(() => {
                console.log("Error fetching floors");
            });
        }

        if (!rooms.length) fetchRooms();
  }, [floors.length, params.id, rooms.length]);


  const updateRoomStatus = (roomNumber, newStatus, roomId) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.room_number === roomNumber ? { ...room, status: newStatus } : room
      )
    );
    setSelectedRoom(null);
    try {
        client.post(`http://127.0.0.1:8000/api/roomStatusChange/${roomId}`,{
        newStatus: newStatus,
        });
    } catch (error) {
        console.error("Error fetching rooms:", error);
    }
  };

  return (
    <div>
      <h1 style={{margin: 20}}>Statusy pokoi</h1>
      <RoomList rooms={rooms} setSelectedRoom={setSelectedRoom} floors={floors} />
      {selectedRoom && (
        <RoomModal
          room={selectedRoom}
          closeModal={() => setSelectedRoom(null)}
          updateRoomStatus={updateRoomStatus}
        />
      )}
    </div>
  );
};

export default RoomStatuses;
