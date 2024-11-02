import React, {useState} from 'react';
import { Container, Navbar, Nav, Row, Col, Card, Form, Button } from 'react-bootstrap';
import './Header.css';
import logo from './assets/weles_white.png';


const Homepage = () => {
    document.body.style.backgroundColor = '#ffffff';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic (e.g., send data to a server)
        console.log('Form submitted', { name, email, message });
    };
    return (
        <Container fluid>

        {/* Header Section */}
        <header className="header-cardboard text-center mb-5">
            <div className="overlay">
                <img src={logo} alt="My Icon" />
            </div>
        </header>


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
        <section id="about" className="mb-5">
          <h2>O Nas</h2>
          <p>
            Nasz hotel oferuje luksusowe pokoje, wyśmienitą kuchnię i wiele atrakcji. Czekamy na Ciebie!
          </p>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="mb-5">
            <h2>Galeria</h2>
            <Row xs={1} md={2} lg={3} className="g-4">
                <Col>
                    <Card>
                        <Card.Img variant="top" src="https://lh3.googleusercontent.com/DTbCvkAUEJUs4tNNRqW0N6w68ENyw9y6GjCr9dsxRFDU1Gv4SBjpY5dm8WlF8G8Acnt5oj5cZRXWDLriA9IwCbDqoo8bJbNcVI3BdAzH720wxj1sQbuAHtTebTgZMY5GHs-uXDWa" />
                        <Card.Body>
                            <Card.Title>Pokój 1</Card.Title>
                            <Card.Text>Luksusowy pokój z widokiem.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Img variant="top" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6egZUirq7hHJ_gNZaLG124bxxgu0rirsFVw&s" />
                        <Card.Body>
                            <Card.Title>Pokój 2</Card.Title>
                            <Card.Text>Przytulny i komfortowy.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Img variant="top" src="https://lubiepodroze.eu/wp-content/uploads/2019/12/Courtyard-by-Marriott-Warsaw-Airport-Sypialnia-w-apartamencie.jpg" />
                        <Card.Body>
                            <Card.Title>Pokój 3</Card.Title>
                            <Card.Text>Stylowy pokój dla par.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-5">
          <div className="contact-card">
            <div className="contact-image" />
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

        {/* Footer */}
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section about">
                    <h3>O nas</h3>
                    <p>
                        Jesteśmy firmą, która dostarcza wysokiej jakości usługi. Naszym celem jest zapewnienie najlepszej obsługi klienta i innowacyjnych rozwiązań.
                    </p>
                </div>

                <div className="footer-section links">
                    <h3>Szybkie linki</h3>
                    <ul>
                        <li><a href="#home">Strona główna</a></li>
                        <li><a href="#about">O nas</a></li>
                        <li><a href="#services">Usługi</a></li>
                        <li><a href="#contact">Kontakt</a></li>
                    </ul>
                </div>

                <div className="footer-section contact">
                    <h3>Kontakt</h3>
                    <p>Email: kontakt@naszafirma.pl</p>
                    <p>Telefon: +48 123 456 789</p>
                </div>

                <div className="footer-section social-media">
                    <h3>Znajdź nas</h3>
                    <div className="social-icons">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2024 Hotel Weles. Wszystkie prawa zastrzeżone.</p>
            </div>
        </footer>
      </Container>
    );
};

export default Homepage;