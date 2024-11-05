import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import hor_logo from '../assets/weles_hori_white.png';

const AppNavbar = ({ user_type, handleLogout, handleClick, clicked }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <Navbar.Brand href="/">
          <img src={hor_logo} alt="Logo" style={{ height: 30, margin: 10 }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav className="me-auto">
            {user_type && (
              <Nav.Link href={user_type === 'klient' ? '/customer/panel/' : '/owner/panel/'}>
                User Panel
              </Nav.Link>
            )}
          </Nav>
          <Navbar.Text>
            <Button
              onClick={handleLogout}
              className="px-4 py-2"
              variant="outline-light"
              onMouseEnter={(e) => { /* handle hover */ }}
              onMouseLeave={(e) => { /* handle leave */ }}
            >
              Wyloguj się
            </Button>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
