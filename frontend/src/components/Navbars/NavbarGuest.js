import React from 'react';
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import hor_logo from "../../assets/weles_hori_white.png";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import RegistrationForm from "../Registration_Login/RegistrationForm";
import LoginForm from "../Registration_Login/LoginForm";
import {WEBSITE_BASE_URL} from "../../config";

function NavbarGuest({
                         clicked,
                         handleClick,
                         update_form_btn,
                         email,
                         setEmail,
                         username,
                         setUsername,
                         password,
                         setPassword,
                         confirmPassword
                     }, setConfirmPassword, submitRegistration, errflag, submitLogin, registrationToggle, loc) {
    return (
        <div>
            <Navbar variant="dark" expand="lg" className="shadow-sm" style={{backgroundColor: "#000001"}}>
                <Container>
                    <Navbar.Brand href={`${WEBSITE_BASE_URL}/`} className="fw-bold">
                        <img src={hor_logo} style={{height: 30, margin: 10}}/>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">

                        {loc === "/" ?
                            <Nav className="me-auto align-items-center">
                                <Nav.Link href="#about" className="mx-2 text-uppercase fw-light">
                                    Nasze hotele
                                </Nav.Link>
                                <Nav.Link href="#gallery" className="mx-2 text-uppercase fw-light">
                                    Galeria
                                </Nav.Link>
                                <Nav.Link href="#contact" className="mx-2 text-uppercase fw-light">
                                    Rezerwuj
                                </Nav.Link>
                                <Nav.Link href="#about" className="mx-2 text-uppercase fw-light">
                                    Kontakt
                                </Nav.Link>
                            </Nav> : null
                        }

                        <Navbar.Text className={'d-flex justify-content-center'}>
                            {loc !== "/" ? (
                                <Button href="/login"
                                        id="form_btn"
                                        variant="outline-light"
                                        onClick={handleClick}
                                        className="px-4 py-2 fw-semibold shadow-sm rounded-pill"
                                        style={{
                                            transition: "background-color 0.3s ease, color 0.3s ease",
                                            backgroundColor: clicked ? "#ffffff" : "transparent", // Change background to white on click
                                            color: clicked ? "#000000" : "#ffffff", // Change text color to black on click
                                            marginTop: 10, marginBottom: 10, width: 200
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = "#ffffff"; // Change background to white
                                            e.target.style.color = "#000000"; // Change text color to black on hover
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = "transparent"; // Revert background to transparent
                                            e.target.style.color = "#ffffff"; // Revert text color to white on leave
                                        }}>
                                    Zaloguj się
                                </Button>
                            ) : (
                                <Button
                                    id="form_btn"
                                    onClick={update_form_btn}
                                    variant="outline-light"
                                    className="px-4 py-2 fw-semibold shadow-sm rounded-pill"
                                    style={{
                                        transition: "background-color 0.3s ease, color 0.3s ease",
                                        backgroundColor: clicked ? "#ffffff" : "transparent", // Change background to white on click
                                        color: clicked ? "#000000" : "#ffffff", // Change text color to black on click
                                        marginTop: 10, marginBottom: 10, width: 200
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = "#ffffff"; // Change background to white
                                        e.target.style.color = "#000000"; // Change text color to black on hover
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = "transparent"; // Revert background to transparent
                                        e.target.style.color = "#ffffff"; // Revert text color to white on leave
                                    }}>
                                    Zarejestruj się
                                </Button>
                            )}

                        </Navbar.Text>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {
                registrationToggle && loc !== "/" ? (
                    <RegistrationForm email={email} setEmail={setEmail} username={username}
                                      setUsername={setUsername} password={password}
                                      setPassword={setPassword}
                                      confirmPassword={confirmPassword}
                                      setConfirmPassword={setConfirmPassword}
                                      submitRegistration={submitRegistration}/>
                ) : (
                    <LoginForm email={email} setEmail={setEmail} password={password}
                               setPassword={setPassword} submitLogin={submitLogin} errflag={errflag}/>
                )
            }
        </div>
    );
}

export default NavbarGuest;