import React, {useEffect, useState} from 'react';
import {Container, Navbar, Nav, Row, Col, Card, Form, Button, Carousel} from 'react-bootstrap';
import './Header.css';
import logo from '../../assets/weles_white.png';
import PhotoCarousel from "../PhotoCarousel/PhotoCarousel";
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import axios from "axios";
import StarRating from "../StarRating/StarRating";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});


const Homepage = () => {
    document.body.style.backgroundColor = '#17120EFF';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const photos = [];

    const [hotels, setHotels] = useState([]);

    // Fetch list of hotels
    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/hotels/");
                setHotels(response.data);
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };

        if (!hotels.length) fetchHotels();
    }, [hotels]);


    for (let i = 1; i <= 5; i++) {
        photos.push(`images/hotel_rooms_images/room${i}.jpg`);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic (e.g., send data to a server)
        console.log('Form submitted', {name, email, message});
        setSubmitted(true);
    };
    return (
        <React.Fragment>
            {/* Header Section */}
            <header className="header-cardboard text-center">
                <div className="overlay">
                    <img src={logo} alt="My Icon"/>
                </div>
            </header>

            <Container fluid>

                {/* About Section */}

                <div className="about-us-container" style={{paddingTop: 40}}>
                    <h2 className="about-us-title">O nas</h2>
                    <p className="about-us-description">
                        Witaj w sieci Hoteli Weles, liderze w branży hotelarskiej, który od lat dostarcza swoim
                        Gościom niezapomniane doświadczenia, pełne komfortu, luksusu i wyjątkowej atmosfery. Nasza
                        sieć jest synonimem najwyższej jakości usług, profesjonalnej obsługi oraz pełnej dbałości o
                        każdy szczegół, aby Twój pobyt był nie tylko relaksem, ale i przyjemnością, która zostaje w
                        pamięci na długo.</p>
                </div>


                <div className="container_main" style={{maxWidth: 1200, margin: "auto", color: "black"}}>
                    <div className="left-column" style={{padding: 20}}>
                        <h2>Lokalizacja</h2>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                            galley of type and scrambled it to make a type specimen book. It has survived not only five
                            centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                            It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
                            passages, and more recently with desktop publishing software like Aldus PageMaker including
                            versions of Lorem Ipsum.</p>
                    </div>
                    <div className="right-column">
                        <MapContainer center={[51.9194, 19.1451]} zoom={6} style={{height: "500px", width: "100%"}}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                           
                            {hotels.map((hotel) => (
                                <Marker key={hotel.hotel_id} position={[hotel.latitude, hotel.longitude]}>
                                    <Popup>
                                        <h4 style={{borderBottom: "2px solid #000"}}>Hotel
                                            Weles {hotel.localization}</h4>
                                        <StarRating rating={hotel.rating}/>
                                        <p>{hotel.address}, {hotel.localization}</p>


                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>

                <section className="about-us">
                    <div className="about-us-container">
                        <h2 className="about-us-title">Nasza misja</h2>
                        <p className="about-us-description">
                            Wierzymy, że kluczem do sukcesu jest nieustanne dążenie do doskonałości i ciągłe
                            rozwijanie naszych umiejętności. Zawsze stawiamy na wysoką jakość i zadowolenie naszych
                            klientów.Chcemy być liderem w dostarczaniu innowacyjnych rozwiązań, które zmieniają życie
                            naszych
                            klientów. Nasza wizja to przyszłość oparta na zaufaniu, technologii i jakości.
                        </p>
                    </div>
                </section>

                <section id="gallery" className="mb-5"
                         style={{maxWidth: 1000, margin: "auto", backgroundColor: "#1c1c1c"}}>
                    <h2>Nasze hotele</h2>
                    <Carousel>
                        <Carousel.Item>
                            <div className="d-block w-100" style={{position: 'relative'}}>
                                <img
                                    className="d-block w-100"
                                    src="/images/hotel_loc_images/krakow.jpg"
                                    height={500}
                                    alt="Pokój 1"
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                        padding: '10px 20px',
                                        color: 'white',
                                        borderRadius: '5px',
                                    }}
                                >
                                    <h3>Pokój 1</h3>
                                    <p>Luksusowy pokój z widokiem.</p>
                                </div>
                            </div>
                        </Carousel.Item>

                        <Carousel.Item>
                            <div className="d-block w-100" style={{position: 'relative'}}>
                                <img
                                    className="d-block w-100"
                                    src="/images/hotel_loc_images/warszawa.jpg"
                                    alt="Pokój 2"
                                    height={500}
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                        padding: '10px 20px',
                                        color: 'white',
                                        borderRadius: '5px',
                                    }}
                                >
                                    <h3>Pokój 2</h3>
                                    <p>Przytulny i komfortowy.</p>
                                </div>
                            </div>
                        </Carousel.Item>

                        <Carousel.Item>
                            <div className="d-block w-100" style={{position: 'relative'}}>
                                <img
                                    className="d-block w-100"
                                    src="images/hotel_loc_images/zakopane.jpg"
                                    alt="Pokój 3"
                                    height={500}
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: '0',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                        padding: '30px 20px',
                                        color: 'white',
                                        borderRadius: '5px',
                                        width: '100%', // Dodatkowe rozciągnięcie kontenera tekstu na całą szerokość obrazu
                                        textAlign: 'center', // Wyśrodkowanie tekstu
                                        boxSizing: 'border-box', // Uwzględnienie paddingu w szerokości
                                    }}
                                >
                                    <h3>Hotel Weles Zakopane</h3>
                                    <p>Świetny na wspólne zimowe wyjazdy z rodziną i z bliskimi.</p>
                                </div>
                            </div>
                        </Carousel.Item>

                    </Carousel>

                    <div style={{color: 'black', textAlign: 'right', paddingRight: 20, paddingTop: 20}}>
                        <a href="/hotels">Zobacz więcej...</a>
                    </div>
                </section>

                <section id="gallery" className="mb-5"
                         style={{maxWidth: 1600, margin: "auto", backgroundColor: "#1c1c1c"}}>
                    <h2>Galeria</h2>
                    <PhotoCarousel photos={photos}/>
                    <div style={{textAlign: "right", paddingRight: 20, paddingTop: 20}}>
                        <a href={"/gallery"}>Zobacz więcej...</a>
                    </div>
                </section>


                {/* Contact Section */}
                <section id="contact" className="mb-5">
                    <div className="contact-card">
                        <div className="contact-image"/>
                        <div className="contact-form-container">
                            {submitted ? (
                                <div className="thank-you-message" style={{color: "black", textAlign: "center"}}>
                                    <h2>Dziękujemy za wiadomość!</h2>
                                    <p>Odpowiemy tak szybko, jak to możliwe.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="contact-form">
                                    <h2>Skontaktuj się z nami</h2>
                                    <div className="form-group">
                                        <label>Imię:</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email:</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Wiadomość:</label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="submit-button">
                                        Wyślij
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </section>


            </Container>
        </React.Fragment>
    );
};

export default Homepage;