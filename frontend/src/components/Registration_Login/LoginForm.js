import {useNavigate} from "react-router-dom";
import {useState} from "react";

const LoginForm = ({email, setEmail, password, setPassword, submitLogin, errmess}) => {
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false); // Kontrola widoczności modala
    const [emailtemp, setEmailTep] = useState(""); // Przechowywanie emaila
    const [isEmailSent, setIsEmailSent] = useState(false); // Status wysłania emaila

    const [emailError, setEmailError] = useState(""); // Błąd walidacji emaila

    const validateEmail = (emailtek) => {
        // Wyrażenie regularne do walidacji emaila
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailtek);
    };

    const handleEmailSubmit = () => {
        if (validateEmail(emailtemp)) {
            setEmailError(""); // Resetowanie błędu
            setIsEmailSent(true); // Ustawiamy status po wysłaniu
        } else {
            setEmailError("Podaj poprawny adres email."); // Wyświetlenie błędu
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Logowanie</h2>

                {errmess ?
                    <div
                        style={{
                            color: "red",
                            textAlign: "center",
                            margin: 20,
                            backgroundColor: "lightpink",
                            padding: 10,
                            borderRadius: 5,
                            display: "flex", // Use flexbox for layout
                            alignItems: "center", // Align items vertically
                            gap: "10px", // Add space between columns
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" fill="currentColor"
                             className="bi bi-exclamation-diamond" viewBox="0 0 16 16">
                            <path
                                d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.48 1.48 0 0 1 0-2.098zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"/>
                            <path
                                d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
                        </svg>
                        <div>{errmess}</div>
                    </div>
                    :
                    null}


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

                    <div className="options" style={{textAlign: "right"}}>
                        <label style={{display: "inline", verticalAlign: "middle"}}>
                            <input type="checkbox" style={{width: 20, minHeight: 15, accentColor: "#ff7329"}}/>
                            <span style={{height: 20}}>Zapamiętaj mnie</span>
                        </label>
                    </div>

                    <div style={{textAlign: "center"}}>
                        <button type="submit" className="login-button">
                            Zaloguj się
                        </button>
                    </div>

                    <div style={{textAlign: "center", margin: 10}}>
                        <span style={{color: "#67605b"}}>
                            Nie masz konta?
                        </span>

                        <a
                            href="#" onClick={function () {
                            document.getElementById('targetButton').click();
                        }}
                            style={{color: "white"}}
                        >
                            Zarejestruj się
                        </a>
                    </div>

                    <div style={{textAlign: "center", margin: 10}}>
                        <a
                            href="#forgot-password"
                            className="forgot-password-link"
                            onClick={(e) => {
                                e.preventDefault(); // Blokowanie domyślnego działania linku
                                setShowModal(true); // Otwieranie modala
                            }}
                        >
                            Nie pamiętam hasła
                        </a>
                    </div>

                    <div className="social-login">
                        {/* Google Login Button */}
                        <button
                            className="social-button google"
                            type="button"
                            onClick={() => (window.location.href = "https://www.google.pl/?hl=pl")}
                        >
                            <i className="fab fa-google"/> <b>Zaloguj przez Google</b>
                        </button>

                        {/* Facebook Login Button */}
                        <button
                            className="social-button facebook"
                            type="button"
                            onClick={() => (window.location.href = "https://www.facebook.com/")}
                        >
                            <i className="fab fa-facebook-f"/> <b>Zaloguj przez Facebook</b>
                        </button>
                    </div>
                </form>

                {/* Modal */}
                {showModal && (
                    <div className="modal-backdrop" onClick={() => setShowModal(false)}>
                        {/* Modal Content */}
                        <div
                            className="modalin"
                            onClick={(e) => e.stopPropagation()} // Prevent background click event
                        >
                            {!isEmailSent ? (
                                <>
                                    <h2>Podaj swój email</h2>
                                    <input
                                        type="email"
                                        placeholder="Wpisz email"
                                        value={emailtemp}
                                        onChange={(e) => setEmailTep(e.target.value)}
                                        required
                                        style={{
                                            margin: "10px 0",
                                            padding: "10px",
                                            width: "100%",
                                            border: emailError ? "1px solid red" : "1px solid #ccc",
                                        }}
                                    />
                                    {emailError && (
                                        <p style={{color: "red", fontSize: "0.9em"}}>{emailError}</p>
                                    )}
                                    <button
                                        onClick={handleEmailSubmit}
                                        style={{
                                            padding: "10px 20px",
                                            background: "#ff7329",
                                            color: "#fff",
                                            border: "none",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Wyślij
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        style={{
                                            padding: "10px 20px",
                                            background: "gray",
                                            color: "#fff",
                                            border: "none",
                                            marginLeft: "10px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Anuluj
                                    </button>
                                </>
                            ) : (
                                <h2>Wiadomość została wysłana na {emailtemp}</h2>
                            )}
                        </div>
                    </div>
                )}

                {/* Style */}
                <style>{`
                  .modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 0;
                  }
                  .modalin {
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    width: 300px;
                    z-index: 1000;
                  }
                `}</style>

            </div>
        </div>
    );
};

export default LoginForm;
