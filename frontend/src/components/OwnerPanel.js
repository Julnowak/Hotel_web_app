import React, {useState} from 'react';
import "./HotelOwnerPanel.css"
import 'chart.js/auto';
import { Line } from 'react-chartjs-2';

const OwnerPanel = () => {
  // Stan dla aktualnej lokalizacji hotelu
  const [location, setLocation] = useState('City Center');

  // Stan dla cen różnych standardów pokojów
  const [roomPrices, setRoomPrices] = useState({
    standard: 100,
    deluxe: 150,
    suite: 250,
  });

  // Stan dla statusów pokojów
  const [roomStatuses, setRoomStatuses] = useState([
    { roomNumber: 101, status: 'Occupied' },
    { roomNumber: 102, status: 'Available' },
    { roomNumber: 103, status: 'Cleaning' },
    { roomNumber: 104, status: 'Available' },
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
    setRoomPrices((prevPrices) => ({ ...prevPrices, [standard]: newPrice }));
  };

  // Funkcja do zmiany lokalizacji hotelu
  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    // Możesz tutaj zaimplementować kod do pobierania danych dla nowej lokalizacji
  };

  return (
    <div className="hotel-owner-dashboard">
      <h1>Hotel Owner Dashboard</h1>

      {/* Sekcja zarządzania cenami pokojów */}
      <section className="room-prices-section">
        <h2>Manage Room Prices</h2>
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
      </section>

      {/* Sekcja śledzenia statusów pokojów */}
      <section className="room-status-section">
        <h2>Room Statuses</h2>
        <ul>
          {roomStatuses.map((room) => (
            <li key={room.roomNumber}>
              Room {room.roomNumber}: {room.status}
            </li>
          ))}
        </ul>
      </section>

      {/* Sekcja zmiany lokalizacji hotelu */}
      <section className="location-switch-section">
        <h2>Switch Hotel Location</h2>
        <select value={location} onChange={(e) => handleLocationChange(e.target.value)}>
          <option value="City Center">City Center</option>
          <option value="Beach Side">Beach Side</option>
          <option value="Mountain Resort">Mountain Resort</option>
        </select>
      </section>

      {/* Sekcja analizy zysków i strat */}
      <section className="profit-analysis-section">
        <h2>Profit and Loss Analysis</h2>
        <Line data={profitData} />
      </section>
    </div>
  );
};

export default OwnerPanel;