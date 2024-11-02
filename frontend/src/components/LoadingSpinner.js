import React from 'react';
import './LoadingSpinner.css'; // Import the CSS for spinner styles

const LoadingSpinner = () => {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Ładowanie...</p>
        </div>
    );
};

export default LoadingSpinner;
