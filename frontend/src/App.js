import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes, useNavigate, useMatch} from "react-router-dom";

import Homepage from "./components/Homepage/Homepage";
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
import UserReservationsPage from "./components/ReservationHistoryPage/UserReservationPage";
import ManageRoomPricesPage from "./components/OwnerPanel/ManageRoomPricesPage/ManageRoomPricesPage";
import client from "./components/client";
import {API_BASE_URL, WEBSITE_BASE_URL} from "./config";
import PaymentSim from "./components/PaymentSim/PaymentSim";
import HotelGallery from "./components/HotelGallery/HotelGallery";
import Cookies from "js-cookie";
import RoomStatuses from "./components/RoomStatuses/RoomStatuses";
import ReservationsList from "./components/ReceptionistPanel/ReservationsList";
import ReceptionistManageReservation from "./components/ReceptionistPanel/ReceptionistManageReservation";
import ManageRoomPage from "./components/ManageRoomPage/ManageRoomPage";
import HotelCostsAndEarnings from "./components/OwnerPanel/CostEdit/HotelCostsAndEarnings";
import ReservationSearch from "./components/ReservationSearch";

function Root() {

    const [currentUser, setCurrentUser] = useState();
    const [registrationToggle, setRegistrationToggle] = useState(false);
    const [email, setEmail] = useState(null);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [errmess, setErrmess] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user_type, setUserType] = useState("klient");
    const [pp, setPP] = useState(null);
    const navigate = useNavigate()
    const loc = window.location.pathname;
    const [clicked, setClicked] = useState(false);
    const match = useMatch("/reservation/room/");

    const handleClick = () => {
        setClicked(true); // Set clicked state to true on click
    };

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        client.get(`${API_BASE_URL}/user/`)
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
            document.getElementById("targetButton").innerHTML = "Zarejestruj się";
            setRegistrationToggle(false);
        } else {
            document.getElementById("targetButton").innerHTML = "Zaloguj się";
            setRegistrationToggle(true);
        }
    }

    async function submitRegistration({e}: { e: any }) {
        e.preventDefault();

        try {
            // Step 1: Register the user
            await client.post(`${API_BASE_URL}/register/`, {
                email: email,
                username: username,
                password: password,
                user_type: "klient",
                confirmPassword: confirmPassword
            });

            // Step 2: Login the user
            const response = await client.post(`${API_BASE_URL}/login/`, {
                email: email,
                password: password,
            });

            // Extract response data
            const {email: em, username: name, user_type: ut, id: user_id, profile_picture} = response.data;

            // Update localStorage
            localStorage.setItem("email", em);
            localStorage.setItem("username", name);
            localStorage.setItem("user_type", ut);
            localStorage.setItem("user_id", user_id);
            localStorage.setItem("profile_pic", profile_picture);

            // Update state
            setPP(profile_picture);
            setCurrentUser(true);
            setUserType(ut);


            if (response.data.user_type === 'właściciel') {
                navigate('/owner/panel/')
            } else if (response.data.user_type === 'klient') {
                navigate('/customer/panel/')
            } else if (response.data.user_type === 'recepcjonista') {
                navigate('/receptionist/panel/');
            }
        } catch (error) {
            // Handle errors
            if (error.response) {
                // Server responded with a status other than 2xx
                setErrmess(error.response.data.error || "Błąd rejestracji");
            } else if (error.request) {
                // Request was made but no response received
                setErrmess("Brak odpowiedzi z serwera");
            } else {
                // Something else caused the error
                setErrmess(error.message || "Nieznany błąd");
            }
        }
    }


    async function submitLogin({e}: { e: any }) {
        e.preventDefault();

        try {

            // Perform login
            const response = await client.post(
                `${API_BASE_URL}/login/`,
                {
                    email: email,
                    password: password,
                    login: username
                },
            );

            const em = response.data.email;
            const name = response.data.username;
            const ut = response.data.user_type;
            const user_id = response.data.id;
            const profile_pic = response.data.profile_picture
            setPP(profile_pic)
            localStorage.setItem('email', em);
            localStorage.setItem('username', name);
            localStorage.setItem('user_type', ut);
            localStorage.setItem('user_id', user_id);
            localStorage.setItem('profile_pic', response.data.profile_picture);

            setCurrentUser(true);
            setUserType(ut);
            // console.log(response.data.csrftoken)
            // Navigate based on user type
            console.log(Cookies.get("csrftoken"))
            setTimeout(() => {
                if (response.data.user_type === 'właściciel') {
                    navigate('/owner/panel/');
                } else if (response.data.user_type === 'klient') {
                    navigate('/customer/panel/');
                } else if (response.data.user_type === 'recepcjonista') {
                    navigate('/receptionist/panel/');
                }
            }, 100); // Small delay to ensure the browser processes the cookis

        } catch (err) {
            setErrmess("Podaj poprawny login lub hasło.");
            console.error('Login failed:', err.message);
        }
    }


    function submitLogout({e}: { e: any }) {
        e.preventDefault();
        const csrfToken = Cookies.get("csrftoken"); // Extract CSRF token from cookies
        console.log(Cookies.get("csrftoken"))
        if (!csrfToken) {
            console.error("CSRF token not found!");
            return;
        }
        client.post(
            `${API_BASE_URL}/logout/`, {},
            {
                headers: {
                    "X-CSRFToken": csrfToken,
                },
            },
        ).then(function () {
            setCurrentUser(false);
            localStorage.clear();
            navigate('/')
            window.location.reload()
        });
    }


    // Użytkownik zalogowany
    // document.body.style.backgroundColor = "#ffffff";
    if (currentUser) {
        return (
            <div>
                {isLoading ? (
                    <LoadingSpinner/>
                ) : (
                    <div className="fade-in full-height-container">

                        <div className="fade-in full-height-container">
                            <NavbarComponent clicked={clicked} handleClick={handleClick} submitLogout={submitLogout}
                                             profile_pic={pp}/>

                            <Routes>
                                <Route path='/' element={<Homepage/>}/>
                                <Route path='/hotels/' element={<Hotels/>}/>
                                <Route path='/hotelCosts/:id' element={<HotelCostsAndEarnings/>}/>
                                <Route path='/hotel/:id' element={<HotelPage/>}/>
                                <Route path='/customer/panel/' element={<CustomerPanel/>}/>
                                <Route path='/owner/panel/' element={<OwnerPanel/>}/>
                                <Route path='/room/statuses/:id' element={<RoomStatuses/>}/>
                                <Route path='/receptionist/panel/' element={<ReceptionistPanel/>}/>
                                <Route path='/reservation/' element={<ReservationSite/>}/>
                                <Route path='/profile/' element={<UserProfile/>}/>
                                <Route path='/gallery/' element={<GalleryPage/>}/>
                                <Route path='/search/' element={<ReservationSearch/>}/>
                                <Route path='/gallery/:id' element={<HotelGallery/>}/>
                                <Route path='/rooms/prices/' element={<ManageRoomPricesPage/>}/>
                                <Route path='/payment/:id' element={<PaymentSim/>}/>
                                <Route path='/receptionistReservations/:id/' element={<ReservationsList/>}/>
                                <Route path='/userReservations/' element={<UserReservationsPage/>}/>
                                <Route path='/manage_reservation/:id/' element={<ReservationManagement/>}/>
                                <Route path='/manage_room/:id/' element={<ManageRoomPage/>}/>
                                <Route path='/reservation/room/:id/' element={<ReservationDetails/>}/>
                                <Route path='/receptionist/manage/reservation/:id/' element={<ReceptionistManageReservation/>}/>
                            </Routes>
                        </div>
                        <Footer/>
                    </div>
                )}


            </div>
        );
    } else {
        if (loc === "/" || loc === "/gallery" || loc === "/hotels" || loc === "/search"
            || loc === "/reservation" || loc.includes('/reservation/room/') || loc.includes('/manage_reservation/')
            || loc.includes('/payment/') || loc.includes('/hotel/')) {
            return (
                <div>
                    {isLoading ? (
                        <LoadingSpinner/>
                    ) : (
                        <div className="fade-in full-height-container">
                            <Navbar variant="dark" expand="lg" className="shadow-sm"
                                    style={{backgroundColor: "#000001"}}>
                                <Container>
                                    <Navbar.Brand href={`${WEBSITE_BASE_URL}/`} className="fw-bold">
                                        <img src={hor_logo} style={{height: 30, margin: 10}} alt={"image"}/>
                                    </Navbar.Brand>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                                        <Nav className="me-auto align-items-center">
                                                <Nav.Link href={`${WEBSITE_BASE_URL}/hotels`}
                                                          className="mx-2 text-uppercase fw-light">
                                                    Hotele
                                                </Nav.Link>
                                                <Nav.Link href={`${WEBSITE_BASE_URL}/gallery`}
                                                          className="mx-2 text-uppercase fw-light">
                                                    Galeria
                                                </Nav.Link>
                                                <Nav.Link href={`${WEBSITE_BASE_URL}/reservation`}
                                                          className="mx-2 text-uppercase fw-light">
                                                    Rezerwuj
                                                </Nav.Link>
                                                <Nav.Link href={`${WEBSITE_BASE_URL}/search`}
                                                          className="mx-2 text-uppercase fw-light">
                                                    Wyszukaj
                                                </Nav.Link>
                                        </Nav>
                                        <Navbar.Text className={'d-flex justify-content-center'}>
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
                                <Route path='/hotels/' element={<Hotels/>}/>
                                <Route path='/hotel/:id' element={<HotelPage/>}/>
                                <Route path='/payment/:id' element={<PaymentSim/>}/>
                                <Route path='/reservation/' element={<ReservationSite/>}/>
                                <Route path='/reservation/room/:id/' element={<ReservationDetails/>}/>
                                <Route path='/search/' element={<ReservationSearch/>}/>
                                <Route path='/manage_reservation/:id/' element={<ReservationManagement/>}/>
                            </Routes>
                        </div>

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
                        <div className="fade-in full-height-container">
                            <Navbar variant="dark" expand="lg" className="shadow-sm"
                                    style={{backgroundColor: "#000001"}}>
                                <Container>
                                    <Navbar.Brand href={`${WEBSITE_BASE_URL}/`} className="fw-bold">
                                        <img src={hor_logo} style={{height: 30, margin: 10}} alt={"image"}/>
                                    </Navbar.Brand>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                                        {/* Navbar Links */}
                                        <Nav className="me-auto align-items-center">
                                            <Nav.Link
                                                href="/hotels"
                                                className="mx-2 text-uppercase fw-light"
                                                style={{display: "flex", alignItems: "center"}}
                                            >
                                                Hotele
                                            </Nav.Link>
                                            <Nav.Link href="/gallery" className="mx-2 text-uppercase fw-light">
                                                Galeria
                                            </Nav.Link>
                                            <Nav.Link href={`${WEBSITE_BASE_URL}/reservation`}
                                                      className="mx-2 text-uppercase fw-light">
                                                Rezerwuj
                                            </Nav.Link>
                                            <Nav.Link href={`${WEBSITE_BASE_URL}/search`}
                                                      className="mx-2 text-uppercase fw-light">
                                                Wyszukaj
                                            </Nav.Link>

                                        </Nav>
                                        <Navbar.Text
                                            className={'d-flex justify-content-center'}
                                        >
                                            <Button
                                                id="targetButton"
                                                onClick={update_form_btn}
                                                variant="outline-light"
                                                className="px-4 py-2 fw-semibold shadow-sm rounded-pill"
                                                style={{
                                                    transition: "background-color 0.3s ease, color 0.3s ease",
                                                    backgroundColor: clicked ? "#ffffff" : "transparent", // Change background to white on click
                                                    color: clicked ? "#000000" : "#ffffff", // Change text color to black on click
                                                    marginTop: 10,
                                                    marginBottom: 10,
                                                    width: 200,
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
                                                      submitRegistration={submitRegistration} errmess={errmess}/>
                                ) : (
                                    <LoginForm email={email} setEmail={setEmail} password={password}
                                               setPassword={setPassword} submitLogin={submitLogin} errmess={errmess}/>
                                )
                            }
                        </div>
                    )}
                    <Routes>
                        <Route path='/' element={<Homepage/>}/>
                        <Route path='/gallery/' element={<GalleryPage/>}/>
                        <Route path='/hotels/' element={<Hotels/>}/>
                        <Route path='/hotel/:id' element={<HotelPage/>}/>
                        <Route path='/payment/:id' element={<PaymentSim/>}/>
                        <Route path='/reservation/' element={<ReservationSite/>}/>
                        <Route path='/reservation/room/:id/' element={<ReservationDetails/>}/>
                        <Route path='/search/' element={<ReservationSearch/>}/>
                        <Route path='/manage_reservation/:id/' element={<ReservationManagement/>}/>
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
