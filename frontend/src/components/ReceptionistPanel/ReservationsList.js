import React, { useState, useEffect } from 'react';
import "./ReservationsList.css"
import client from "../client";
import {useNavigate} from "react-router-dom";

const ReservationsList = () => {
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate()

    // Fetch reservations from API
    useEffect(() => {
        const fetchReservations = async () => {
        try {
            const response = await client.get(`http://127.0.0.1:8000/api/personelReservations/`, );
            setFilteredReservations(response.data);
            setReservations(response.data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };
        fetchReservations();
    }, []);

    // Handle search/filter by reservation number
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        const filtered = reservations.filter(reservation =>
        String(reservation.reservation_id).toLowerCase().includes(value.toLowerCase())
    );
        setFilteredReservations(filtered);
    };

    // Funkcja do obliczania różnicy dni między dzisiejszą datą a datą rezerwacji
    const getDateDifference = (date) => {
        const today = new Date();
        const reservationDate = new Date(date);
        const diffTime = reservationDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Liczba dni różnicy
        return diffDays;
    };


    // Funkcja do obliczania koloru na podstawie różnicy dni
    const getColorForDate = (date, stat) => {
        const diffDays = getDateDifference(date);
        console.log(Math.abs(diffDays))

        let op = 0;

        if (stat === "Anulowana" || stat === "Zakończona")
        {
            op = 0;
        }
        else
        {
            op = Math.abs(diffDays) // Zmniejsza intensywność czerwieni w miarę jak data się oddala
        }



        return `rgba(255,0,0,${op}%)`; // Kolor będzie coraz bardziej szary w miarę oddalania się daty
    };

    return (
        <div className="reservations-container">
            <h1>Lista Rezerwacji</h1>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Szukaj po numerze rezerwacji"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <table className="reservations-table">
                <thead>
                    <tr>
                        <th>Numer Rezerwacji</th>
                        <th>Data zameldowania</th>
                        <th>Data wymeldowania</th>
                        <th>Imię</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReservations.length > 0 ? (
                        filteredReservations.map((reservation) => (
                            <tr style={{cursor: "pointer"}} onClick={function () {
                                navigate(`/receptionist/manage/reservation/${reservation.reservation_id}/`)
                            }} key={reservation.reservation_id}>
                                <td>{reservation.reservation_id}</td>

                                <td style={{ backgroundColor: getColorForDate(reservation.check_in, reservation.status) }}>
                                {reservation.check_in}
                                </td>
                                <td style={{ backgroundColor: getColorForDate(reservation.check_in, reservation.status) }}>
                                    {reservation.check_out}
                                </td>
                                <td>{reservation.guest_name}</td>
                                <td style={{
                                            backgroundColor: reservation.status === 'Opłacona' ? 'lightgreen' :
                                                reservation.status === 'Anulowana' ? 'palevioletred' :
                                                    reservation.status === 'W trakcie' ? 'lightblue' :
                                                        reservation.status === 'Zakończona' ? 'lightcyan' : 'lightgray',

                                        }}>{reservation.status}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">Brak wyników</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ReservationsList;
