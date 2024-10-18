import React from 'react';
import { Container, Navbar, Nav, Row, Col, Card, Form, Button } from 'react-bootstrap';

const Homepage = () => {
    document.body.style.backgroundColor = '#767676';


    return (
        <Container fluid>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#home">Hotel</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#about">O Nas</Nav.Link>
              <Nav.Link href="#gallery">Galeria</Nav.Link>
              <Nav.Link href="#contact">Kontakt</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Header Section */}
      <header className="text-center mb-5">
        <h1>Witamy w Hotelu</h1>
        <p>Najlepsze miejsce na wypoczynek!</p>
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
              <Card.Img variant="top" src="https://source.unsplash.com/400x300/?hotel" />
              <Card.Body>
                <Card.Title>Pokój 1</Card.Title>
                <Card.Text>Luksusowy pokój z widokiem.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Img variant="top" src="https://source.unsplash.com/401x300/?hotel" />
              <Card.Body>
                <Card.Title>Pokój 2</Card.Title>
                <Card.Text>Przytulny i komfortowy.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Img variant="top" src="https://source.unsplash.com/402x300/?hotel" />
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