import React, {useState} from 'react';
import './GalleryPage.css';

// Image data structure for all categories
const galleryData = [
    {
        category: 'Standard',
        images: [
            {src: '/images/hotel_rooms_images/room1.jpg', title: 'Pokój 1-osobowy', description: 'Idealny dla osób...'},
            {src: '/images/hotel_rooms_images/room2.jpg', title: 'Pokój 2-osobowy', description: 'Idealny dla osób...'},
        ],
    },
    {
        category: 'Deluxe',
        images: [
            {src: '/images/hotel_rooms_images/room3.jpg', title: 'Pokój 1-osobowy', description: 'Idealny dla osób...'},
            {src: '/images/hotel_rooms_images/room4.jpg', title: 'Pokój 2-osobowy', description: 'Idealny dla osób...'},
        ],
    },
    {
        category: 'Apartamenty',
        images: [
            {src: '/images/hotel_rooms_images/room5.jpg', title: 'Pokój 1-osobowy', description: 'Idealny dla osób...'},
            {src: '/images/hotel_rooms_images/room6.jpg', title: 'Pokój 2-osobowy', description: 'Idealny dla osób...'},
        ],
    },
    {
        category: 'Udogodnienia',
        images: [
            {src: '/images/hotel_rooms_images/room2.jpg', title: 'Pokój 1-osobowy', description: 'Idealny dla osób...'},
            {src: '/images/hotel_rooms_images/room1.jpg', title: 'Pokój 2-osobowy', description: 'Idealny dla osób...'},
        ],
    },
];

// Combine all images from all categories into one list
const allImages = galleryData.flatMap(section => section.images);

const Gallery = () => {
    const [isLightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const changeImage = (direction) => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + direction + allImages.length) % allImages.length // Cycle through all images
        );
    };

    return (
        <div className="gallery-container">
            <h1>Galeria</h1>

            {/* Display gallery sections */}
            {galleryData.map((section, index) => (
                <div key={index}>
                    <h2>{section.category}</h2>
                    <div className="gallery-row">
                        {section.images.map((image, imageIndex) => (
                            <div
                                key={imageIndex}
                                className="gallery-item"
                                onClick={() => openLightbox(allImages.indexOf(image))}
                            >
                                <div style={{height: "70%", display: "flex", justifyContent: "center"}}>
                                    <img style={{height: "90%",}} src={image.src} alt={image.title}/>
                                </div>

                                <div className="caption">
                                    <strong style={{textAlign: "center", display: "block"}}>{image.title}</strong>
                                    <p style={{padding: 20}}>{image.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {isLightboxOpen && (
                <div className="lightbox" onClick={closeLightbox}>
                    <span className="close" onClick={closeLightbox}>×</span>
                    <img
                        src={allImages[currentImageIndex].src}
                        alt={allImages[currentImageIndex].title}
                        className="lightbox-content"
                    />
                    <div className="lightbox-navigation">
                        <span className="prev" onClick={(e) => {
                            e.stopPropagation();
                            changeImage(-1);
                        }}>&#10094;</span>
                        <span className="next" onClick={(e) => {
                            e.stopPropagation();
                            changeImage(1);
                        }}>&#10095;</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
