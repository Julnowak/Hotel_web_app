import React, {useEffect, useState} from 'react';
import './RoomsVisual.css';
import client from "../client";
import {Badge} from "react-bootstrap";
import RoomModal from "../RoomStatuses/RoomModel";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {API_BASE_URL} from "../../config";


const RoomsVisual = ({rms, hotel, checkIn, checkOut, roomStandard, changed, reservations = []}) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [floor, setFloor] = useState(1);
    const [floors, setFloors] = useState([]);
    const [newRooms, setNewRooms] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [rooms, setRooms] = useState([]);
    const [flag, setFlag] = useState(false);
    const navigate = useNavigate();

    const handleRoomClick = (room) => {
        setSelectedRoom(room);
    };

    const updateRoomStatus = (roomNumber, newStatus, roomId) => {
        setNewRooms((prevRooms) =>
            prevRooms.map((room) =>
                room.room_number === roomNumber ? {...room, status: newStatus} : room
            )
        );
        setSelectedRoom(null);
        try {
            axios.post(`${API_BASE_URL}/roomStatusChange/${roomId}`, {
                newStatus: newStatus,
            });
        } catch (error) {
            console.error("Error fetching hotels:", error);
        }
    };

    const handleFloorChange = (newFloor) => {
        const fetchRooms = async () => {
            try {
                const response = await client.put(`${API_BASE_URL}/rooms/`, {
                    type: roomStandard,
                    check_in: checkIn,
                    check_out: checkOut,
                    hotel_id: hotel.hotel_id,
                    floor_num: newFloor
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
        if (floors.length === 0 || changed) {  // Ensuring `floors` is an array before fetching
            client.get(`${API_BASE_URL}/floors/${hotel.hotel_id}`)
                .then(response => {
                    setFloors(response.data);
                    setNewRooms(rms)
                })
                .catch(() => {
                    console.log("Error fetching floors");
                });

        }
    }, [hotel, rooms, floors, newRooms, rms, changed, reservations])


    return (
        <div className="room-reservation-container">

            {/* Floor Selection */}
            <div className="floor-selector">
                <div>
                    {floors.map((f) => (
                        <button id={`floor_btn_${f.floor_number}`}
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
                <div className="rooms-section">

                </div>
            </div>
            <div className="hotel-container">

                <div className="rooms-top">
                    {newRooms ? newRooms.slice(5, 15).map((room) => (
                        <div
                            key={room.room_number}
                            className={`roomStatus 
                            ${room.status === "Wolny" ? 'wolny' : ''}
                            ${room.status === "Zajęty" ? 'zajęty' : ''}
                            ${room.status === "Do sprzątania" ? 'do-sprzątania' : ''}
                            ${room.status === "Do naprawy" ? 'do-naprawy' : ''}
                            ${selectedRoom && selectedRoom.room_number === room.room_number ? 'selected' : ''}
                            ${room.status !== "Wolny" && selectedRoom && selectedRoom.room_number === room.room_number ? 'unavailable-selected' : ''}
                        `}
                            onClick={() => handleRoomClick(room)}
                        >

                            <b>{room.room_number}</b>

                        </div>
                    )) : null}
                </div>


                <div className="center-section">

                    <div className="rooms-left">
                        {newRooms ? newRooms.slice(0, 5).reverse().map((room) => (
                            <div
                                key={room.room_number}
                                className={`roomStatus 
                            ${room.status === "Wolny" ? 'wolny' : ''}
                            ${room.status === "Zajęty" ? 'zajęty' : ''}
                            ${room.status === "Do sprzątania" ? 'do-sprzątania' : ''}
                            ${room.status === "Do naprawy" ? 'do-naprawy' : ''}
                            ${selectedRoom && selectedRoom.room_number === room.room_number ? 'selected' : ''}
                            ${room.status !== "Wolny" && selectedRoom && selectedRoom.room_number === room.room_number ? 'unavailable-selected' : ''}
                            `}
                                onClick={() => handleRoomClick(room)}
                            >
                                <b>{room.room_number}</b>
                            </div>
                        )) : null}
                    </div>


                    <div className="image-container">
                        <svg width="500" height="200" viewBox="0 0 500 200" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <rect width="50" height="200" fill="#605D5D"/>
                            <rect x="450" width="50" height="200" fill="#605D5D"/>
                            <rect x="40" width="500" height="41.945" fill="#605D5D"/>
                            <rect x="195.893" y="41.9451" width="93.1295" height="51.2661" fill="#605D5D"/>
                            <rect x="211.95" y="93.2109" width="61.0159" height="20.9725" fill="#605D5D"/>
                            <ellipse cx="242.993" cy="103.697" rx="21.4091" ry="23.3028" fill="#605D5D"/>
                            <path
                                d="M227.202 137L225.213 129.727H226.108L227.628 135.651H227.699L229.247 129.727H230.241L231.79 135.651H231.861L233.381 129.727H234.276L232.287 137H231.378L229.773 131.205H229.716L228.111 137H227.202ZM237.038 137.114C236.513 137.114 236.059 136.998 235.678 136.766C235.299 136.531 235.007 136.205 234.801 135.786C234.598 135.364 234.496 134.874 234.496 134.315C234.496 133.757 234.598 133.264 234.801 132.838C235.007 132.41 235.294 132.076 235.661 131.837C236.03 131.595 236.461 131.474 236.953 131.474C237.237 131.474 237.518 131.522 237.795 131.616C238.072 131.711 238.324 131.865 238.551 132.078C238.778 132.289 238.96 132.568 239.094 132.916C239.229 133.264 239.297 133.693 239.297 134.202V134.557H235.092V133.832H238.445C238.445 133.525 238.383 133.25 238.26 133.009C238.139 132.767 237.966 132.576 237.741 132.437C237.519 132.297 237.256 132.227 236.953 132.227C236.619 132.227 236.33 132.31 236.087 132.476C235.845 132.639 235.659 132.852 235.529 133.115C235.399 133.378 235.334 133.66 235.334 133.96V134.443C235.334 134.855 235.405 135.204 235.547 135.491C235.691 135.775 235.891 135.991 236.147 136.141C236.403 136.287 236.7 136.361 237.038 136.361C237.259 136.361 237.457 136.33 237.635 136.268C237.815 136.205 237.97 136.11 238.1 135.984C238.23 135.857 238.331 135.698 238.402 135.509L239.212 135.736C239.126 136.01 238.983 136.252 238.782 136.46C238.581 136.666 238.332 136.827 238.036 136.943C237.74 137.057 237.408 137.114 237.038 137.114ZM240.572 131.545H241.41V137.398C241.41 137.734 241.352 138.025 241.236 138.271C241.122 138.518 240.949 138.708 240.717 138.843C240.488 138.978 240.198 139.045 239.847 139.045C239.819 139.045 239.79 139.045 239.762 139.045C239.734 139.045 239.705 139.045 239.677 139.045V138.264C239.705 138.264 239.731 138.264 239.755 138.264C239.779 138.264 239.805 138.264 239.833 138.264C240.089 138.264 240.276 138.188 240.394 138.037C240.513 137.888 240.572 137.675 240.572 137.398V131.545ZM240.984 130.636C240.82 130.636 240.679 130.581 240.561 130.469C240.445 130.358 240.387 130.224 240.387 130.068C240.387 129.912 240.445 129.778 240.561 129.667C240.679 129.556 240.82 129.5 240.984 129.5C241.147 129.5 241.287 129.556 241.403 129.667C241.521 129.778 241.58 129.912 241.58 130.068C241.58 130.224 241.521 130.358 241.403 130.469C241.287 130.581 241.147 130.636 240.984 130.636ZM246.808 132.767L246.056 132.98C246.008 132.855 245.938 132.733 245.846 132.614C245.756 132.494 245.633 132.394 245.477 132.316C245.32 132.238 245.12 132.199 244.877 132.199C244.543 132.199 244.265 132.276 244.042 132.43C243.822 132.581 243.712 132.774 243.712 133.009C243.712 133.217 243.788 133.381 243.939 133.502C244.091 133.623 244.327 133.723 244.649 133.804L245.459 134.003C245.947 134.121 246.31 134.302 246.549 134.546C246.788 134.788 246.908 135.099 246.908 135.48C246.908 135.793 246.818 136.072 246.638 136.318C246.46 136.564 246.212 136.759 245.892 136.901C245.573 137.043 245.201 137.114 244.777 137.114C244.221 137.114 243.76 136.993 243.396 136.751C243.031 136.51 242.8 136.157 242.703 135.693L243.499 135.494C243.575 135.788 243.718 136.008 243.928 136.155C244.142 136.302 244.42 136.375 244.763 136.375C245.154 136.375 245.464 136.292 245.693 136.126C245.925 135.958 246.041 135.757 246.041 135.523C246.041 135.333 245.975 135.175 245.843 135.047C245.71 134.917 245.506 134.82 245.232 134.756L244.323 134.543C243.823 134.424 243.456 134.241 243.222 133.992C242.99 133.741 242.874 133.428 242.874 133.051C242.874 132.743 242.96 132.471 243.133 132.234C243.308 131.998 243.546 131.812 243.847 131.677C244.15 131.542 244.493 131.474 244.877 131.474C245.416 131.474 245.84 131.593 246.148 131.83C246.458 132.066 246.678 132.379 246.808 132.767ZM244.493 130.807L245.36 129.159H246.34L245.232 130.807H244.493ZM250.385 137.114C249.874 137.114 249.434 136.993 249.064 136.751C248.695 136.51 248.411 136.177 248.212 135.754C248.013 135.33 247.914 134.846 247.914 134.301C247.914 133.747 248.016 133.258 248.219 132.835C248.425 132.408 248.712 132.076 249.078 131.837C249.448 131.595 249.879 131.474 250.371 131.474C250.755 131.474 251.1 131.545 251.408 131.688C251.716 131.83 251.968 132.028 252.164 132.284C252.361 132.54 252.483 132.838 252.53 133.179H251.692C251.628 132.93 251.486 132.71 251.266 132.518C251.048 132.324 250.755 132.227 250.385 132.227C250.059 132.227 249.772 132.312 249.526 132.483C249.282 132.651 249.092 132.889 248.954 133.197C248.819 133.502 248.752 133.861 248.752 134.273C248.752 134.694 248.818 135.061 248.951 135.374C249.086 135.686 249.275 135.929 249.519 136.102C249.765 136.274 250.054 136.361 250.385 136.361C250.603 136.361 250.801 136.323 250.978 136.247C251.156 136.171 251.306 136.062 251.429 135.92C251.552 135.778 251.64 135.608 251.692 135.409H252.53C252.483 135.731 252.366 136.021 252.179 136.279C251.994 136.535 251.749 136.738 251.444 136.89C251.141 137.039 250.788 137.114 250.385 137.114ZM253.755 137V131.545H254.593V137H253.755ZM254.181 130.636C254.018 130.636 253.877 130.581 253.759 130.469C253.643 130.358 253.585 130.224 253.585 130.068C253.585 129.912 253.643 129.778 253.759 129.667C253.877 129.556 254.018 129.5 254.181 129.5C254.345 129.5 254.484 129.556 254.6 129.667C254.719 129.778 254.778 129.912 254.778 130.068C254.778 130.224 254.719 130.358 254.6 130.469C254.484 130.581 254.345 130.636 254.181 130.636ZM258.415 137.114C257.89 137.114 257.436 136.998 257.055 136.766C256.676 136.531 256.384 136.205 256.178 135.786C255.974 135.364 255.873 134.874 255.873 134.315C255.873 133.757 255.974 133.264 256.178 132.838C256.384 132.41 256.671 132.076 257.037 131.837C257.407 131.595 257.838 131.474 258.33 131.474C258.614 131.474 258.895 131.522 259.172 131.616C259.449 131.711 259.701 131.865 259.928 132.078C260.155 132.289 260.336 132.568 260.471 132.916C260.606 133.264 260.674 133.693 260.674 134.202V134.557H256.469V133.832H259.822C259.822 133.525 259.76 133.25 259.637 133.009C259.516 132.767 259.343 132.576 259.118 132.437C258.896 132.297 258.633 132.227 258.33 132.227C257.996 132.227 257.707 132.31 257.464 132.476C257.222 132.639 257.036 132.852 256.906 133.115C256.776 133.378 256.711 133.66 256.711 133.96V134.443C256.711 134.855 256.782 135.204 256.924 135.491C257.068 135.775 257.268 135.991 257.524 136.141C257.78 136.287 258.077 136.361 258.415 136.361C258.635 136.361 258.834 136.33 259.012 136.268C259.192 136.205 259.347 136.11 259.477 135.984C259.607 135.857 259.708 135.698 259.779 135.509L260.589 135.736C260.503 136.01 260.36 136.252 260.159 136.46C259.958 136.666 259.709 136.827 259.413 136.943C259.117 137.057 258.785 137.114 258.415 137.114Z"
                                fill="black"/>
                            <path
                                d="M236.881 74V66.7273H237.761V69.9659H241.639V66.7273H242.52V74H241.639V70.7472H237.761V74H236.881ZM246.385 74.1136C245.893 74.1136 245.461 73.9964 245.089 73.7621C244.72 73.5277 244.431 73.1998 244.223 72.7784C244.017 72.357 243.914 71.8646 243.914 71.3011C243.914 70.733 244.017 70.237 244.223 69.8132C244.431 69.3894 244.72 69.0604 245.089 68.826C245.461 68.5916 245.893 68.4744 246.385 68.4744C246.878 68.4744 247.309 68.5916 247.678 68.826C248.05 69.0604 248.338 69.3894 248.544 69.8132C248.753 70.237 248.857 70.733 248.857 71.3011C248.857 71.8646 248.753 72.357 248.544 72.7784C248.338 73.1998 248.05 73.5277 247.678 73.7621C247.309 73.9964 246.878 74.1136 246.385 74.1136ZM246.385 73.3608C246.759 73.3608 247.067 73.2649 247.309 73.0732C247.55 72.8814 247.729 72.6293 247.845 72.3168C247.961 72.0043 248.019 71.6657 248.019 71.3011C248.019 70.9366 247.961 70.5968 247.845 70.282C247.729 69.9671 247.55 69.7126 247.309 69.5185C247.067 69.3243 246.759 69.2273 246.385 69.2273C246.011 69.2273 245.703 69.3243 245.462 69.5185C245.221 69.7126 245.042 69.9671 244.926 70.282C244.81 70.5968 244.752 70.9366 244.752 71.3011C244.752 71.6657 244.81 72.0043 244.926 72.3168C245.042 72.6293 245.221 72.8814 245.462 73.0732C245.703 73.2649 246.011 73.3608 246.385 73.3608ZM250.974 66.7273V74H250.136V66.7273H250.974Z"
                                fill="black"/>
                            <line x1="339.5" y1="42" x2="339.5" y2="24" stroke="#989898"/>
                            <line x1="342.5" y1="42" x2="342.5" y2="24" stroke="#989898"/>
                            <line x1="345.5" y1="42" x2="345.5" y2="24" stroke="#989898"/>
                            <line x1="348.5" y1="42" x2="348.5" y2="24" stroke="#989898"/>
                            <line x1="351.5" y1="42" x2="351.5" y2="24" stroke="#989898"/>
                            <line x1="354.5" y1="42" x2="354.5" y2="24" stroke="#989898"/>
                            <line x1="357.5" y1="42" x2="357.5" y2="24" stroke="#989898"/>
                            <line x1="360.5" y1="42" x2="360.5" y2="24" stroke="#989898"/>
                            <line x1="336.5" y1="42" x2="336.5" y2="24" stroke="#989898"/>
                            <line x1="333.5" y1="42" x2="333.5" y2="24" stroke="#989898"/>
                            <line x1="330.5" y1="42" x2="330.5" y2="24" stroke="#989898"/>
                            <line x1="327.5" y1="42" x2="327.5" y2="24" stroke="#989898"/>
                            <line x1="324.5" y1="42" x2="324.5" y2="24" stroke="#989898"/>
                            <line x1="321.5" y1="42" x2="321.5" y2="24" stroke="#989898"/>
                            <line x1="318.5" y1="42" x2="318.5" y2="24" stroke="#989898"/>
                            <line x1="291.5" y1="42" x2="291.5" y2="24" stroke="#989898"/>
                            <line x1="294.5" y1="42" x2="294.5" y2="24" stroke="#989898"/>
                            <line x1="297.5" y1="42" x2="297.5" y2="24" stroke="#989898"/>
                            <line x1="300.5" y1="42" x2="300.5" y2="24" stroke="#989898"/>
                            <line x1="303.5" y1="42" x2="303.5" y2="24" stroke="#989898"/>
                            <line x1="306.5" y1="42" x2="306.5" y2="24" stroke="#989898"/>
                            <line x1="309.5" y1="42" x2="309.5" y2="24" stroke="#989898"/>
                            <line x1="312.5" y1="42" x2="312.5" y2="24" stroke="#989898"/>
                            <line x1="315.5" y1="42" x2="315.5" y2="24" stroke="#989898"/>
                            <line x1="374.5" y1="42" x2="374.5" y2="24" stroke="#989898"/>
                            <line x1="363.5" y1="42" x2="363.5" y2="24" stroke="#989898"/>
                            <line x1="291" y1="41.5" x2="375" y2="41.5" stroke="#989898"/>
                            <line x1="291" y1="23.5" x2="375" y2="23.5" stroke="#989898"/>
                            <line x1="145.5" y1="23" x2="145.5" y2="41" stroke="#989898"/>
                            <line x1="142.5" y1="23" x2="142.5" y2="41" stroke="#989898"/>
                            <line x1="139.5" y1="23" x2="139.5" y2="41" stroke="#989898"/>
                            <line x1="136.5" y1="23" x2="136.5" y2="41" stroke="#989898"/>
                            <line x1="133.5" y1="23" x2="133.5" y2="41" stroke="#989898"/>
                            <line x1="130.5" y1="23" x2="130.5" y2="41" stroke="#989898"/>
                            <line x1="127.5" y1="23" x2="127.5" y2="41" stroke="#989898"/>
                            <line x1="124.5" y1="23" x2="124.5" y2="41" stroke="#989898"/>
                            <line x1="148.5" y1="23" x2="148.5" y2="41" stroke="#989898"/>
                            <line x1="151.5" y1="23" x2="151.5" y2="41" stroke="#989898"/>
                            <line x1="154.5" y1="23" x2="154.5" y2="41" stroke="#989898"/>
                            <line x1="157.5" y1="23" x2="157.5" y2="41" stroke="#989898"/>
                            <line x1="160.5" y1="23" x2="160.5" y2="41" stroke="#989898"/>
                            <line x1="163.5" y1="23" x2="163.5" y2="41" stroke="#989898"/>
                            <line x1="166.5" y1="23" x2="166.5" y2="41" stroke="#989898"/>
                            <line x1="193.5" y1="23" x2="193.5" y2="41" stroke="#989898"/>
                            <line x1="190.5" y1="23" x2="190.5" y2="41" stroke="#989898"/>
                            <line x1="187.5" y1="23" x2="187.5" y2="41" stroke="#989898"/>
                            <line x1="184.5" y1="23" x2="184.5" y2="41" stroke="#989898"/>
                            <line x1="181.5" y1="23" x2="181.5" y2="41" stroke="#989898"/>
                            <line x1="178.5" y1="23" x2="178.5" y2="41" stroke="#989898"/>
                            <line x1="175.5" y1="23" x2="175.5" y2="41" stroke="#989898"/>
                            <line x1="172.5" y1="23" x2="172.5" y2="41" stroke="#989898"/>
                            <line x1="169.5" y1="23" x2="169.5" y2="41" stroke="#989898"/>
                            <line x1="110.5" y1="23" x2="110.5" y2="41" stroke="#989898"/>
                            <line x1="121.5" y1="23" x2="121.5" y2="41" stroke="#989898"/>
                            <line x1="194" y1="23.5" x2="110" y2="23.5" stroke="#989898"/>
                            <line x1="194" y1="41.5" x2="110" y2="41.5" stroke="#989898"/>
                        </svg>

                    </div>


                    <div className="rooms-right">
                        {newRooms ? newRooms.slice(15,).map((room) => (
                            <div
                                key={room.room_number}
                                className={`roomStatus 
                            ${room.status === "Wolny" ? 'wolny' : ''}
                            ${room.status === "Zajęty" ? 'zajęty' : ''}
                            ${room.status === "Do sprzątania" ? 'do-sprzątania' : ''}
                            ${room.status === "Do naprawy" ? 'do-naprawy' : ''}
                            ${selectedRoom && selectedRoom.room_number === room.room_number ? 'selected' : ''}
                            ${room.status !== "Wolny" && selectedRoom && selectedRoom.room_number === room.room_number ? 'unavailable-selected' : ''}
                        `}
                                onClick={() => handleRoomClick(room)}
                            >
                                <b>{room.room_number}</b>
                            </div>
                        )) : null}
                    </div>
                </div>
            </div>

            {selectedRoom && (
                <div className="room-details" style={{color: "black"}}>
                    <h2>Pokój {selectedRoom.room_number}, piętro {floor} - szczegóły</h2>
                    <div style={{marginTop: 20}}>
                        <p><b>Status:</b>
                            <Badge
                                bg={
                                    selectedRoom.status === 'Wolny'
                                        ? 'secondary'
                                        : selectedRoom.status === 'Zajęty'
                                            ? 'success'
                                            : selectedRoom.status === 'Do naprawy'
                                                ? 'danger'
                                                : selectedRoom.status === 'Do sprzątania'
                                                    ? 'dosprzatania'
                                                    : 'secondary'
                                }
                                className="fs-6"
                            >
                                {selectedRoom.status}
                            </Badge>
                        </p>
                        <p><b>Typ:</b> {selectedRoom.type}</p>
                        <p><b>Cena:</b> {selectedRoom.price?.toFixed(2)} zł</p>
                        <p><b>Liczba miejsc:</b> {selectedRoom.people_capacity}</p>
                        <p><b>Powiązane rezerwacje:</b></p>
                        <ul>
                            {reservations
                                .filter(reservation =>
                                    reservation.room_id === selectedRoom.room_id &&
                                    reservation.status !== "Zakończona" &&
                                    reservation.status !== "Anulowana"
                                ).length > 0 ? (
                                reservations
                                    .filter(reservation =>
                                        reservation.room_id === selectedRoom.room_id &&
                                        reservation.status !== "Zakończona" &&
                                        reservation.status !== "Anulowana"
                                    )
                                    .map((filteredReservation, index) => (
                                        <li key={index} style={{padding: 10, border: "2px solid gray",borderRadius: 10, cursor: "pointer",
                                        marginBottom: 5}} onClick={() => {
                                            navigate(`/receptionist/manage/reservation/${filteredReservation.reservation_id}/`);
                                        }}>
                                            <b>ID Rezerwacji:</b> {filteredReservation.reservation_id},
                                            <span></span>
                                            Od <b>{filteredReservation.check_in}</b> do <b>{filteredReservation.check_out}</b>,
                                            <br></br>
                                            <b> Status:</b> {filteredReservation.status},
                                            <b> Klient:</b> {filteredReservation.guest}
                                        </li>
                                    ))
                            ) : (
                                <li>---</li>
                            )
                            }

                        </ul>
                    </div>

                    <div style={{textAlign: "center", margin: 20}}>
                        <button onClick={function () {
                            setFlag(true)
                        }}>Zmień status
                        </button>
                    </div>

                    {selectedRoom && flag && (
                        <RoomModal
                            room={selectedRoom}
                            closeModal={() => {
                                setFlag(false);
                            }}
                            updateRoomStatus={updateRoomStatus}
                        />
                    )}

                </div>
            )}
        </div>
    );
};

export default RoomsVisual;
