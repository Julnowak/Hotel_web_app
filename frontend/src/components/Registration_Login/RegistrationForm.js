import React from 'react';

const RegistrationForm = ({
  email, setEmail, username, setUsername, password, setPassword, confirmPassword, setConfirmPassword, submitRegistration
}) => {
  return (
    <div className="registration-container">
      <div className="registration-card">
        <h2>Rejestracja</h2>
        <form onSubmit={submitRegistration} className="registration-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Login:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Hasło:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <button type="submit" className="registration-button">Zarejestruj się</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
