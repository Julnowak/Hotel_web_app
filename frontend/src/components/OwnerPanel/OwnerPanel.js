import React, {useEffect, useState} from 'react';
import "./HotelOwnerPanel.css"
import 'chart.js/auto';
import {Line} from 'react-chartjs-2';
import RoomReservation from "../Reservations/RoomReservation";

import axios from "axios";
import {Form} from "react-bootstrap";
import RoomsVisual from "../RoomsVisual/RoomsVisual";
import PhotoCarousel from "../PhotoCarousel/PhotoCarousel";

const OwnerPanel = () => {
    // Stan dla aktualnej lokalizacji hotelu
    const [location, setLocation] = useState('City Center');
    const [checkInDate, setCheckInDate] = useState(new Date().toISOString().slice(0, 10));
    const [checkOutDate, setCheckOutDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10));
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [hotels, setHotels] = useState([])
    const [hotelId, setHotelId] = useState(null);
    const [roomStandard, setRoomStandard] = useState('standard');

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/hotels/");
                setHotels(response.data);
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };

        if (!hotels.length) {
            fetchHotels()
        }

        if (!hotel) {
            setHotel(hotels?.find(h => h.hotel_id === parseInt(1)))
            setHotelId(1)
            console.log(hotel)
        }


        // try {
        //     const response = axios.post("http://localhost:8000/api/rooms/", {
        //         type: roomStandard,
        //         check_in: checkInDate,
        //         check_out: checkOutDate,
        //         hotel_id: hotelId
        //     });
        //     setRooms(response.data);
        //
        // } catch (error) {
        //     console.log("issues")
        // }

    }, [checkInDate, checkOutDate, hotel, hotelId, hotels, roomStandard]);

    // Stan dla cen różnych standardów pokojów
    const [roomPrices, setRoomPrices] = useState({
        standard: 100,
        deluxe: 150,
        suite: 250,
    });

    // Stan dla statusów pokojów
    const [roomStatuses, setRoomStatuses] = useState([
        {roomNumber: 101, status: 'Occupied'},
        {roomNumber: 102, status: 'Available'},
        {roomNumber: 103, status: 'Cleaning'},
        {roomNumber: 104, status: 'Available'},
    ]);

    // Dane dla wykresów zysków i strat
    const profitData = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'Profit',
                data: [3000, 5000, 4000, 6000, 7000],
                borderColor: 'green',
                borderWidth: 2,
                fill: false,
            },
            {
                label: 'Loss',
                data: [1000, 1500, 1200, 1800, 1400],
                borderColor: 'red',
                borderWidth: 2,
                fill: false,
            },
        ],
    };

    // Funkcja do zmiany cen pokojów
    const handlePriceChange = (standard, newPrice) => {
        setRoomPrices((prevPrices) => ({...prevPrices, [standard]: newPrice}));
    };

    // Funkcja do zmiany lokalizacji hotelu
    const handleLocationChange = (newLocation) => {
        setLocation(newLocation);
        // Możesz tutaj zaimplementować kod do pobierania danych dla nowej lokalizacji
    };

    const handleHotelChange = (e) => {
        const selectedHotelId = e.target.value;
        setHotelId(selectedHotelId);
        setHotel(hotels.find(h => h.hotel_id === parseInt(selectedHotelId)));
    };

    return (
        <div className="hotel-owner-dashboard">
            <h1>Panel właściciela</h1>

            {/* Sekcja zmiany lokalizacji hotelu */}
            <section className="location-switch-section">
                <h2>Lokacja hotelu</h2>
                <Form.Control
                    as="select"
                    value={hotelId || ''} // Ensure default selection is set
                    onChange={handleHotelChange}
                >
                    {hotels.map((h) => (
                        <option key={h.hotel_id} value={h.hotel_id}>
                            Hotel Weles - {h.localization}
                        </option>
                    ))}
                </Form.Control>
            </section>

            {/* Sekcja zarządzania cenami pokojów */}
            <section className="room-prices-section">
                <h2>Zarządzaj cenami pokojów</h2>
                {Object.keys(roomPrices).map((standard) => (
                    <div key={standard} className="room-price-setting">
                        <label>{standard.charAt(0).toUpperCase() + standard.slice(1)} Room: </label>
                        <input
                            type="number"
                            value={roomPrices[standard]}
                            onChange={(e) => handlePriceChange(standard, parseInt(e.target.value))}
                        />
                    </div>
                ))}

                <div style={{textAlign: "right", paddingRight: 20, paddingTop: 20}}>
                    <a href={"/rooms/prices/"}>Zobacz więcej...</a>
                </div>

            </section>

            {/* Sekcja śledzenia statusów pokojów */}
            <section className="room-status-section">
                <h2>Statusy pokojów</h2>
                {hotel && hotelId ?
                    <RoomsVisual rooms={rooms} hotel={hotel} checkIn={checkInDate} checkOut={checkOutDate}
                                     roomStandard={roomStandard}/>
                    : null}

            </section>

            {/* Sekcja analizy zysków i strat */}
            <section className="profit-analysis-section">
                <h2>Profit and Loss Analysis</h2>
                <Line data={profitData}/>
            </section>

        </div>
    );
};

export default OwnerPanel;