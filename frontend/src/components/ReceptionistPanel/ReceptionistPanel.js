import React, { useState, useEffect } from 'react';
import ReservationsList from './ReservationList';
import RoomStatus from './RoomStatus';
import './ReceptionistPanel.css';

// Sample data
const sampleReservations = [
  { id: 1, room: '101', guest: 'John Doe', status: 'Checked-in', date: '2024-11-09' },
  { id: 2, room: '102', guest: 'Jane Smith', status: 'Reserved', date: '2024-11-10' },
  // Additional reservations for testing
];

const ReceptionistPanel = () => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date as a string
  const [reservations, setReservations] = useState(sampleReservations);
  const [roomStatuses, setRoomStatuses] = useState([
    { roomNumber: '101', status: 'Occupied' },
    { roomNumber: '102', status: 'Available' },
  ]);

  const currentReservations = reservations.filter(res => res.date === today);
  const upcomingReservations = reservations.filter(res => res.date > today);

  return (
    <div className="receptionist-panel">
      <h2>Receptionist Panel</h2>

      <section>
        <h3>Today's Reservations</h3>
        <ReservationsList reservations={currentReservations} />
      </section>

      <section>
        <h3>Upcoming Reservations</h3>
        <ReservationsList reservations={upcomingReservations} />
      </section>

      <section>
        <h3>Room Statuses</h3>
        <RoomStatus roomStatuses={roomStatuses} onUpdateStatus={setRoomStatuses} />
      </section>

      <section>
        <h3>Manage Reservations</h3>
        <ReservationsList reservations={reservations} allowStatusChange onStatusUpdate={setReservations} />
      </section>
    </div>
  );
};

export default ReceptionistPanel;
