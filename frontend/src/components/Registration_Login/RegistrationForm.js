import React from 'react';

const RegistrationForm = ({
                              email,
                              setEmail,
                              username,
                              setUsername,
                              password,
                              setPassword,
                              confirmPassword,
                              setConfirmPassword,
                              submitRegistration, errmess
                          }) => {


    return (
        <div className="registration-container">
            <div className="registration-card">
                <h2>Rejestracja</h2>

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
                    <div style={{textAlign: "center", marginTop:50}}>
                        <button type="submit" className="registration-button">
                            Zarejestruj się
                        </button>
                    </div>

                    <div style={{textAlign: "center", margin: 10}}>
                        <span style={{color: "#67605b"}}>
                            Masz już konto?
                        </span>

                        <a
                            href="#" onClick={function () {
                            document.getElementById('targetButton').click();
                        }}
                            style={{color: "white"}}
                        >
                            Zaloguj się
                        </a>
                    </div>

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
    );
};

export default RegistrationForm;
