import React, { useState, useEffect } from 'react';
import "./ReservationsList.css";
import client from "../client";
import {useNavigate, useParams} from "react-router-dom";

const ReservationsList = () => {
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Liczba elementów na stronę
    const navigate = useNavigate();
    const params = useParams()

    // Fetch reservations from API
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await client.get(`http://127.0.0.1:8000/api/recepcionistReservations/${params.id}/`);
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
        setCurrentPage(1); // Reset do pierwszej strony
    };

    // Paginacja: oblicz elementy na aktualnej stronie
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReservations = filteredReservations.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

    // Funkcja generująca numery stron
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
                    {currentReservations.length > 0 ? (
                        currentReservations.map((reservation) => (
                            <tr
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/receptionist/manage/reservation/${reservation.reservation_id}/`)}
                                key={reservation.reservation_id}
                            >
                                <td>{reservation.reservation_id}</td>
                                <td style={{ backgroundColor: getColorForDate(reservation.check_in, reservation.status) }}>
                                {reservation.check_in}
                                </td>
                                <td style={{ backgroundColor: getColorForDate(reservation.check_in, reservation.status) }}>
                                {reservation.check_out}
                                </td>
                                <td>{reservation.guest}</td>
                                <td style={{
                                    backgroundColor: reservation.status === 'Opłacona' ? 'lightgreen' :
                                        reservation.status === 'Anulowana' ? 'palevioletred' :
                                        reservation.status === 'Częściowo opłacona' ? 'orange' :
                                        reservation.status === 'W trakcie' ? 'lightblue' :
                                        reservation.status === 'Zakończona' ? 'lightcyan' : 'lightgray',
                                }}>
                                    {reservation.status}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">Brak wyników</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Paginacja */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '20px 0'
            }}>
                <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    style={{
                        padding: "8px 12px",
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
                    {'>'}
                </button>

                <button
                    onClick={() => setCurrentPage(totalPages)}
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
                    {`>>`}
                </button>
            </div>
        </div>
    );
};

export default ReservationsList;
