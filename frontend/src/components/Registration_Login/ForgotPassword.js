// ForgotPassword.js
import React, { useState } from 'react';

const ForgotPassword = ({ submitResetPassword, setShowForgotPassword }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        submitResetPassword(email);  // Trigger password reset action
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Resetowanie hasła</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            placeholder="Wpisz email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Wyślij instrukcje resetowania hasła
                    </button>
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => setShowForgotPassword(false)}
                    >
                        Anuluj
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;