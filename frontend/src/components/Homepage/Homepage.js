import React, {useState} from 'react';
import {Container, Navbar, Nav, Row, Col, Card, Form, Button, Carousel} from 'react-bootstrap';
import './Header.css';
import logo from '../../assets/weles_white.png';
import PhotoCarousel from "../PhotoCarousel/PhotoCarousel";


const Homepage = () => {
    document.body.style.backgroundColor = '#17120EFF';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
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
            <header className="header-cardboard text-center">
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
    <div className="d-block w-100" style={{ position: 'relative' }}>
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

                    <div style={{color: 'black', textAlign: 'right', paddingRight: 20}}>
                        <a href="/hotels">Zobacz więcej...</a>
                    </div>
                </section>

                <section id="gallery" className="mb-5">
                    <h2>Galeria</h2>
                    <PhotoCarousel photos={photos}/>
                    <div style={{color: "black", textAlign: "right", paddingRight: 20}}>
                        <a href={"/gallery"}>
                            Zobacz więcej...
                        </a>
                    </div>

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