import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";

import Homepage from "./components/Homepage";
import axios from 'axios'
import {useState, useEffect} from 'react'
import "./Scrollbar.css"

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from "react-bootstrap/Nav";
import CustomerPanel from "./components/CustomerPanel";
import OwnerPanel from "./components/OwnerPanel";
import ReservationSite from "./components/ReservationSite";
import RoomReservation from "./components/RoomResservation";


axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://localhost:3000"
})


function Root() {

    const [currentUser, setCurrentUser] = useState();
    const [registrationToggle, setRegistrationToggle] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errflag, setErrflag] = useState(false);
    const [user_type, setUserType] = useState(localStorage.getItem('user_type'));
    const navigate = useNavigate()
    const loc = window.location.pathname;
    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
        setClicked(true); // Set clicked state to true on click
    };

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
            client.get("http://127.0.0.1:8000/api/user/")
            .then(function () {
                setCurrentUser(true);
            })
            .catch(function () {
                setCurrentUser(false);
            });

        return () => clearTimeout(timer);
    }, []);

    function update_form_btn() {
        if (registrationToggle) {
            document.getElementById("form_btn").innerHTML = "Zarejestruj się";
            setRegistrationToggle(false);
        } else {
            document.getElementById("form_btn").innerHTML = "Zaloguj się";
            setRegistrationToggle(true);
        }
    }

    function submitRegistration(e: any) {
        e.preventDefault();
        client.post(
            "http://127.0.0.1:8000/api/register/",
            {
                email: email,
                username: username,
                password: password,
                user_type: user_type
            }
        ).then(async function () {
            try {
                const [response] = await Promise.all([client.post(
                    "http://127.0.0.1:8000/api/login/",
                    {
                        email: email,
                        password: password
                    })])

                setErrflag(false);
                const em = response.data.email;
                const name = response.data.username;
                const ut = response.data.user_type;
                const user_id = response.data.id;

                localStorage.setItem('email', em);
                localStorage.setItem('username', name);
                localStorage.setItem('user_type', ut);
                localStorage.setItem('user_id', user_id);

                setCurrentUser(true);
                console.log(user_type)
                if (response.data.user_type === 'producent') {
                    navigate('/owner/panel/')
                } else if (response.data.user_type === 'klient') {
                    navigate('/client/panel/')
                }

            } catch (error) {
                setErrflag(true);
                console.error('Login failed:', error);// Login failed
            }

        });

    }

    async function submitLogin({e}: { e: any }) {
        e.preventDefault();

        try {
        const response = await client.post(
        "http://127.0.0.1:8000/api/login/",
        {
            email: email,
            password: password
        })

        setErrflag(false);
        const em = response.data.email;
        const name = response.data.username;
        const ut = response.data.user_type;
        const user_id = response.data.id;

        localStorage.setItem('email', em);
        localStorage.setItem('username', name);
        localStorage.setItem('user_type', ut);
        localStorage.setItem('user_id', user_id);

        setCurrentUser(true);
        console.log(response.data.user_type)
        if (response.data.user_type === 'producent') {
            navigate('/owner/panel')
        } else if (response.data.user_type === 'klient') {
            navigate('/customer/panel')
        }}
        catch (error) {
            setErrflag(true);
            console.error('Login failed:', error);// Login failed
        }
    }


    function submitLogout({e}: { e: any }) {
        e.preventDefault();
        client.post(
            "http://127.0.0.1:8000/api/logout/",
            {withCredentials: true}
        ).then(function () {
            setCurrentUser(false);
            localStorage.clear();
            navigate('/')
            window.location.reload()
        });
    }

    function LoadingSpinner() {
        document.body.style.backgroundColor = "#323232";
        return <div className="fade-in">
            <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
                <div className="spinner-border text-primary" style={{width: '5rem', height: '5rem'}} role="status">
                    <span className="visually-hidden"/>
                </div>
            </div>
        </div>;
    }

    // Użytkownik zalogowany
    document.body.style.backgroundColor = "#ffffff";
    if (currentUser) {
        return (
            <div>
                {isLoading ? (
                    <LoadingSpinner/>
                ) : (
                    <div className="fade-in">
                        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm">
                            <Container>
                                <Navbar.Brand href="http://127.0.0.1:3000/" className="fw-bold">
                                    HOME
                                </Navbar.Brand>

                                <Navbar.Brand
                                    href={'klient' === user_type ? "http://127.0.0.1:3000/customer/panel/" : "http://127.0.0.1:3000/owner/panel/"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                                         className="bi bi-person"
                                         viewBox="0 0 16 16">
                                        <path
                                            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                                    </svg>
                                </Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                                    <Nav className="me-auto">
                                        <Nav.Link href="/reservation" className="mx-2 text-uppercase fw-light">
                                            Rezerwuj
                                        </Nav.Link>
                                    </Nav>
                                    <Navbar.Text>
                                        <form onSubmit={e => submitLogout({e: e})}>
                                        <Button
                                            id="form_btn"
                                            type="submit"
                                            variant="outline-light"
                                            onClick={handleClick}
                                            className="px-4 py-2 fw-semibold shadow-sm rounded-pill"
                                            style={{
                                                transition: "background-color 0.3s ease, color 0.3s ease",
                                                marginTop: 10, marginBottom: 10
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = "#ffffff"; // Change background to white
                                                e.target.style.color = "#000000"; // Change text color to black on hover
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = "transparent"; // Revert background to transparent
                                                e.target.style.color = "#ffffff"; // Revert text color to white on leave
                                            }}>
                                            Wyloguj się
                                        </Button>
                                        </form>
                                    </Navbar.Text>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>


                        <Routes>
                            <Route path='/' element={<Homepage/>}/>
                            <Route path='/customer/panel/' element={<CustomerPanel/>}/>
                            <Route path='/owner/panel/' element={<OwnerPanel/>}/>
                            <Route path='/reservation/' element={<ReservationSite/>}/>
                            <Route path='/room/' element={<RoomReservation/>}/>
                            {/*<Route path='/products_view' element={<Main/>}/>*/}
                        </Routes>
                    </div>
                )}


            </div>
        );
    } else {
        if (loc == "/") {
            return (
            <div>
                {isLoading ? (
                    <LoadingSpinner/>
                ) : (
                    <div>
                        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm">
                            <Container>
                                <Navbar.Brand href="http://127.0.0.1:3000/" className="fw-bold">
                                    HOME
                                </Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                                    <Nav className="me-auto">
                                        <Nav.Link href="#about" className="mx-2 text-uppercase fw-light">
                                            O Nas
                                        </Nav.Link>
                                        <Nav.Link href="#gallery" className="mx-2 text-uppercase fw-light">
                                            Galeria
                                        </Nav.Link>
                                        <Nav.Link href="#contact" className="mx-2 text-uppercase fw-light">
                                            Kontakt
                                        </Nav.Link>
                                    </Nav>
                                    <Navbar.Text>
                                        <Button href="/login"
                                            id="form_btn"
                                            variant="outline-light"
                                            onClick={handleClick}
                                            className="px-4 py-2 fw-semibold shadow-sm rounded-pill"
                                            style={{
                                                transition: "background-color 0.3s ease, color 0.3s ease",
                                                backgroundColor: clicked ? "#ffffff" : "transparent", // Change background to white on click
                                                color: clicked ? "#000000" : "#ffffff", // Change text color to black on click
                                                marginTop: 10, marginBottom: 10
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
                                    </Navbar.Text>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>
                    </div>
                )}
            <Routes>
                <Route path='/' element={<Homepage/>}/>
            </Routes>
            </div>
        );
        }
        else{
        return (
            <div>
                {isLoading ? (
                    <LoadingSpinner/>
                ) : (
                    <div>
                        <Navbar bg="dark" variant="dark">
                            <Container>
                                <Navbar.Brand href="http://127.0.0.1:3000/" className="fw-bold">
                                    HOME
                                </Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                                    <Navbar.Text>
                                        <Button
                                            id="form_btn"
                                            onClick={update_form_btn}
                                            variant="outline-light"
                                            className="px-4 py-2 fw-semibold shadow-sm rounded-pill"
                                            style={{
                                                transition: "background-color 0.3s ease, color 0.3s ease",
                                                backgroundColor: clicked ? "#ffffff" : "transparent", // Change background to white on click
                                                color: clicked ? "#000000" : "#ffffff", // Change text color to black on click
                                                marginTop: 10, marginBottom: 10
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
                                    </Navbar.Text>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>
                        {
                            registrationToggle ? (
                                <div className="center" style={{width: 300, margin: '50px auto '}}>
                                    <h1 style={{textAlign: 'center'}}>Rejestracja</h1>
                                    <Form onSubmit={e => submitRegistration({e: e})}>
                                        <Form.Group className="mb-3" controlId="formBasicUsername">
                                            <Form.Label style={{marginTop: 20}}>Wybierz typ użytkownika:</Form.Label>
                                            <Form.Check label='Producent' type="radio" name='user_type'
                                                        onChange={() => setUserType('producent')} defaultChecked/>
                                            <Form.Check label='Klient' type="radio" name='user_type'
                                                        onChange={() => setUserType('klient')}/>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Adres email:</Form.Label>
                                            <Form.Control style={{borderColor: "black"}} type="email"
                                                          placeholder="Enter email" value={email}
                                                          onChange={e => setEmail(e.target.value)}/>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formBasicUsername">
                                            <Form.Label>Login</Form.Label>
                                            <Form.Control style={{borderColor: "black"}} type="text"
                                                          placeholder="Enter username" value={username}
                                                          onChange={e => setUsername(e.target.value)}/>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                            <Form.Label>Hasło</Form.Label>
                                            <Form.Control style={{borderColor: "black"}} type="password"
                                                          placeholder="Password" value={password}
                                                          onChange={e => setPassword(e.target.value)}/>
                                        </Form.Group>
                                        <Button variant="dark" type="submit">
                                            Zarejestruj
                                        </Button>
                                    </Form>
                                </div>
                            ) : (
                                <div className="login-background">
            <div className="login-overlay center">
                <h1 className="login-title">Logowanie</h1>
                <Form onSubmit={e => submitLogin({ e: e })}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Adres email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Wpisz email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Hasło</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Wpisz hasło"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    {errflag && (
                        <div style={{ marginBottom: 20 }}>
                            <b style={{ color: 'red' }}>
                                Wprowadzono błędny email lub hasło. Spróbuj ponownie.
                            </b>
                        </div>
                    )}
                    <Button variant="dark" type="submit" className="submit-btn">
                        Zaloguj
                    </Button>
                </Form>
            </div>
        </div>
                            )
                        }
                    </div>
                )}
            <Routes>
                <Route path='/' element={<Homepage/>}/>
            </Routes>
            </div>
        );
        }
    }
}

function App() {
  return (
        <BrowserRouter>
            <Root/>
        </BrowserRouter>
    );
}

export default App;