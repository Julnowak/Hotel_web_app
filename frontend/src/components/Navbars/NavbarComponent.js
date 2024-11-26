import React, {useState} from 'react';
import {Navbar, Container, Nav, Button} from 'react-bootstrap';
import hor_logo from '../../assets/weles_hori_white.png';


const NavbarComponent = ({clicked, handleClick, submitLogout, profile_pic}) => {

    const [user_type, setUserType] = useState(localStorage.getItem("user_type"));

    return (
        <Navbar variant="dark" expand="lg" className="shadow-sm" style={{backgroundColor: "#17120EFF"}}>
            <Container>
                {/* Logo */}
                <Navbar.Brand href="http://127.0.0.1:3000/" className="fw-bold">
                    <img src={hor_logo} style={{height: 30, margin: 10}} alt="Logo"/>
                </Navbar.Brand>

                {/* Navbar Toggle */}
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    {/* Navbar Links */}

                    <Nav className="me-auto">
                    <Nav.Link href="/hotels" className="mx-2 text-uppercase fw-light">
                        Hotele
                    </Nav.Link>
                    <Nav.Link href="/gallery" className="mx-2 text-uppercase fw-light">
                        Galeria
                    </Nav.Link>
                        {user_type === "klient" ? (
                            <Nav.Link href="http://127.0.0.1:3000/customer/panel/"
                                      className="mx-2 text-uppercase fw-light">Panel</Nav.Link>
                        ) : (
                            <Nav.Link href="http://127.0.0.1:3000/owner/panel/"
                                      className="mx-2 text-uppercase fw-light">Panel</Nav.Link>
                        )}

                        {user_type === "klient" ? (
                                <div>
                                    <Nav.Link href="http://127.0.0.1:3000/reservation/"
                                              className="mx-2 text-uppercase fw-light">Rezerwuj</Nav.Link>
                                </div>
                            ) :
                            null
                        }

                        {/* Profile Link with Circular Image */}
                        <Nav.Link href="http://127.0.0.1:3000/profile/"
                                  className="mx-2 text-uppercase fw-light d-flex align-items-center">
                            <img src={"https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png"} alt="Profile"
                                 className="profile-image"
                                 style={{width: 32, height: 32, borderRadius: '50%', marginRight: 10}}/>
                        </Nav.Link>
                    </Nav>

                    {/* Logout Button */}
                    <Navbar.Text>
                        <form onSubmit={e => submitLogout({e})}>
                            <Button
                                id="form_btn"
                                type="submit"
                                variant="outline-light"
                                onClick={handleClick}
                                className="px-4 py-2 fw-semibold shadow-sm rounded-pill"
                                style={{
                                    transition: "background-color 0.3s ease, color 0.3s ease",
                                    marginTop: 10,
                                    marginBottom: 10
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = "#ffffff";
                                    e.target.style.color = "#000000";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = "transparent";
                                    e.target.style.color = "#ffffff";
                                }}
                            >
                                Wyloguj się
                            </Button>
                        </form>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
