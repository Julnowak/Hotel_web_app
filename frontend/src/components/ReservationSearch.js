import React, { useState } from 'react';
import { API_BASE_URL } from "../config";
import client from "./client";

const ReservationSearch = () => {
  const [reservationId, setReservationId] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [reservationData, setReservationData] = useState(null);
  const [error, setError] = useState(null);

  // Funkcja wyszukiwania rezerwacji
  const handleSearch = async () => {
    // Walidacja danych wejściowych
    if (!reservationId) {
      setError('Proszę podać ID rezerwacji.');
      return;
    } else if (!email){
      setError('Proszę podać email.');
      return;
    } else if (!firstName) {
      setError('Proszę podać imię.');
      return;
    } else if (!lastName) {
      setError('Proszę podać nazwisko.');
      return;
    }

    try {
      // Wysłanie zapytania do serwera
      const response = await client.post(`${API_BASE_URL}/search/`, {
        reservation_id: reservationId,
        email: email,
        first_name: firstName,
        last_name: lastName
      });
      console.log(response.data.ans )
      // Sprawdzenie odpowiedzi
      if (response.data.ans !== null) {
        setReservationData(response.data.ans);
        setError(null); // Resetowanie błędu, jeśli zapytanie jest udane
      } else {
        setError("Nie znaleziono rezerwacji spełniającej podane kryteria.");
        setReservationData(null);
      }
    } catch (err) {
      setError("Nie znaleziono rezerwacji spełniającej podane kryteria.");
      setReservationData(null); // Resetowanie danych, jeśli wystąpił błąd
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '60px' }}>
      <h2>Wyszukaj swoją rezerwację</h2>
            {/* Wyświetlanie komunikatów o błędach */}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="reservationId" style={{ display: 'block', fontSize: '16px', marginBottom: '5px' }}>
          ID rezerwacji:
        </label>
        <input
          id="reservationId"
          type="text"
          placeholder="Podaj ID rezerwacji"
          value={reservationId}
          onChange={(e) => setReservationId(e.target.value)}
          style={{
            padding: '8px',
            marginRight: '10px',
            textAlign: "center",
            width: '200px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginBottom: '10px'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="email" style={{ display: 'block', fontSize: '16px', marginBottom: '5px' }}>
          Email:
        </label>
        <input
          id="email"
          type="email"
          placeholder="Podaj email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: '8px',
            marginRight: '10px',
            textAlign: "center",
            width: '200px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginBottom: '10px'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="firstName" style={{ display: 'block', fontSize: '16px', marginBottom: '5px' }}>
          Imię:
        </label>
        <input
          id="firstName"
          type="text"
          placeholder="Podaj imię"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={{
            padding: '8px',
            marginRight: '10px',
            textAlign: "center",
            width: '200px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginBottom: '10px'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="lastName" style={{ display: 'block', fontSize: '16px', marginBottom: '5px' }}>
          Nazwisko:
        </label>
        <input
          id="lastName"
          type="text"
          placeholder="Podaj nazwisko"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={{
            padding: '8px',
            marginRight: '10px',
            textAlign: "center",
            width: '200px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginBottom: '10px'
          }}
        />
      </div>

      <button onClick={handleSearch} style={{
        padding: '8px 15px', backgroundColor: '#ff7329', color: '#ffffff', fontSize: '16px',
        border: 'none', borderRadius: '4px', cursor: 'pointer'
      }}>
        Wyszukaj
      </button>

      {/* Wyświetlanie danych rezerwacji */}
      {reservationData && (
        <div style={{ marginTop: '20px' }}>
          <h3>Wyniki wyszukiwania:</h3>
          <p><strong>ID rezerwacji:</strong> {reservationData.id}</p>
          <p><strong>Data przyjazdu:</strong> {reservationData.check_in}</p>
          <p><strong>Data wyjazdu:</strong> {reservationData.check_out}</p>
          <p><strong>Pokój:</strong> {reservationData.room}</p>
          <p><strong>Osoby:</strong> {reservationData.people_number}</p>
          <p><strong>Hotel:</strong> {reservationData.hotel}</p>
        </div>
      )}
    </div>
  );
};

export default ReservationSearch;
