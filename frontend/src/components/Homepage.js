import React from 'react';
import { Container, Navbar, Nav, Row, Col, Card, Form, Button } from 'react-bootstrap';
import './Header.css';

const Homepage = () => {
    document.body.style.backgroundColor = '#ffffff';


    return (
        <Container fluid>

        {/* Header Section */}
        <header className="header-cardboard text-center mb-5">
            <div className="overlay">
                <h1 className="header-title">Witamy w Hotelu</h1>
                <p className="header-subtitle">Najlepsze miejsce na wypoczynek!</p>
            </div>
        </header>

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
          <h2>Kontakt</h2>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Imię i Nazwisko</Form.Label>
              <Form.Control type="text" placeholder="Wpisz swoje imię i nazwisko" required />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Wpisz swój email" required />
            </Form.Group>

            <Form.Group controlId="formMessage">
              <Form.Label>Wiadomość</Form.Label>
              <Form.Control as="textarea" rows={4} placeholder="Napisz swoją wiadomość" required />
            </Form.Group>

            <Button variant="primary" type="submit">
              Wyślij
            </Button>
          </Form>
        </section>

        {/* Footer */}
        <footer className="text-center mt-5">
          <p>&copy; 2024 Hotel. Wszystkie prawa zastrzeżone.</p>
        </footer>
      </Container>
    );
};

export default Homepage;