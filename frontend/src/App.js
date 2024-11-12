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
import LoginForm from "./components/Registration_Login/LoginForm";
import RegistrationForm from "./components/Registration_Login/RegistrationForm";
import NavbarComponent from "./components/Navbars/NavbarComponent";
import Footer from "./components/Footer/Footer";
import Hotels from "./components/Hotels/Hotels";
import HotelPage from "./components/HotelPage/HotelPage";
import GalleryPage from "./components/GalleryPage/GalleryPage";
import ReceptionistPanel from "./components/ReceptionistPanel/ReceptionistPanel";


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
    const [email, setEmail] = useState('nan');
    const [username, setUsername] = useState('nan');
    const [password, setPassword] = useState('nan');
    const [errflag, setErrflag] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user_type,setUserType] = useState("klient");
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
                setUserType(ut);
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
            setUserType(ut);
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
                    <div className="fade-in full-height-container">
                        <NavbarComponent clicked={clicked} handleClick={handleClick} submitLogout={submitLogout}/>

                        <div>
                            <Routes>
                                <Route path='/' element={<Homepage/>}/>
                                <Route path='/hotels/' element={<Hotels/>}/>
                                <Route path='/hotel/:id' element={<HotelPage/>}/>
                                <Route path='/customer/panel/' element={<CustomerPanel/>}/>
                                <Route path='/owner/panel/' element={<OwnerPanel/>}/>
                                <Route path='/receptionist/panel/' element={<ReceptionistPanel/>}/>
                                <Route path='/reservation/' element={<ReservationSite/>}/>
                                <Route path='/profile/' element={<UserProfile/>}/>
                                <Route path='/gallery/' element={<GalleryPage/>}/>
                                <Route path='/your_reservation/' element={<ReservationManagement/>}/>
                                <Route path='/reservation/room/:id/' element={<ReservationDetails/>}/>
                            </Routes>
                        </div>


                        <Footer/>
                    </div>
                )}


            </div>
        );
    } else {
        if (loc === "/" || loc === "/gallery" || loc === "/hotels") {
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
                                <Route path='/gallery/' element={<GalleryPage/>}/>
                            </Routes>
                        </React.Fragment>

                    )}
                    <Footer/>
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
                        </React.Fragment>
                    )}
                    <Routes>
                        <Route path='/' element={<Homepage/>}/>
                        <Route path='/gallery/' element={<GalleryPage/>}/>
                    </Routes>
                    <Footer/>
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
