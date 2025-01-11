import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import "./ReservationDetails.css";
import client from "../client";
import {API_BASE_URL} from "../../config";

const ReservationDetails = () => {
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hotel, setHotel] = useState(null);
    const [hotelEmail, setHotelEmail] = useState(null);
    const [hotelAddress, setHotelAddress] = useState(null);
    const [hotelTelephone, setHotelTelephone] = useState(null);
    const [hotelPeopleCapacity, setHotelPeopleCapacity] = useState(null);
    const [deposit, setDeposit] = useState(0);
    const [error, setError] = useState(null);
    const [errorFields, setErrorFields] = useState({
        consent: false,
        termsAccepted: false,
    });
    const [paymentOption, setPaymentOption] = useState('deposit');
    const params = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const checkIn = queryParams.get('checkIn');
    const checkOut = queryParams.get('checkOut');

    const navigate = useNavigate();


    const [additions, setAdditions] = useState({
        breakfast: false,
        parking: false,
        wifi: true,
    });

    const handleOptionSelection = (service, value) => {
        setAdditions((prev) => ({...prev, [service]: value}));
    };

    const handleOptionSelection2 = (option) => {
        setPaymentOption(option);
    };

    const [formData, setFormData] = useState({
        consent: false,
        termsAccepted: false,
    });

    const handleChange = (e) => {
        const {name, checked} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: checked,
        }));
    };

    useEffect(() => {
        client.get(`${API_BASE_URL}/newReservation/${params.id}/`, {
            params: {checkIn, checkOut}
        })
            .then(response => {
                setReservation(response.data);
                setDeposit(response.data.deposit);
                setHotel(response.data.hotel);
                setHotelEmail(response.data.hotel_email)
                setHotelAddress(response.data.adres)
                setHotelTelephone(response.data.hotel_telephone)
                setHotelPeopleCapacity(response.data.people_capacity)
                setLoading(false);
            })
            .catch(err => {
                setError('Error fetching reservation details');
                setLoading(false);
            });
    }, [checkIn, checkOut, params.id]);

    const handleConfirm = () => {
        const errors = {
            consent: !formData.consent,
            termsAccepted: !formData.termsAccepted,
        };

        if (errors.consent || errors.termsAccepted) {
            setError('Musisz zaakceptować regulamin i wyrazić zgodę na przetwarzanie danych osobowych.');
            setErrorFields(errors);
            return;
        }

        // Resetowanie błędów po udanej walidacji
        setError('');
        setErrorFields({consent: false, termsAccepted: false});

        client.post(`${API_BASE_URL}/newReservation/${params.id}/`, {
            checkIn,
            checkOut,
            peopleNumber: reservation.people_number,
            additions: additions,
            paymentOption: paymentOption,
        }, {
            headers: {
                'X-CSRFToken': document.cookie
                    .split('; ')
                    .find(row => row.startsWith('csrftoken'))
                    ?.split('=')[1],
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                navigate(`/payment/${response.data.reservation_id}`);
            })
            .catch(() => {
                setError('Save failed');
            });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="reservation-details">
            <div className="reservation-columns">
                {/* Left column */}
                <div className="reservation-column">
                    <div className="room-image-container">
                        <img src={`/images/hotel_rooms_images/room_${reservation.room_type}.jpg`} alt="Room"
                             className="room-image"/>
                    </div>

                    <div className="hotel-info">
                        <h2>Informacje o hotelu</h2>
                        <p><strong>Nazwa hotelu:</strong> {hotel}</p>
                        <p><strong>Adres:</strong> {hotelAddress}</p>
                        <p><strong>Telefon:</strong> {hotelTelephone}</p>
                        <p><strong>Email:</strong> {hotelEmail}</p>
                    </div>


                    {/* Karta z dodatkowymi usługami */}
                    <div className="hotel-info">
                        <h2>Dodatkowe usługi</h2>
                        <ul>
                            {/* Śniadanie */}
                            <li
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "40px auto 80px 80px",
                                    marginTop: 20,
                                    marginBottom: 20,
                                    alignItems: "center",
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                                     className="bi bi-cup-hot-fill" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd"
                                          d="M.5 6a.5.5 0 0 0-.488.608l1.652 7.434A2.5 2.5 0 0 0 4.104 16h5.792a2.5 2.5 0 0 0 2.44-1.958l.131-.59a3 3 0 0 0 1.3-5.854l.221-.99A.5.5 0 0 0 13.5 6zM13 12.5a2 2 0 0 1-.316-.025l.867-3.898A2.001 2.001 0 0 1 13 12.5"/>
                                    <path
                                        d="m4.4.8-.003.004-.014.019a4 4 0 0 0-.204.31 2 2 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.6.6 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3 3 0 0 1-.202.388 5 5 0 0 1-.253.382l-.018.025-.005.008-.002.002A.5.5 0 0 1 3.6 4.2l.003-.004.014-.019a4 4 0 0 0 .204-.31 2 2 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.6.6 0 0 0-.09-.252A4 4 0 0 0 3.6 2.8l-.01-.012a5 5 0 0 1-.37-.543A1.53 1.53 0 0 1 3 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a6 6 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 4.4.8m3 0-.003.004-.014.019a4 4 0 0 0-.204.31 2 2 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.6.6 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3 3 0 0 1-.202.388 5 5 0 0 1-.253.382l-.018.025-.005.008-.002.002A.5.5 0 0 1 6.6 4.2l.003-.004.014-.019a4 4 0 0 0 .204-.31 2 2 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.6.6 0 0 0-.09-.252A4 4 0 0 0 6.6 2.8l-.01-.012a5 5 0 0 1-.37-.543A1.53 1.53 0 0 1 6 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a6 6 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 7.4.8m3 0-.003.004-.014.019a4 4 0 0 0-.204.31 2 2 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.6.6 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3 3 0 0 1-.202.388 5 5 0 0 1-.252.382l-.019.025-.005.008-.002.002A.5.5 0 0 1 9.6 4.2l.003-.004.014-.019a4 4 0 0 0 .204-.31 2 2 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.6.6 0 0 0-.09-.252A4 4 0 0 0 9.6 2.8l-.01-.012a5 5 0 0 1-.37-.543A1.53 1.53 0 0 1 9 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a6 6 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 10.4.8"/>
                                </svg>
                                <div style={{marginLeft: 10, paddingTop: 10}}>Śniadanie (40 zł/os):</div>
                                <button
                                    onClick={() => handleOptionSelection("breakfast", true)}
                                    style={{
                                        padding: "5px 15px",
                                        backgroundColor: additions.breakfast ? "limegreen" : "lightgray",
                                        color: additions.breakfast ? "black" : "black",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    Tak
                                </button>
                                <button
                                    onClick={() => handleOptionSelection("breakfast", false)}
                                    style={{
                                        padding: "5px 15px",
                                        backgroundColor: !additions.breakfast ? "#d7162f" : "lightgray",
                                        color: !additions.breakfast ? "white" : "black",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    Nie
                                </button>
                            </li>

                            {/* Parking */}
                            <li
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "40px auto 80px 80px",
                                    marginTop: 20,
                                    marginBottom: 20,
                                    alignItems: "center",
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                                     className="bi bi-car-front-fill" viewBox="0 0 16 16">
                                    <path
                                        d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"/>
                                </svg>
                                <div style={{marginLeft: 10, paddingTop: 10}}>Parking (50 zł/doba):</div>
                                <button
                                    onClick={() => handleOptionSelection("parking", true)}
                                    style={{
                                        padding: "5px 15px",
                                        backgroundColor: additions.parking ? "limegreen" : "lightgray",
                                        color: additions.parking ? "black" : "black",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    Tak
                                </button>
                                <button
                                    onClick={() => handleOptionSelection("parking", false)}
                                    style={{
                                        padding: "5px 15px",
                                        backgroundColor: !additions.parking ? "#d7162f" : "lightgray",
                                        color: !additions.parking ? "white" : "black",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    Nie
                                </button>
                            </li>

                            {/* Wi-Fi */}
                            <li
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "40px auto 160px",
                                    marginTop: 20,
                                    marginBottom: 20,
                                    alignItems: "center",
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                                     className="bi bi-wifi" viewBox="0 0 16 16">
                                    <path
                                        d="M15.384 6.115a.485.485 0 0 0-.047-.736A12.44 12.44 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.52.52 0 0 0 .668.05A11.45 11.45 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164.205.148.49.13.668-.049"/>
                                    <path
                                        d="M13.229 8.271a.482.482 0 0 0-.063-.745A9.46 9.46 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.576 1.336c.206.132.48.108.653-.065m-2.183 2.183c.226-.226.185-.605-.1-.75A6.5 6.5 0 0 0 8 9c-1.06 0-2.062.254-2.946.704-.285.145-.326.524-.1.75l.015.015c.16.16.407.19.611.09A5.5 5.5 0 0 1 8 10c.868 0 1.69.201 2.42.56.203.1.45.07.61-.091zM9.06 12.44c.196-.196.198-.52-.04-.66A2 2 0 0 0 8 11.5a2 2 0 0 0-1.02.28c-.238.14-.236.464-.04.66l.706.706a.5.5 0 0 0 .707 0l.707-.707z"/>
                                </svg>
                                <div style={{marginLeft: 10, paddingTop: 10}}>Wi-Fi (bezpłatne):</div>
                                <button
                                    style={{
                                        padding: "5px 15px",
                                        backgroundColor: additions.wifi ? "limegreen" : "lightgray",
                                        color: additions.wifi ? "black" : "black",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    Tak
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>


                {/* Right column */}
                <div className="reservation-column">
                    <div className="reservation-info">
                        <h2>Dane rezerwacji</h2>
                        {reservation?.user !== "---" ? <p><strong>Użytkownik:</strong> {reservation.user}</p> : null}
                        {reservation?.user === "---" ?
                            <div>

                                <div style={{display: "grid", gridTemplateColumns: "100px auto"}}>
                                    <strong style={{paddingTop: 5}}>Imię: </strong>
                                    <p>
                                        <input
                                            type="text"
                                            value={reservation.user_name}
                                            onChange={(e) => setReservation(prev => ({
                                                ...prev,
                                                name: e.target.value
                                            }))}
                                            style={{borderColor: "lightgrey"}}
                                            className="form-control"
                                        /></p>
                                    <div>

                                    </div>
                                </div>


                                <div style={{display: "grid", gridTemplateColumns: "100px auto"}}>
                                    <strong style={{paddingTop: 5}}>Nazwisko: </strong>
                                    <p>
                                        <input
                                            type="text"
                                            value={reservation.surname}
                                            onChange={(e) => setReservation(prev => ({
                                                ...prev,
                                                surname: e.target.value
                                            }))}
                                            style={{borderColor: "lightgrey"}}
                                            className="form-control"
                                        /></p>
                                    <div>

                                    </div>
                                </div>

                                <div style={{display: "grid", gridTemplateColumns: "100px auto"}}>
                                    <strong style={{paddingTop: 5}}>Email: </strong>
                                    <p>
                                        <input
                                            type="text"
                                            value={reservation.email}
                                            onChange={(e) => setReservation(prev => ({
                                                ...prev,
                                                email: e.target.value
                                            }))}
                                            style={{borderColor: "lightgrey"}}
                                            className="form-control"
                                        /></p>
                                    <div>

                                    </div>
                                </div>
                            </div>
                            :
                            <div>
                                <p>
                                    <strong>Imię: </strong>
                                    {reservation.user_name}
                                </p>
                                <p>
                                    <strong>Nazwisko: </strong>
                                    {reservation.surname}
                                </p>
                            </div>}


                        <p><strong>Typ pokoju:</strong> {reservation.room_type}</p>
                        <p><strong>Data zameldowania:</strong> {checkIn}, 14:00</p>
                        <p><strong>Data wymeldowania:</strong> {checkOut}, 12:00</p>

                        <div className="price-info">
                            <p><strong>Cena całkowita: </strong>
                                {((reservation.price * (new Date(checkOut).getDate() - new Date(checkIn).getDate())) +
                                    (additions.breakfast? 40 * reservation.people_number : 0) +
                                    (additions.parking? 50 * (new Date(checkOut).getDate() - new Date(checkIn).getDate()): 0)
                                ).toFixed(2)} zł
                            </p>
                            <p>
                                <strong>Zadatek:</strong> {(((reservation.price * (new Date(checkOut).getDate() - new Date(checkIn).getDate())) +
                                    (additions.breakfast? 40 * reservation.people_number : 0) +
                                    (additions.parking? 50 * (new Date(checkOut).getDate() - new Date(checkIn).getDate()): 0)) * deposit
                                ).toFixed(2)} zł
                            </p>
                        </div>

                        <p className="people-edit">
                            <div className="reservation-columns">
                                <strong style={{paddingTop: 5}}>Liczba osób (max. {hotelPeopleCapacity}):</strong>
                                <p>
                                    <input
                                        type="number"
                                        min="1"
                                        max={hotelPeopleCapacity}
                                        value={reservation.people_number}
                                        onChange={(e) => setReservation(prev => ({
                                            ...prev,
                                            people_number: e.target.value
                                        }))}
                                        className="people-input"
                                        style={{maxWidth: 100}}
                                    /></p>
                                <div>

                                </div>
                            </div>
                        </p>

                        <div style={{marginTop: 20, marginBottom: 20}}>
                            <h2>Wybierz opcję płatności:</h2>
                            <div style={{display: "grid", gridTemplateColumns: "auto auto auto"}}>
                                {/* Przycisk Zapłać później */}
                                <button
                                    onClick={() => handleOptionSelection2("later")}
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: paymentOption === "later" ? "#ff7329" : "lightgray",
                                        color: paymentOption === "later" ? "black" : "black",
                                        border: "none",
                                        cursor: "pointer",
                                        marginRight: "10px",
                                        borderRadius: "5px",
                                    }}
                                >
                                    <b>Zapłać później</b>
                                </button>

                                {/* Przycisk Tylko zadatek */}
                                <button
                                    onClick={() => handleOptionSelection2("deposit")}
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: paymentOption === "deposit" ? "#ff7329" : "lightgray",
                                        color: paymentOption === "deposit" ? "black" : "black",
                                        border: "none",
                                        cursor: "pointer",
                                        marginRight: "10px",
                                        borderRadius: "5px",
                                    }}
                                >
                                    <b>Tylko zadatek</b>
                                </button>

                                {/* Przycisk Pełna kwota */}
                                <button
                                    onClick={() => handleOptionSelection2("full")}
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: paymentOption === "full" ? "#ff7329" : "lightgray",
                                        color: paymentOption === "full" ? "black" : "black",
                                        border: "none",
                                        cursor: "pointer",
                                        borderRadius: "5px",
                                    }}
                                >
                                    <b>Pełna kwota</b>
                                </button>

                            </div>

                            {/* Wyświetlanie wybranej opcji */}
                            {paymentOption && (
                                <div style={{marginTop: "20px", fontSize: "18px"}}>
                                    <b>Wybrano
                                        opcję:</b> {paymentOption === "later" ? "Zapłać później" : paymentOption === "deposit" ? "Tylko zadatek" : "Pełna kwota"}
                                </div>
                            )}
                        </div>

                        <div style={{marginTop: 20, marginBottom: 20}}>
                            <h2>Zgody i warunki korzystania</h2>
                            <div className="form-container">
                                <div className="cancellation-policy">
                                    <h3>Warunki anulowania</h3>
                                    <p>
                                        Możesz anulować rezerwację bez opłat do 24 godzin przed datą
                                        zameldowania. Po tym czasie zadatek nie podlega zwrotowi.
                                    </p>
                                </div>


                                <label className="consent-label">
                                    <input
                                        type="checkbox"
                                        name="consent"
                                        checked={formData.consent}
                                        onChange={handleChange}
                                        className={`consent-checkbox ${errorFields.consent ? 'error-border' : ''}`}
                                        required
                                    />
                                    <span className="consent-text">
                                        Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z polityką prywatności.
                                    </span>
                                </label>

                                <label className="consent-label">
                                    <input
                                        type="checkbox"
                                        name="termsAccepted"
                                        checked={formData.termsAccepted}
                                        onChange={handleChange}
                                        className={`consent-checkbox ${errorFields.termsAccepted ? 'error-border' : ''}`}
                                        required
                                    />
                                    <span className="consent-text">
                                        Akceptuję regulamin.
                                    </span>
                                </label>

                                {error && <p className="error-message">{error}</p>}
                            </div>


                        </div>

                        <div style={{margin: "auto", width: 300}}>
                            {!reservation.is_paid && (
                                <button onClick={handleConfirm} className="pay-button">Zatwierdź i zapłać</button>
                            )}
                            <button onClick={() => navigate(-1)} className="return-button">Wróć</button>
                        </div>


                    </div>


                </div>
            </div>
        </div>
    );
};

export default ReservationDetails;
