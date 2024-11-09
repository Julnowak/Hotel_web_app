import React from 'react';

const ReservationsList = ({ reservations, allowStatusChange = false, onStatusUpdate }) => {
  const handleStatusChange = (id, newStatus) => {
    if (onStatusUpdate) {
      onStatusUpdate(prev =>
        prev.map(res => (res.id === id ? { ...res, status: newStatus } : res))
      );
    }
  };

  return (
    <div className="reservations-list">
      {reservations.map(res => (
        <div key={res.id} className="reservation-card">
          <p>Room: {res.room}</p>
          <p>Guest: {res.guest}</p>
          <p>Status: {res.status}</p>
          {allowStatusChange && (
            <select
              value={res.status}
              onChange={(e) => handleStatusChange(res.id, e.target.value)}
            >
              <option value="Reserved">Reserved</option>
              <option value="Checked-in">Checked-in</option>
              <option value="Checked-out">Checked-out</option>
              <option value="Canceled">Canceled</option>
            </select>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReservationsList;
