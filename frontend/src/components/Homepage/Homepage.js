import React, {useState} from 'react';
import {Container, Navbar, Nav, Row, Col, Card, Form, Button} from 'react-bootstrap';
import './Header.css';
import logo from '../../assets/weles_white.png';
import PhotoCarousel from "../PhotoCarousel/PhotoCarousel";
import Footer from "../Footer/Footer";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {Icon} from "leaflet/dist/leaflet-src.esm";


const Homepage = () => {
    document.body.style.backgroundColor = '#ffffff';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const positions = [
        { name: 'Kraków', lat: 50.0647, lng: 19.9450 },
        { name: 'Warszawa', lat: 52.2298, lng: 21.0118 },
        { name: 'Poznań', lat: 52.4084, lng: 16.9342 },
      ];
    const photos = [];

    for (let i = 1; i <= 5; i++) {

        photos.push(`images/hotel_rooms_images/room${i}.jpg`);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic (e.g., send data to a server)
        console.log('Form submitted', {name, email, message});
    };
    return (
        <React.Fragment>

            {/* Header Section */}
            <header className="header-cardboard text-center mb-5">
                <div className="overlay">
                    <img src={logo} alt="My Icon"/>
                </div>
            </header>

            <Container fluid>
                <div className="container_main">
                    <div className="left-column">
                        <h2>Left Column</h2>
                        <p>This is the left side where you can place content.</p>
                    </div>
                    <div className="right-column">
                        <h2>Right Column</h2>
                        <p>This is the right side where you can place content.</p>
                    </div>
                </div>

                {/* About Section */}

                <section className="about-us">
                    <div className="about-us-container">
                        <h2 className="about-us-title">O nas</h2>
                        <p className="about-us-description">
                            Witaj w sieci Hoteli Weles, liderze w branży hotelarskiej, który od lat dostarcza swoim
                            Gościom niezapomniane doświadczenia, pełne komfortu, luksusu i wyjątkowej atmosfery. Nasza
                            sieć jest synonimem najwyższej jakości usług, profesjonalnej obsługi oraz pełnej dbałości o
                            każdy szczegół, aby Twój pobyt był nie tylko relaksem, ale i przyjemnością, która zostaje w
                            pamięci na długo.</p>

                        <div className="about-us-team">
                            <h3>Nasza misja</h3>
                            <p>
                                Wierzymy, że kluczem do sukcesu jest nieustanne dążenie do doskonałości i ciągłe
                                rozwijanie naszych umiejętności. Zawsze stawiamy na wysoką jakość i zadowolenie naszych
                                klientów.
                            </p>
                        </div>
                        <div className="about-us-vision">
                            <h3>Nasza wizja</h3>
                            <p>
                                Chcemy być liderem w dostarczaniu innowacyjnych rozwiązań, które zmieniają życie naszych
                                klientów. Nasza wizja to przyszłość oparta na zaufaniu, technologii i jakości.
                            </p>
                        </div>


                    </div>
                </section>

                <section id="gallery" className="mb-5">
                    <h2>Nasze hotele</h2>
                    <Row xs={1} md={2} lg={3} className="g-4">
                        <Col>
                            <Card>
                                <Card.Img variant="top"
                                          src="https://lh3.googleusercontent.com/DTbCvkAUEJUs4tNNRqW0N6w68ENyw9y6GjCr9dsxRFDU1Gv4SBjpY5dm8WlF8G8Acnt5oj5cZRXWDLriA9IwCbDqoo8bJbNcVI3BdAzH720wxj1sQbuAHtTebTgZMY5GHs-uXDWa"/>
                                <Card.Body>
                                    <Card.Title>Pokój 1</Card.Title>
                                    <Card.Text>Luksusowy pokój z widokiem.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <Card.Img variant="top"
                                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6egZUirq7hHJ_gNZaLG124bxxgu0rirsFVw&s"/>
                                <Card.Body>
                                    <Card.Title>Pokój 2</Card.Title>
                                    <Card.Text>Przytulny i komfortowy.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <Card.Img variant="top"
                                          src="https://lubiepodroze.eu/wp-content/uploads/2019/12/Courtyard-by-Marriott-Warsaw-Airport-Sypialnia-w-apartamencie.jpg"/>
                                <Card.Body>
                                    <Card.Title>Pokój 3</Card.Title>
                                    <Card.Text>Stylowy pokój dla par.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <div style={{color: "black", textAlign: "right", paddingRight: 20}}>
                            <a href={"/gallery"}>
                                Zobacz więcej...
                            </a>

                        </div>
                    </Row>
                </section>

                <section id="gallery" className="mb-5">
                    <h2>Galeria</h2>
                    <PhotoCarousel photos={photos}/>
                </section>

                {/* Contact Section */}
                <section id="contact" className="mb-5">
                    <div className="contact-card">
                        <div className="contact-image"/>
                        <div className="contact-form-container">
                            <h2>Skontaktuj się z nami</h2>
                            <form onSubmit={handleSubmit} className="contact-form">
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
                        </div>
                    </div>
                </section>


            </Container>
        </React.Fragment>
    );
};

export default Homepage;