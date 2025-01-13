import React, {useEffect, useState} from 'react';
import {Container, Carousel} from 'react-bootstrap';
import './Header.css';
import logo from '../../assets/weles_white.png';
import PhotoCarousel from "../PhotoCarousel/PhotoCarousel";
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import StarRating from "../StarRating/StarRating";
import client from "../client";
import {Link} from "react-router-dom";
import {API_BASE_URL, WEBSITE_BASE_URL} from "../../config";

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
                const response = await client.get(`${API_BASE_URL}/hotels/`);
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

                <div className="about-us-container" style={{paddingTop: 30, maxWidth: "1000px",
                        margin: "auto",
                        padding: "25px",
                        borderRadius: "10px",

                        color: "white",}}>
                    <h2 className="about-us-title">O nas</h2>
                    <p className="about-us-description" style={{ textAlign: "justify"}}>
                        Witaj w sieci Hoteli Weles, liderze w branży hotelarskiej, który od lat dostarcza swoim
                        Gościom niezapomniane doświadczenia, pełne komfortu, luksusu i wyjątkowej atmosfery. Nasza
                        sieć jest synonimem najwyższej jakości usług, profesjonalnej obsługi oraz pełnej dbałości o
                        każdy szczegół, aby Twój pobyt był nie tylko relaksem, ale i przyjemnością, która zostaje w
                        pamięci na długo.</p>
                </div>

                <section className="about-us" style={{maxWidth: 1000, marginLeft: "auto", marginRight: "auto",}}>

                        <h2 className="about-us-title" >Nasza misja</h2>
                        <p className="about-us-description" style={{ textAlign: "justify"}}>
                            Wierzymy, że kluczem do sukcesu jest nieustanne dążenie do doskonałości i ciągłe
                            rozwijanie naszych umiejętności. Zawsze stawiamy na wysoką jakość i zadowolenie naszych
                            klientów.Chcemy być liderem w dostarczaniu innowacyjnych rozwiązań, które zmieniają życie
                            naszych
                            klientów. Nasza wizja to przyszłość oparta na zaufaniu, technologii i jakości.
                        </p>

                </section>

                <div
                    style={{
                        maxWidth: "1000px",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",

                        color: "white",
                    }}
                >
                    <div>
                        <MapContainer
                            center={[51.9194, 19.1451]}
                            zoom={6}
                            style={{
                                height: "500px",
                                width: "100%",
                                borderRadius: "10px",
                                overflow: "hidden",
                                marginTop: "20px",
                            }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {hotels.map((hotel) => (
                                <Marker
                                    key={hotel.hotel_id}
                                    position={[hotel.latitude, hotel.longitude]}
                                >
                                    <Popup>
                                        <h4
                                            style={{
                                                borderBottom: "2px solid black",
                                                paddingBottom: "5px",
                                                marginBottom: "5px",
                                                color: "#ff7329",
                                            }}
                                        >
                                            Hotel Weles {hotel.localization}
                                        </h4>
                                        <StarRating rating={hotel.rating}/>
                                        <p style={{fontSize: "14px", color: "black"}}>
                                            {hotel.address}, {hotel.localization}
                                        </p>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>

                        <div style={{marginTop: 30}}>
                            <h2 className="about-us-title" >
                                Lokalizacja
                            </h2>
                            <p className="about-us-description" style={{ textAlign: "justify"}}>
                                Nasza sieć hotelowa oferuje komfortowe noclegi w renomowanych placówkach
                                zlokalizowanych w sercu najpiękniejszych miast w Polsce, w tym w
                                Niewiesz-Kolonia, Warszawie oraz Krakowie. Każdy nasz hotel zapewnia
                                wyjątkową atmosferę, doskonałą obsługę i wygodne warunki, które spełnią
                                oczekiwania nawet najbardziej wymagających gości. Zapraszamy do
                                skorzystania z naszych usług i doświadczenia niezapomnianych chwil w
                                naszych obiektach.
                            </p>{/**/}
                        </div>

                    </div>
                </div>

                <section id="gallery" className="mb-5 about-us"
                         style={{maxWidth: 1000, margin: "auto", backgroundColor: "#2a262e"}}>
                    <h2 className="about-us-title" >Nasze hotele</h2>
                    <Carousel>
                        <Carousel.Item>
                            <div className="d-block w-100" style={{position: 'relative'}}>
                                <a href={`${WEBSITE_BASE_URL}/hotel/1`}>
                                    <img
                                        className="d-block w-100"
                                        src="/images/hotel_loc_images/krakow.jpg"
                                        height={500}
                                        alt="Pokój 1"
                                    />
                                </a>

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
                                    <h3>Hotel Weles Kraków</h3>
                                    <p>Blisko krakowskiego smoka i królewskich szlaków.</p>
                                </div>
                            </div>
                        </Carousel.Item>

                        <Carousel.Item>
                            <div className="d-block w-100" style={{position: 'relative'}}>
                                <a href={`${WEBSITE_BASE_URL}/hotel/2`}>
                                    <img
                                        className="d-block w-100"
                                        src="/images/hotel_loc_images/warszawa.jpg"
                                        alt="Pokój 2"
                                        height={500}
                                    />
                                </a>
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
                                    <h3>Hotel Weles Warszawa</h3>
                                    <p>Wyjazd do stolicy? W Weles zapewniamy najwyższy komfort i wygodę.</p>
                                </div>
                            </div>
                        </Carousel.Item>

                        <Carousel.Item>
                            <div className="d-block w-100" style={{position: 'relative'}}>
                                <a href={`${WEBSITE_BASE_URL}/hotel/3`}>
                                    <img
                                        className="d-block w-100"
                                        src="images/hotel_loc_images/zakopane.jpg"
                                        alt="Pokój 3"
                                        height={500}
                                    />
                                </a>
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

                <section id="gallery" className="mb-5 "
                         style={{maxWidth: 1000,padding: 20, margin: "auto", backgroundColor: "#17120e"}}>
                    <h2 className="about-us-title">Galeria</h2>
                    <PhotoCarousel photos={photos}/>
                    <div style={{textAlign: "right", paddingRight: 20, paddingTop: 20}}>
                        <a href={"/gallery"}>Zobacz więcej...</a>
                    </div>
                </section>


                {/* Contact Section */}
                <section id="contact" className="mb-5" style={{maxWidth: 1000, margin: "auto", backgroundColor: "#17120e"}}>
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
                                    <div style={{ margin: "auto", textAlign: "center"}}>
                                        <button type="submit" className="submit-button" style={{ backgroundColor: "#ff7329", color: "black", width: 200}}>
                                            Wyślij
                                        </button>
                                    </div>

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