import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './BookingCalendar.css';

const BookingCalendar = ({ bookedPeriods }) => {
  const [value, setValue] = useState(new Date());

  // Dodanie klasy CSS do dni zajętych
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      // Sprawdź, czy dzień należy do jakiegokolwiek okresu rezerwacji
      const matchingPeriod = bookedPeriods.find((period) => {
        const startDate = new Date(period.start);
        const endDate = new Date(period.end);
        return startDate.setHours(0) <= date.setHours(0) && date.setHours(0) <= endDate.setHours(0);
      });

      // Sprawdzenie, czy matchingPeriod istnieje
      if (matchingPeriod) {
        // Sprawdź, czy dzień jest początkiem lub końcem rezerwacji
        const isStartDate = bookedPeriods.some((period) => {
          const startDate = new Date(period.start);
          return startDate.toDateString() === date.toDateString();
        });

        const isEndDate = bookedPeriods.some((period) => {
          const endDate = new Date(period.end);
          return endDate.toDateString() === date.toDateString();
        });

        // Jeśli data jest częścią rezerwacji, sprawdź warunki
        if ((isStartDate && isEndDate) || matchingPeriod) {
          if (isStartDate && isEndDate){
            return 'booked';
          }
          else if (isStartDate || isEndDate) {
            return 'partially'; // Dzień pośredni, część rezerwacji
          }
          return 'booked'; // Dzień, który jest zarówno startem jak i końcem (pełne zajęcie)
        }
      } else {
        return 'av'; // Dzień wolny
      }
    }
    return 'other'; // Inny widok (np. tydzień lub rok)
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h4>Kalendarz rezerwacji</h4>
      <Calendar
        onChange={setValue}
        value={value}
        tileClassName={tileClassName}
      />
    </div>
  );
};

export default BookingCalendar;
