import React, {useEffect, useState} from 'react';
import "./HotelOwnerPanel.css"
import 'chart.js/auto';
import {Line} from 'react-chartjs-2';

import axios from "axios";
import {Form} from "react-bootstrap";
import RoomsVisual from "../RoomsVisual/RoomsVisual";
import client from "../client";
import {useNavigate} from "react-router-dom";
import {API_BASE_URL} from "../../config";

const OwnerPanel = () => {
    // Stan dla aktualnej lokalizacji hotelu
    const [checkInDate, setCheckInDate] = useState(new Date().toISOString().slice(0, 10));
    const [checkOutDate, setCheckOutDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10));
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [hotels, setHotels] = useState([])
    const [hotelId, setHotelId] = useState(1);
    const [chartData, setChartData] = useState(null);
    const [roomStandard, setRoomStandard] = useState('standard');

    const [isEditing, setIsEditing] = useState(false);
    const [changed, setChanged] = useState(false);
    const [roomPrices, setRoomPrices] = useState({});
    const [roomPricesFlag, setRoomPricesFlag] = useState(false);
    const [error, setError] = useState('');

    const [reservations, setReservations] = useState([]);
    const [allReservations, setAllReservations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [flag, setFlag] = useState(false);
    const navigate = useNavigate();

    const fetchHotels = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/hotels/`);
            setHotels(response.data);
        } catch (error) {
            console.error("Error fetching hotels:", error);
        }
    };

    const fetchPrices = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/prices/${hotelId}`);
            setRoomPrices(response.data);
        } catch (error) {
            console.error("Error fetching hotels:", error);
        }
    };

    const fetchRooms = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/rooms/${hotelId}`,
                {
                    params: {
                        check_in: checkInDate,
                        check_out: checkOutDate,
                        floor: 1
                    }
                });
            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching hotels:", error);
        }
    };
    const fetchChartData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/chart_data/${hotelId}`);
            const monthlyPrices = response.data.monthly_earnings;
            const monthlyCosts = response.data.monthly_costs;
            // Convert data into labels and dataset for the chart
            const labels = Object.keys(monthlyPrices).map(date => {
                const [year, month] = date.split('-');
                return new Date(year, month - 1).toLocaleString('default', {month: 'long'});
            });

            const data = Object.values(monthlyPrices);
            const dataCosts = Object.values(monthlyCosts);
            // Set data for the chart
            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Przychód',
                        data,
                        borderColor: 'green',
                        borderWidth: 2,
                        fill: false,
                    },
                    {
                        label: 'Koszty',
                        data: dataCosts,
                        borderColor: 'red',
                        borderWidth: 2,
                        fill: false,
                    },

                ],
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchReservations = async (page) => {
        setFlag(true)
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

    useEffect(() => {


        if (!roomPricesFlag) {
            fetchPrices().then(r => setRoomPricesFlag(true))

        }

        if (!hotels?.length) {
            fetchHotels()
        }

        if (!hotel) {
            setHotel(hotels?.find(h => h.hotel_id === parseInt(1)))
            setHotelId(1)
        }

        if (chartData === null) {
            fetchChartData()
        }

        if (!reservations?.length && !flag) {
            fetchReservations(currentPage);
        }

        if (!rooms.length) fetchRooms();
        document.getElementById('floor_btn_1')?.click()

    }, [chartData, checkInDate, checkOutDate, currentPage, fetchChartData, fetchPrices, fetchReservations, fetchRooms, flag, hotel, hotelId, hotels, reservations?.length, roomPricesFlag, roomStandard, rooms.length]);


    const handleSave = async () => {
        try {
            const csrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken'))
                ?.split('=')[1];

            await client.put(`${API_BASE_URL}/prices/${hotelId}/`,
                {
                    prices: roomPrices
                },
                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json',
                    }
                });
            setIsEditing(false);
        } catch (error) {
            setError('Błąd podczas zapisywania rezerwacji');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // setUpdatedReservation(reservation); // Reset to original reservation
    };

    // Funkcja do zmiany cen pokojów
    const handlePriceChange = (standard, newPrice) => {
        setRoomPrices((prevPrices) => ({...prevPrices, [standard]: newPrice}));
    };

    const handleHotelChange = async (e) => {
        const selectedHotelId = e.target.value;
        setHotelId(selectedHotelId);
        setChanged(true)
        setHotel(hotels.find(h => h.hotel_id === parseInt(selectedHotelId)));

        try {
            const response = await client.get(`${API_BASE_URL}/recepcionistReservations/${selectedHotelId}/`);
            setReservations(response.data.slice(0,10));
            setAllReservations(response.data);
            setTotalPages(Math.ceil(response.data.slice(0,10).length / 5));
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/rooms/${selectedHotelId}`,
                {
                    params: {
                        check_in: checkInDate,
                        check_out: checkOutDate,
                        floor: 1
                    }
                });
            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching hotels:", error);
        }
        document.getElementById('floor_btn_1').click()
        try {
            const response = await axios.get(`${API_BASE_URL}/prices/${selectedHotelId}`);
            console.log(response)
            setRoomPrices(response.data);
        } catch (error) {
            console.error("Error fetching hotels:", error);
        }
                try {
            const response = await axios.get(`${API_BASE_URL}/chart_data/${selectedHotelId}`);
            const monthlyPrices = response.data.monthly_earnings;
            const monthlyCosts = response.data.monthly_costs;
            console.log(response.data)
            // Convert data into labels and dataset for the chart
            const labels = Object.keys(monthlyPrices).map(date => {
                const [year, month] = date.split('-');
                return new Date(year, month - 1).toLocaleString('default', {month: 'long'});
            });

            const data = Object.values(monthlyPrices);
            const dataCosts = Object.values(monthlyCosts);
            // Set data for the chart
            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Przychód',
                        data,
                        borderColor: 'green',
                        borderWidth: 2,
                        fill: false,
                    },
                    {
                        label: 'Koszty',
                        data: dataCosts,
                        borderColor: 'red',
                        borderWidth: 2,
                        fill: false,
                    },

                ],
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }

        setHotel(hotels?.find(h => h.hotel_id === parseInt(selectedHotelId)))
        setChanged(false)

    };

    return (
        <div className="hotel-owner-dashboard">
            <h1>Panel właściciela</h1>

            {/* Sekcja zmiany lokalizacji hotelu */}
            <section className="location-switch-section">
                <h2>Lokacja hotelu</h2>
                <Form.Control
                    as="select"
                    value={hotelId} // Ensure default selection is set
                    onChange={handleHotelChange}
                >
                    {hotels?.map((h) => (
                        <option key={h.hotel_id} value={h.hotel_id}>
                            Hotel Weles - {h.localization} - {h.hotel_id}
                        </option>
                    ))}
                </Form.Control>
            </section>

            {/* Sekcja zarządzania cenami pokojów */}
            <section className="room-prices-section">
                <h2>Zarządzaj cenami pokojów</h2>
                <h5 style={{marginBottom: 40}}>W tym miejscu możesz ustawić ogólne ceny pokoju w zależności od
                    standardu. Cena jest
                    wskazana dla <b>jednej osoby</b> i podana w złotówkach.</h5>
                {roomPrices ? Object.keys(roomPrices).map((standard) => (
                    <div key={standard} className="room-price-setting">
                        <h5><b>Pokój typu "{standard.charAt(0) + standard.slice(1)}"</b></h5>
                        <div className="form-group">
                            <input
                                type="number"
                                name={`price ${standard}`}
                                value={roomPrices[standard].toFixed(2)}
                                onChange={(e) => handlePriceChange(standard, parseInt(e.target.value))}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                )) : null}

                <div className="form-actions">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave}>Zapisz</button>
                            <button onClick={handleCancel}>Anuluj</button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)}>Edytuj</button>
                    )}
                </div>

                <div style={{textAlign: "right", paddingRight: 20, paddingTop: 20}}>
                    <a href={`/rooms/prices/?hotelId=${hotelId}`}>Zobacz więcej...</a>
                </div>

            </section>

            <section>
                <h2>Ostatnie rezerwacje</h2>
                <div>
                    <div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : ( reservations.length?
                            (<div>
                                <ul className="reservations-list">
                                    {reservations?.slice((currentPage - 1) * 5, currentPage * 5).map((reservation) => (
                                        <li className={"amo"} style={{cursor: "pointer"}} onClick={function () {
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
                            </div>)

                        : <p>Brak wyników.</p>)}
                    </div>
                </div>

                <div style={{textAlign: "right"}}>
                    <a href={`/receptionistReservations/${hotelId}/`}>Zobacz więcej...</a>
                </div>
            </section>

            {/* Sekcja śledzenia statusów pokojów */}
            <section className="room-status-section">
                <h2>Statusy pokojów</h2>
                {hotel && hotelId ?
                    <RoomsVisual rms={rooms} hotel={hotel} checkIn={checkInDate} checkOut={checkOutDate}
                                 roomStandard={roomStandard} changed={changed} reservations={allReservations}/>
                    : null}
                <div style={{textAlign: "right"}}>
                    <a href={`/room/statuses/${hotelId}`}>Zobacz więcej...</a>
                </div>

            </section>

            {/* Sekcja analizy zysków i strat */}
            <section className="profit-analysis-section">
                <h2>Analiza przychodów i wydatków</h2>
                {chartData ? (
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top',
                                },
                            },
                        }}
                    />
                ) : (
                    <p>Loading...</p>
                )}

                <div style={{textAlign: "right", paddingRight: 20, paddingTop: 20}}>
                    <a href={`/hotelCosts/${hotelId}`}>Zobacz więcej...</a>
                </div>
            </section>

        </div>
    );
};

export default OwnerPanel;