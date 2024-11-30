import React, {useState, useEffect} from 'react';
import './ReceptionistPanel.css';
import RoomsVisual from "../RoomsVisual/RoomsVisual";
import client from "../client";
import axios from "axios";


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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await client.get("http://127.0.0.1:8000/api/hotels/");
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
                const response = await axios.get(`http://127.0.0.1:8000/api/rooms/${1}`);
                setRooms(response.data);
                console.log(rooms)
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };

        if (!rooms.length) fetchRooms();

        if (!hotel) {
            setHotel(hotels?.find(h => h.hotel_id === parseInt(1)))
            setHotelId(1)
            console.log(hotel)
        }

        if (!reservations.length) {
            fetchReservations(currentPage);
        }

    }, [checkInDate, checkOutDate, currentPage, hotel, hotelId, hotels, reservations.length, roomStandard, rooms, rooms.length]);

    const fetchReservations = async (page = 1) => {
        setLoading(true);
        try {
            const response = await client.get(`http://127.0.0.1:8000/api/personelReservations/`, {
                params: {page},
            });
            setReservations(response.data.results);
            setTotalPages(Math.ceil(response.data.count / 5));
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setLoading(false);
        }
    };


    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);

        }
    };


    return (
        <div className="">
            <h1 style={{margin: 20}}>Panel recepcjonisty</h1>

            <section>
                <h3>Dzisiejsze rezerwacje</h3>
                <div>
                    <div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div>
                            <ul className="reservations-list">
                              {reservations.map((reservation) => (
                                <li class={"amo"} key={reservation.reservation_id}>
                                  <span>Rezerwacja ID: {reservation.reservation_id}</span>
                                  <span>Check-in: {reservation.check_in}</span>
                                </li>
                              ))}
                            </ul>

                            <div className="pagination">
                              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                Poprzednia
                              </button>
                              <span>{currentPage} z {totalPages}</span>
                              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                Następna
                              </button>
                            </div>
                            </div>

                        )}
                    </div>
                </div>

                <div style={{textAlign: "right"}}>
                    <a href="/userReservations/">Zobacz więcej...</a>
                </div>
            </section>

            <section>
                <h3>Aktualny status pokoi</h3>
                {hotel && hotelId ?
                    <RoomsVisual rms={rooms} hotel={hotel} checkIn={checkInDate} checkOut={checkOutDate}
                                 roomStandard={roomStandard}/>
                    : null}
                <div style={{textAlign: "right"}}>
                    <a href="#">Zobacz więcej...</a>
                </div>
            </section>

        </div>
    );
};

export default ReceptionistPanel;
