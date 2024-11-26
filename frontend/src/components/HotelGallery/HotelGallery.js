import React, { useState } from "react";
import "./HotelGallery.css";

// Dane dla galerii hotelu
const hotelImages = [
    { src: "/images/hotel_rooms_images/room1.jpg", title: "Pokój Standardowy", description: "Komfortowy pokój dla jednej osoby." },
    { src: "/images/hotel_rooms_images/room2.jpg", title: "Pokój Deluxe", description: "Elegancki pokój z widokiem na ogród." },
    { src: "/images/hotel_rooms_images/room3.jpg", title: "Apartament", description: "Luksusowy apartament z jacuzzi." },
    { src: "/images/hotel_rooms_images/pool.jpg", title: "Basen", description: "Basen z podgrzewaną wodą." },
    { src: "/images/hotel_rooms_images/spa.jpg", title: "Spa", description: "Relaksujące zabiegi w spa." },
    { src: "/images/hotel_rooms_images/restaurant.jpg", title: "Restauracja", description: "Wykwintna kuchnia z lokalnymi specjałami." },
];

const HotelGallery = () => {
    const [isLightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Funkcje do obsługi lightboxa
    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const changeImage = (direction) => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + direction + hotelImages.length) % hotelImages.length
        );
    };

    return (
        <div className="hotel-gallery">
            <h1 className="gallery-title">Galeria Hotelu</h1>
            <div className="gallery-grid">
                {hotelImages.map((image, index) => (
                    <div
                        key={index}
                        className="gallery-item"
                        onClick={() => openLightbox(index)}
                    >
                        <img
                            src={image.src}
                            alt={image.title}
                            className="gallery-image"
                        />
                        <div className="image-caption">
                            <h3>{image.title}</h3>
                            <p>{image.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {isLightboxOpen && (
                <div className="lightbox" onClick={closeLightbox}>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeLightbox}>&times;</span>
                        <img
                            src={hotelImages[currentImageIndex].src}
                            alt={hotelImages[currentImageIndex].title}
                            className="lightbox-image"
                        />
                        <div className="lightbox-caption">
                            <h3>{hotelImages[currentImageIndex].title}</h3>
                            <p>{hotelImages[currentImageIndex].description}</p>
                        </div>
                        <div className="lightbox-navigation">
                            <span className="prev" onClick={() => changeImage(-1)}>&#10094;</span>
                            <span className="next" onClick={() => changeImage(1)}>&#10095;</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HotelGallery;
