import React from 'react';
import { Container, Tab, Tabs, Table } from 'react-bootstrap';

const CustomerPanel = () => {
    document.body.style.backgroundColor = '#767676';
 const userData = {
    name: 'Jan Kowalski',
    email: 'jan.kowalski@example.com',
  };

  const favoriteHotels = [
    { id: 1, name: 'Hotel A', location: 'Warszawa' },
    { id: 2, name: 'Hotel B', location: 'Kraków' },
  ];

  const reservations = [
    {
      id: 1,
      hotel: 'Hotel A',
      checkIn: '2024-10-01',
      checkOut: '2024-10-05',
      status: 'Potwierdzona',
    },
    {
      id: 2,
      hotel: 'Hotel B',
      checkIn: '2024-11-10',
      checkOut: '2024-11-15',
      status: 'Oczekująca',
    },
  ]

    return (
        <Container>
      <h2>Panel Użytkownika</h2>
      <h4>Witaj, {userData.name}!</h4>
      <p>Email: {userData.email}</p>

      <Tabs defaultActiveKey="favorites" id="user-panel-tabs" className="mb-3">
        <Tab eventKey="favorites" title="Ulubione Hotele">
          <h4>Twoje ulubione hotele</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nazwa</th>
                <th>Lokalizacja</th>
              </tr>
            </thead>
            <tbody>
              {favoriteHotels.map((hotel) => (
                <tr key={hotel.id}>
                  <td>{hotel.name}</td>
                  <td>{hotel.location}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="reservations" title="Rezerwacje">
          <h4>Twoje rezerwacje</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Hotel</th>
                <th>Data zameldowania</th>
                <th>Data wymeldowania</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.hotel}</td>
                  <td>{reservation.checkIn}</td>
                  <td>{reservation.checkOut}</td>
                  <td>{reservation.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="info" title="Informacje o Rezerwacji">
          <h4>Informacje o Rezerwacji</h4>
          <p>Tu możesz dodać szczegóły dotyczące aktualnych rezerwacji.</p>
          {/* Możesz dodać dodatkowe informacje o rezerwacji tutaj */}
        </Tab>
        <Tab eventKey="profile" title="Dane Użytkownika">
          <h4>Twoje dane</h4>
          <p>Imię i Nazwisko: {userData.name}</p>
          <p>Email: {userData.email}</p>
          {/* Możesz dodać możliwość edycji danych użytkownika */}
        </Tab>
      </Tabs>
    </Container>
    );
};

export default CustomerPanel;
