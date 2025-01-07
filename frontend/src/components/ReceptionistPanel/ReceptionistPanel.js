import React, {useState, useEffect} from 'react';
import './ReceptionistPanel.css';
import RoomsVisual from "../RoomsVisual/RoomsVisual";
import client from "../client";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {API_BASE_URL} from "../../config";


const ReceptionistPanel = () => {
    // Stan dla aktualnej lokalizacji hotelu
    const [checkInDate, setCheckInDate] = useState(new Date().toISOString().slice(0, 10));
    const [checkOutDate, setCheckOutDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10));
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [hotels, setHotels] = useState([])
    const [hotelId, setHotelId] = useState(null);
    const [roomStandard, setRoomStandard] = useState('standard');

    const [reservations, setReservations] = useState([]);
    const [allReservations, setAllReservations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchHotels = async () => {
        try {
            const response = await client.get(`${API_BASE_URL}/hotels/`);
            setHotels(response.data);
        } catch (error) {
            console.error("Error fetching hotels:", error);
        }
    };

    if (!hotels.length) {
        fetchHotels()
    }


    const fetchRooms = async () => {
        try {
            const response = await client.get(`${API_BASE_URL}/rooms/${hotelId}`,
                {
                    params: {
                        check_in: checkInDate,
                        check_out: checkOutDate,
                        floor: 1,
                    }
                });
            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching hotels:", error);
        }
    };

    const fetchReservations = async (page) => {
        setLoading(true);
        try {
            const response = await client.get(`${API_BASE_URL}/recepcionistReservations/${hotelId}/`, {
                params: {page},
            });
            setReservations(response.data.slice(0,10));
            setAllReservations(response.data);
            setTotalPages(Math.ceil(response.data.slice(0,10).length / 5));
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        if (!rooms.length) {
            fetchRooms()
            document.getElementById('floor_btn_1')?.click()
        }

        if (!hotel) {
            setHotel(hotels?.find(h => h.hotel_id === parseInt(1)))
            setHotelId(1)
        }

        if (!reservations?.length) {
            fetchReservations(currentPage);
        }

    }, [checkInDate, checkOutDate, currentPage, fetchReservations, fetchRooms, hotel, hotelId, hotels, reservations?.length, roomStandard, rooms, rooms.length]);


    const generatePageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        const halfRange = Math.floor(maxPagesToShow / 2);

        let startPage = Math.max(1, currentPage - halfRange);
        let endPage = Math.min(totalPages, currentPage + halfRange);

        if (currentPage <= halfRange) {
            endPage = Math.min(maxPagesToShow, totalPages);
        } else if (currentPage + halfRange >= totalPages) {
            startPage = Math.max(1, totalPages - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };


    return (
        <div className="">
            <h1 style={{margin: 20}}>Panel recepcjonisty</h1>

            <section>
                <h3>Ostatnie rezerwacje</h3>
                <div>
                    <div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div>
                                <ul className="reservations-list">
                                    {reservations?.slice((currentPage - 1) * 5, currentPage * 5).map((reservation) => (
                                        <li class={"amo"} style={{cursor: "pointer"}} onClick={function () {
                                            navigate(`/receptionist/manage/reservation/${reservation.reservation_id}/`)
                                        }} key={reservation.reservation_id}>
                                            <span>ID: {reservation.reservation_id}</span>
                                            <span>Pokój: {reservation.room_number}</span>
                                            <div>
                                                <span>Od: <b>{reservation.check_in}</b></span>
                                                <span>Do: <b>{reservation.check_out}</b></span>
                                            </div>

                                        </li>
                                    ))}
                                </ul>

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom: '20px'
                                    }}>
                                    <button
                                        onClick={() => setCurrentPage((prev) => 1)}
                                        disabled={currentPage === 1}
                                        style={{
                                            padding: "8px 12px",
                                            margin: "0 5px",
                                            background: currentPage === 1 ? "#fff" : "#333",
                                            color: currentPage === 1 ? "#333" : "#fff",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {`<<`}
                                    </button>

                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        style={{
                                            padding: "8px 12px",
                                            margin: "0 5px",
                                            background: currentPage === 1 ? "#fff" : "#333",
                                            color: currentPage === 1 ? "#333" : "#fff",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {'<'}
                                    </button>
                                    {generatePageNumbers().map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            style={{
                                                padding: '5px 10px',
                                                margin: '0 5px',
                                                cursor: 'pointer',
                                                backgroundColor: page === currentPage ? 'gray' : 'white',
                                                color: page === currentPage ? 'black' : 'black',
                                            }}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        style={{
                                            padding: "8px 12px",
                                            margin: "0 5px",
                                            background: currentPage === totalPages ? "#fff" : "#333",
                                            color: currentPage === totalPages ? "#333" : "#fff",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        >
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage((prev) => totalPages)}
                                        disabled={currentPage === totalPages}
                                        style={{
                                            padding: "8px 12px",
                                            margin: "0 5px",
                                            background: currentPage === totalPages ? "#fff" : "#333",
                                            color: currentPage === totalPages ? "#333" : "#fff",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        >>
                                    </button>
                                </div>
                            </div>

                        )}
                    </div>
                </div>

                <div style={{textAlign: "right"}}>
                    <a href={`/receptionistReservations/${hotelId}/`}>Zobacz więcej...</a>
                </div>
            </section>

            <section>
                <h3>Aktualny status pokoi</h3>
                {hotel && hotelId && allReservations ?
                    <RoomsVisual rms={rooms} hotel={hotel} checkIn={checkInDate} checkOut={checkOutDate}
                                 roomStandard={roomStandard} reservations={allReservations}/>
                    : null}
                <div style={{textAlign: "right"}}>
                    <a href={`/room/statuses/${hotelId}`}>Zobacz więcej...</a>
                </div>
            </section>

        </div>
    );
};

export default ReceptionistPanel;
