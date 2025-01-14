import React, {useEffect, useState} from 'react';
import axios from "axios";
import {API_BASE_URL} from "../../../config";
import Cookies from "js-cookie";

const HotelCosts = ({title, data, hotelId, data_type}) => {
    const [costs, setCosts] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const costsPerPage = 5;
    const [error, setError] = useState('');
    const [flag, setFlag] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [filterMonth, setFilterMonth] = useState('');

    const calculateNextMonth = (lastMonth) => {
        const [year, month] = lastMonth.split('-').map(Number);
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        return `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
    };

    const calculatePreviousMonth = (lastMonth) => {
        const [year, month] = lastMonth.split('-').map(Number);
        const previousMonth = month === 1 ? 12 : month - 1;
        const previousYear = month === 1 ? year - 1 : year;
        return `${previousYear}-${String(previousMonth).padStart(2, '0')}`;
    };

    const handleAddNextMonth = async () => {
        const months = Object.keys(costs).sort();
        const lastMonth = months[months.length - 1];
        const nextMonth = calculateNextMonth(lastMonth);
        setCosts({
            ...costs,
            [nextMonth]: 0,
        });

        try {
            const csrfToken = Cookies.get("csrftoken"); // Extract CSRF token from cookies
                if (!csrfToken) {
                    console.error("CSRF token not found!");
                    return;
                }
            await axios.post(`${API_BASE_URL}/chart_data/${hotelId}`,{
                data_type: data_type,
                month: [nextMonth]
            }, {
                        headers: {
                            "X-CSRFToken": csrfToken,
                        },
                    });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAddPreviousMonth = async () => {
        const months = Object.keys(costs).sort();
        const firstMonth = months[0];
        const nextMonth = calculatePreviousMonth(firstMonth);
        setCosts({
            [nextMonth]: 0,
            ...costs,
        });

        try {
            const csrfToken = Cookies.get("csrftoken"); // Extract CSRF token from cookies
            if (!csrfToken) {
                console.error("CSRF token not found!");
                return;
            }
            await axios.post(`${API_BASE_URL}/chart_data/${hotelId}`, {
                data_type: data_type,
                month: [nextMonth]
            }, {
                headers: {
                    "X-CSRFToken": csrfToken,
                },
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleUpdateCost = (month, newCost) => {
        if (isNaN(newCost) || Number(newCost) < 0) {
            setError('Nieprawidłowa wartość. Proszę wpisać liczbę nieujemną.');
            return;
        }
        setCosts({
            ...costs,
            [month]: parseFloat(newCost),
        });
        setError('');
    };

    const handleEdit = async (month,cost) => {
        setFlag("Poprawnie edytowano komórkę")
        setTimeout(function (){setFlag("")}, 2000)

        try {
            const csrfToken = Cookies.get("csrftoken"); // Extract CSRF token from cookies
            if (!csrfToken) {
                console.error("CSRF token not found!");
                return;
            }
            await axios.put(`${API_BASE_URL}/chart_data/${hotelId}`, {
                data_type: data_type,
                month: month,
                new_value: cost,
            }, {
                headers: {
                    "X-CSRFToken": csrfToken,
                },
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const applyFilters = () => {
        return Object.entries(costs).filter(([month]) => {
            const [year, monthNum] = month.split('-');
            return (
                (!filterYear || year.toString().includes(filterYear.toString())) &&
                (!filterMonth || monthNum.toString().includes(filterMonth.toString()))
            );
        });
    };

    const filteredCosts = applyFilters();

    const indexOfLastCost = currentPage * costsPerPage;
    const indexOfFirstCost = indexOfLastCost - costsPerPage;
    const currentCosts = filteredCosts.slice(indexOfFirstCost, indexOfLastCost);

    const totalPages = Math.ceil(filteredCosts.length / costsPerPage);

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
        if (data) {
            setCosts(data);
        }
    }, [data]);

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{title}</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Rok"
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', width: '48%' }}
                />
                <input
                    type="text"
                    placeholder="Miesiąc"
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', width: '48%' }}
                />
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead style={{ backgroundColor: '#f5f5f5' }}>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Miesiąc</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Suma</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Akcja</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCosts.map(([month, cost]) => (
                        <tr key={month}>
                            <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{month}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                                <input
                                    type="number"
                                    value={cost}
                                    onChange={(e) => handleUpdateCost(month, e.target.value)}
                                    style={{ width: '80%', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                                />
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                                <button onClick={() => handleEdit(month,cost)} style={{ backgroundColor: 'darkorange', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Edytuj</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <button
                    onClick={handleAddPreviousMonth}
                    style={{ backgroundColor: '#ffffff', color: 'black', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', border: 'none' }}
                >
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                             className="bi bi-plus-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path
                                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                        </svg>
                        <span> Poprzedni</span>
                    </div>
                </button>
                <button
                    onClick={handleAddNextMonth}
                    style={{ backgroundColor: 'white', color: 'black', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', border: 'none' }}
                >
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                             className="bi bi-plus-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path
                                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                        </svg>
                        <span> Następny</span>
                    </div>
                </button>
            </div>
            {error && <div style={{ color: 'red', textAlign: 'center', margin: 20  }}>{error}</div>}
            {flag && <div style={{ color: 'green', textAlign: 'center', margin: 20 }}>{flag}</div>}
                 <div
                        style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px'}}>
                        <button
                            onClick={() => setCurrentPage((prev) => 1)}
                            disabled={currentPage === 1}
                            style={{padding: "8px 12px",
                                    margin: "0 5px",
                                    background: currentPage === 1 ? "#fff" : "#333",
                                    color: currentPage === 1 ? "#333" : "#fff",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    cursor: "pointer",}}
                        >
                            {`<<`}
                        </button>

                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={{padding: "8px 12px",
                                    margin: "0 5px",
                                    background: currentPage === 1 ? "#fff" : "#333",
                                    color: currentPage === 1 ? "#333" : "#fff",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    cursor: "pointer",}}
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
                            style={{padding: "8px 12px",
                                    margin: "0 5px",
                                    background: currentPage === totalPages ? "#fff" : "#333",
                                    color: currentPage === totalPages ? "#333" : "#fff",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    cursor: "pointer",}}
                        >
                            >
                        </button>
                        <button
                            onClick={() => setCurrentPage((prev) => totalPages)}
                            disabled={currentPage === totalPages}
                            style={{padding: "8px 12px",
                                    margin: "0 5px",
                                    background: currentPage === totalPages ? "#fff" : "#333",
                                    color: currentPage === totalPages ? "#333" : "#fff",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    cursor: "pointer",}}
                        >
                            >>
                        </button>
                    </div>

        </div>
    );
};

export default HotelCosts;
