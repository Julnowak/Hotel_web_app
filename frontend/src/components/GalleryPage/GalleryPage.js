import React, { useState } from 'react';
import './GalleryPage.css';

// Przykładowe dane galerii
const photos = [
  { id: 1, location: 'Kraków', rating: 4, imageUrl: '/images/krakow1.jpg' },
  { id: 2, location: 'Kraków', rating: 5, imageUrl: '/images/krakow2.jpg' },
  { id: 3, location: 'Warszawa', rating: 3, imageUrl: '/images/warszawa1.jpg' },
  { id: 4, location: 'Warszawa', rating: 5, imageUrl: '/images/warszawa2.jpg' },
  { id: 5, location: 'Poznań', rating: 4, imageUrl: '/images/poznan1.jpg' },
  { id: 6, location: 'Poznań', rating: 3, imageUrl: '/images/poznan2.jpg' },
];

const GalleryPage = () => {
  const [selectedLocation, setSelectedLocation] = useState('Wszystkie');
  const [minRating, setMinRating] = useState(0);

  // Filtrujemy zdjęcia na podstawie wybranej lokalizacji i oceny
  const filteredPhotos = photos.filter(photo =>
    (selectedLocation === 'Wszystkie' || photo.location === selectedLocation) &&
    photo.rating >= minRating
  );

  return (
    <div className="gallery-page">
      <h2>Galeria Hoteli</h2>

      <div className="filters">
        <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
          <option value="Wszystkie">Wszystkie lokalizacje</option>
          <option value="Kraków">Kraków</option>
          <option value="Warszawa">Warszawa</option>
          <option value="Poznań">Poznań</option>
        </select>

        <select value={minRating} onChange={(e) => setMinRating(parseInt(e.target.value))}>
          <option value="0">Wszystkie oceny</option>
          <option value="3">Min. 3 gwiazdki</option>
          <option value="4">Min. 4 gwiazdki</option>
          <option value="5">Min. 5 gwiazdek</option>
        </select>
      </div>

      <div className="photo-gallery">
        {filteredPhotos.length ? (
          filteredPhotos.map(photo => (
            <div key={photo.id} className="photo-card">
              <img src={photo.imageUrl} alt={`${photo.location} Hotel`} />
              <div className="photo-info">
                <p>{photo.location}</p>
                <p>Ocena: {photo.rating} ⭐</p>
              </div>
            </div>
          ))
        ) : (
          <p>Brak wyników spełniających kryteria filtrowania.</p>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
