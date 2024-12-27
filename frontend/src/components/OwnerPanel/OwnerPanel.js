import React, {useEffect, useState} from 'react';
import "./HotelOwnerPanel.css"
import 'chart.js/auto';
import {Line} from 'react-chartjs-2';

import axios from "axios";
import {Form} from "react-bootstrap";
import RoomsVisual from "../RoomsVisual/RoomsVisual";
import client from "../client";

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
    const [roomPrices, setRoomPrices] = useState({});
    const [roomPricesFlag, setRoomPricesFlag] = useState(false);
    const [error, setError] = useState('');


    const fetchHotels = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/hotels/");
            setHotels(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Error fetching hotels:", error);
        }
    };

    const fetchPrices = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/prices/${hotelId}`);
            setRoomPrices(response.data);
        } catch (error) {
            console.error("Error fetching hotels:", error);
        }
    };

    const fetchRooms = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/rooms/${hotelId}`,
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
            const response = await axios.get(`http://127.0.0.1:8000/api/chart_data/${hotelId}`);
            const monthlyPrices = response.data.monthly_prices;

            // Convert data into labels and dataset for the chart
            const labels = Object.keys(monthlyPrices).map(date => {
                const [year, month] = date.split('-');
                return new Date(year, month - 1).toLocaleString('default', {month: 'long'});
            });

            const data = Object.values(monthlyPrices);

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
                        data: [1000, 1500, 2000, 6000],
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

        if (!rooms.length) fetchRooms();

    }, [chartData, checkInDate, checkOutDate, fetchChartData, fetchPrices, fetchRooms, hotel, hotelId, hotels, roomPricesFlag, roomStandard, rooms.length]);


    const handleSave = async () => {
        try {
            const csrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken'))
                ?.split('=')[1];

            await client.put(`http://127.0.0.1:8000/api/prices/${hotelId}/`,
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
        setHotel(hotels.find(h => h.hotel_id === parseInt(selectedHotelId)));
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/prices/${selectedHotelId}`);
            console.log(response)
            setRoomPrices(response.data);
        } catch (error) {
            console.error("Error fetching hotels:", error);
        }
                try {
            const response = await axios.get(`http://127.0.0.1:8000/api/chart_data/${selectedHotelId}`);
            const monthlyPrices = response.data.monthly_prices;

            // Convert data into labels and dataset for the chart
            const labels = Object.keys(monthlyPrices).map(date => {
                const [year, month] = date.split('-');
                return new Date(year, month - 1).toLocaleString('default', {month: 'long'});
            });

            const data = Object.values(monthlyPrices);

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
                        data: [1000, 1500, 2000, 6000],
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
        document.getElementById('floor_btn_1').click()
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

            {/* Sekcja śledzenia statusów pokojów */}
            <section className="room-status-section">
                <h2>Statusy pokojów</h2>
                {hotel && hotelId ?
                    <RoomsVisual rms={rooms} hotel={hotel} checkIn={checkInDate} checkOut={checkOutDate}
                                 roomStandard={roomStandard}/>
                    : null}

            </section>

            {/* Sekcja analizy zysków i strat */}
            <section className="profit-analysis-section">
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
            </section>

        </div>
    );
};

export default OwnerPanel;