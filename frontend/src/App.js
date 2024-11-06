import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";

import Homepage from "./components/Homepage/Homepage";
import axios from 'axios'
import {useState, useEffect} from 'react'
import "./Scrollbar.css"

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Nav from "react-bootstrap/Nav";
import CustomerPanel from "./components/CustomerPanel/CustomerPanel";
import OwnerPanel from "./components/OwnerPanel/OwnerPanel";
import ReservationSite from "./components/Reservations/ReservationSite";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";

import hor_logo from './assets/weles_hori_white.png';
import "./components/Registration_Login/LoginForm.css";
import "./components/Registration_Login/RegistrationForm.css";
import ReservationDetails from "./components/ReservationDetails/ReservationDetails";
import UserProfile from "./components/UserProfile/UserProfile";
import ReservationManagement from "./components/ReservationManagement/ReservationManagement";


// AXIOS CONNECTION FOR LOGIN //
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://localhost:3000"
})

// AXIOS CONNECTION FOR LOGIN //

function Root() {

    const [currentUser, setCurrentUser] = useState();
    const [registrationToggle, setRegistrationToggle] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errflag, setErrflag] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user_type] = useState(localStorage.getItem('user_type'));
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

    async function submitRegistration({e}: { e: any }) {
        e.preventDefault();
        client.post(
            "http://127.0.0.1:8000/api/register/",
            {
                email: email,
                username: username,
                password: password,
                user_type: "klient"
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
                if (response.data.user_type === 'właściciel') {
                    navigate('/owner/panel/')
                } else if (response.data.user_type === 'klient') {
                    navigate('/customer/panel/')
                } else if (response.data.user_type === 'recepcjonista') {
                    navigate('/receptionist/panel/')
                } else if (response.data.user_type === 'personel') {
                    navigate('/personel/panel/')
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
            if (response.data.user_type === 'właściciel') {
                navigate('/owner/panel')
            } else if (response.data.user_type === 'klient') {
                navigate('/customer/panel')
            }
        } catch (error) {
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
                {/* Logo */}
                <Navbar.Brand href="http://127.0.0.1:3000/" className="fw-bold">
                    <img src={hor_logo} style={{height: 30, margin: 10}} alt="Logo"/>
                </Navbar.Brand>

                {/* Navbar Toggle */}
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">

                    {/* Navbar Links */}
                    <Nav className="me-auto">
                        {user_type === "klient"?
                        <Nav.Link href="http://127.0.0.1:3000/customer/panel/" className="mx-2 text-uppercase fw-light">
                            Panel
                        </Nav.Link>
                        :
                        <Nav.Link href="http://127.0.0.1:3000/owner/panel/" className="mx-2 text-uppercase fw-light">
                            Panel
                        </Nav.Link>}

                        {user_type === "klient"?
                        <Nav.Link href="http://127.0.0.1:3000/reservation/" className="mx-2 text-uppercase fw-light">
                            Rezerwuj
                        </Nav.Link>
                        : null}


                        {/* Profile Link with Circular Image */}
                        <Nav.Link href="http://127.0.0.1:3000/profile/" className="mx-2 text-uppercase fw-light d-flex align-items-center">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                alt="Profile"
                                className="profile-image"
                                style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 10 }}
                            />
                        </Nav.Link>
                    </Nav>

                    {/* Logout Button */}
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
                                }}
                            >
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
                            <Route path='/profile/' element={<UserProfile/>}/>
                            <Route path='/your_reservation/' element={<ReservationManagement/>}/>
                            <Route path='/reservation/room/:id/' element={<ReservationDetails/>}/>
                        </Routes>
                    </div>
                )}


            </div>
        );
    } else {
        if (loc === "/") {
            return (
                <div>
                    {isLoading ? (
                        <LoadingSpinner/>
                    ) : (
                        <React.Fragment>
                            <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm">
                                <Container>
                                    <Navbar.Brand href="http://127.0.0.1:3000/" className="fw-bold">
                                        <img src={hor_logo} style={{height: 30, margin: 10}}/>
                                    </Navbar.Brand>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
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
                                        </Navbar.Text>
                                    </Navbar.Collapse>
                                </Container>
                            </Navbar>
                            <Routes>
                                <Route path='/' element={<Homepage/>}/>
                            </Routes>
                        </React.Fragment>

                    )}

                </div>
            );
        } else {
            return (
                <div>
                    {isLoading ? (
                        <LoadingSpinner/>
                    ) : (
                        <React.Fragment>
                            <Navbar bg="dark" variant="dark">
                                <Container>
                                    <Navbar.Brand href="http://127.0.0.1:3000/" className="fw-bold">
                                        <img src={hor_logo} style={{height: 30, margin: 10}}/>
                                    </Navbar.Brand>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
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
                                        </Navbar.Text>
                                    </Navbar.Collapse>
                                </Container>
                            </Navbar>
                            {
                                registrationToggle ? (
                                    <div className="registration-container">
                                        <div className="registration-card">
                                            <h2>Rejestracja</h2>
                                            <form onSubmit={e => submitRegistration({e: e})}
                                                  className="registration-form">
                                                <div className="form-group">
                                                    <label>Email:</label>
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={e => setEmail(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Login:</label>
                                                    <input
                                                        type="text"
                                                        value={username}
                                                        onChange={e => setUsername(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Hasło:</label>
                                                    <input
                                                        type="password"
                                                        value={password}
                                                        onChange={e => setPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Powtórz Hasło:</label>
                                                    <input
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <button type="submit" className="registration-button">
                                                    Zarejestruj się
                                                </button>
                                                <div className="social-registration">
                                                    <button className="social-button google">
                                                        <i className="fab fa-google"/> Zarejestruj przez Google
                                                    </button>
                                                    <button className="social-button facebook">
                                                        <i className="fab fa-facebook-f"/> Zarejestruj przez Facebook
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="login-container">
                                        <div className="login-card">
                                            <h2>Logowanie</h2>
                                            <form onSubmit={e => submitLogin({e: e})} className="login-form">
                                                <div className="form-group">
                                                    <label>Email:</label>
                                                    <input
                                                        type="email"
                                                        placeholder="Wpisz email"
                                                        value={email}
                                                        onChange={e => setEmail(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Hasło:</label>
                                                    <input
                                                        type="password"
                                                        placeholder="Wpisz hasło"
                                                        value={password}
                                                        onChange={e => setPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="options">
                                                    <label>
                                                        <input type="checkbox"/>
                                                        Zapamiętaj mnie
                                                    </label>
                                                    <a href="#forgot-password" className="forgot-password-link">Nie
                                                        pamiętam hasła</a>
                                                </div>
                                                <button type="submit" className="login-button">
                                                    Zaloguj się
                                                </button>
                                                <div className="social-login">
                                                    <button className="social-button google">
                                                        <i className="fab fa-google"/> Zaloguj przez Google
                                                    </button>
                                                    <button className="social-button facebook">
                                                        <i className="fab fa-facebook-f"/> Zaloguj przez Facebook
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                        {errflag && (
                                            <div style={{marginBottom: 20}}>
                                                <b style={{color: 'red'}}>
                                                    Wprowadzono błędny email lub hasło. Spróbuj ponownie.
                                                </b>
                                            </div>
                                        )}
                                    </div>
                                )
                            }
                        </React.Fragment>
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
