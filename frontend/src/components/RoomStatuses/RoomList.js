import React, { useState } from "react";
import "./RoomStatuses.css";

const RoomList = ({ rooms, setSelectedRoom }) => {
    const [filters, setFilters] = useState({
        floor: "",
        status: "",
        roomNumber: "",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Liczba pokoi na stronę

    const filteredRooms = rooms.filter((room) => {
        const matchesFloor = filters.floor
            ? room.floor === parseInt(filters.floor)
            : true;
        const matchesStatus = filters.status
            ? room.status === filters.status
            : true;
        const matchesRoomNumber = filters.roomNumber
            ? room.room_number.toString().includes(filters.roomNumber)
            : true;
        return matchesFloor && matchesStatus && matchesRoomNumber;
    });

    // Obliczanie paginacji
    const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div>
            <div className="filter-form">
                <label className="filter-label">
                    Piętro:
                    <select
                        className="filter-select"
                        value={filters.floor}
                        onChange={(e) => setFilters({ ...filters, floor: e.target.value })}
                    >
                        <option value="">Wszystkie</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>
                </label>
                <label className="filter-label">
                    Status:
                    <select
                        className="filter-select"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">Wszystkie</option>
                        <option value="Zajęty">Zajęty</option>
                        <option value="Wolny">Wolny</option>
                        <option value="Do sprzątania">Do sprzątania</option>
                        <option value="Do naprawy">Do naprawy</option>
                    </select>
                </label>
                <label className="filter-label">
                    Numer pokoju:
                    <input
                        className="filter-input"
                        type="text"
                        value={filters.roomNumber}
                        placeholder="Wprowadź numer"
                        onChange={(e) =>
                            setFilters({ ...filters, roomNumber: e.target.value })
                        }
                    />
                </label>
            </div>

            <div className="room-grid">
                {currentRooms.map((room) => (
                    <button
                        key={room.room_number}
                        className={`status-btn ${room.status.toLowerCase().replace(" ", "-")}`}
                        onClick={() => setSelectedRoom(room)}
                    >
                        <h1 style={{ color: "white" }}>{room.room_number}</h1>
                        {room.status === "Zajęty"?
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                                 className="bi bi-person" viewBox="0 0 16 16">
                                <path
                                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                            </svg>
                            : room.status === "Do sprzątania"?
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                                 className="bi bi-stars" viewBox="0 0 16 16">
                                <path
                                    d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
                            </svg>
                            :room.status === "Do naprawy"?
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                                 className="bi bi-tools" viewBox="0 0 16 16">
                                <path
                                    d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3q0-.405-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708M3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026z"/>
                            </svg>
                            :room.status === "Wolny"?
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                 fill="currentColor" className="bi bi-tencent-qq" viewBox="0 0 16 16">
                                <path
                                    d="M6.048 3.323c.022.277-.13.523-.338.55-.21.026-.397-.176-.419-.453s.13-.523.338-.55c.21-.026.397.176.42.453Zm2.265-.24c-.603-.146-.894.256-.936.333-.027.048-.008.117.037.15.045.035.092.025.119-.003.361-.39.751-.172.829-.129l.011.007c.053.024.147.028.193-.098.023-.063.017-.11-.006-.142-.016-.023-.089-.08-.247-.118"/>
                                <path
                                    d="M11.727 6.719c0-.022.01-.375.01-.557 0-3.07-1.45-6.156-5.015-6.156S1.708 3.092 1.708 6.162c0 .182.01.535.01.557l-.72 1.795a26 26 0 0 0-.534 1.508c-.68 2.187-.46 3.093-.292 3.113.36.044 1.401-1.647 1.401-1.647 0 .979.504 2.256 1.594 3.179-.408.126-.907.319-1.228.556-.29.213-.253.43-.201.518.228.386 3.92.246 4.985.126 1.065.12 4.756.26 4.984-.126.052-.088.088-.305-.2-.518-.322-.237-.822-.43-1.23-.557 1.09-.922 1.594-2.2 1.594-3.178 0 0 1.041 1.69 1.401 1.647.168-.02.388-.926-.292-3.113a26 26 0 0 0-.534-1.508l-.72-1.795ZM9.773 5.53a.1.1 0 0 1-.009.096c-.109.159-1.554.943-3.033.943h-.017c-1.48 0-2.925-.784-3.034-.943a.1.1 0 0 1-.018-.055q0-.022.01-.04c.13-.287 1.43-.606 3.042-.606h.017c1.611 0 2.912.319 3.042.605m-4.32-.989c-.483.022-.896-.529-.922-1.229s.344-1.286.828-1.308c.483-.022.896.529.922 1.23.027.7-.344 1.286-.827 1.307Zm2.538 0c-.484-.022-.854-.607-.828-1.308.027-.7.44-1.25.923-1.23.483.023.853.608.827 1.309-.026.7-.439 1.251-.922 1.23ZM2.928 8.99q.32.063.639.117v2.336s1.104.222 2.21.068V9.363q.49.027.937.023h.017c1.117.013 2.474-.136 3.786-.396.097.622.151 1.386.097 2.284-.146 2.45-1.6 3.99-3.846 4.012h-.091c-2.245-.023-3.7-1.562-3.846-4.011-.054-.9 0-1.663.097-2.285"/>
                            </svg>                            :null}
                        <h6>{room.status}</h6>
                    </button>
                ))}
            </div>

            {/* Paginacja */}
            <div className="pagination">
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Poprzednia
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        className={`pagination-button ${currentPage === i + 1 ? "active" : ""}`}
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Następna
                </button>
            </div>
        </div>
    );
};

export default RoomList;
