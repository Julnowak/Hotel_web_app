import React, { useState } from 'react';

const HotelCosts = () => {
    const [costs, setCosts] = useState({
        '2024-10': 250,
        '2024-11': 3520,
        '2024-12': 900,
        '2025-01': 360,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const costsPerPage = 5;
    const [error, setError] = useState('');

    const calculateNextMonth = (lastMonth) => {
        const [year, month] = lastMonth.split('-').map(Number);
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        return `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
    };

    const handleAddNextMonth = () => {
        const months = Object.keys(costs).sort();
        const lastMonth = months[months.length - 1];
        const nextMonth = calculateNextMonth(lastMonth);
        setCosts({
            ...costs,
            [nextMonth]: 0,
        });
    };

    const handleUpdateCost = (month, newCost) => {
        if (isNaN(newCost) || Number(newCost) < 0) {
            setError('Invalid cost. Please enter a positive number.');
            return;
        }
        setCosts({
            ...costs,
            [month]: parseFloat(newCost),
        });
        setError('');
    };

    const handleDelete = (month) => {
        const updatedCosts = { ...costs };
        delete updatedCosts[month];
        setCosts(updatedCosts);
    };

    const indexOfLastCost = currentPage * costsPerPage;
    const indexOfFirstCost = indexOfLastCost - costsPerPage;
    const currentCosts = Object.entries(costs).slice(indexOfFirstCost, indexOfLastCost);

    const totalPages = Math.ceil(Object.keys(costs).length / costsPerPage);

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
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
            <h2>Hotel Costs Management</h2>
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Cost</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCosts.map(([month, cost]) => (
                        <tr key={month}>
                            <td>{month}</td>
                            <td>
                                <input
                                    type="number"
                                    value={cost}
                                    onChange={(e) => handleUpdateCost(month, e.target.value)}
                                    style={{ width: '100%' }}
                                />
                            </td>
                            <td>
                                <button onClick={() => handleDelete(month)} style={{ color: 'red', cursor: 'pointer' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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

            <button
                onClick={handleAddNextMonth}
                style={{ backgroundColor: 'green', color: 'white', padding: '10px 20px', cursor: 'pointer', marginBottom: '10px' }}
            >
                + Add Next Month
            </button>

            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        </div>
    );
};

export default HotelCosts;
