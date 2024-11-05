import React from 'react';

const LoginForm = ({ email, setEmail, password, setPassword, submitLogin, errflag }) => {
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Logowanie</h2>
        <form onSubmit={submitLogin} className="login-form">
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
            <label>Hasło:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Zaloguj się</button>
        </form>
        {errflag && <div className="error-message">Wprowadzono błędny email lub hasło.</div>}
      </div>
    </div>
  );
};

export default LoginForm;
