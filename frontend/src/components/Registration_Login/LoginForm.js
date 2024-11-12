import React, {useState} from 'react';

const LoginForm = ({email, setEmail, password, setPassword, submitLogin, errflag}) => {

    const [errorMessage, setErrorMessage] = useState('');

    return (
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
                    <div className="options"
                         style={{display: "flex", alignItems: "center"}}>
                        <label
                            style={{display: "flex", alignItems: "center", width: "100%"}}>
                            <input type="checkbox"
                                   style={{flex: "0 0 0", marginRight: "5px"}}/>
                            <span style={{marginRight: "5px", flex: "1 0 0",}}>Zapamiętaj mnie</span>

                            <a href="#forgot-password" className="forgot-password-link"
                               style={{
                                   marginLeft: "auto",
                                   flex: "1 2 0",
                                   textAlign: "right"
                               }}>
                                Nie pamiętam hasła
                            </a>
                        </label>

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
        </div>
    );
};

export default LoginForm;
