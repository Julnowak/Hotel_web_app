import React, {useEffect, useState} from "react";
import RoomList from "./RoomList";
import RoomModal from "./RoomModel";
import "./RoomStatuses.css"
import axios from "axios";

const RoomStatuses = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/rooms/${1}`,{
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

        if (!rooms.length) fetchRooms();
  }, [rooms.length]);


  const updateRoomStatus = (roomNumber, newStatus, roomId) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.room_number === roomNumber ? { ...room, status: newStatus } : room
      )
    );
    setSelectedRoom(null);
    try {
        axios.post(`http://127.0.0.1:8000/api/roomStatusChange/${roomId}`,{
        newStatus: newStatus,
        });
    } catch (error) {
        console.error("Error fetching rooms:", error);
    }
  };

  return (
    <div>
      <h1 style={{margin: 20}}>Statusy pokoi</h1>
      <RoomList rooms={rooms} setSelectedRoom={setSelectedRoom} />
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
