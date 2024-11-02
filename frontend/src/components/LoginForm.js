import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        // Implement login logic here
        console.log({ email, password, rememberMe });
    };

    const handleGoogleLogin = () => {
        // Implement Google login logic here
        console.log("Google login clicked");
    };

    const handleFacebookLogin = () => {
        // Implement Facebook login logic here
        console.log("Facebook login clicked");
    };

    const containerStyle = {
        width: 400,
        margin: '50px auto',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f8f9fa',
    };

    const headingStyle = {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#343a40',
    };

    const buttonStyle = {
        width: '100%',
        borderRadius: '5px',
    };

    return (
        <div style={containerStyle}>
            <h1 style={headingStyle}>Logowanie</h1>
            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Adres email:</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Wprowadź adres email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Hasło:</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Wprowadź hasło"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formRememberMe">
                    <Form.Check
                        type="checkbox"
                        label="Zapamiętaj mnie"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                    />
                </Form.Group>
                <Button variant="dark" type="submit" style={buttonStyle}>
                    Zaloguj
                </Button>
            </Form>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <a href="#" style={{ marginRight: '10px' }} onClick={handleGoogleLogin}>Zaloguj przez Google</a>
                <a href="#" onClick={handleFacebookLogin}>Zaloguj przez Facebook</a>
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <a href="#" style={{ color: '#007bff' }}>Nie pamiętam hasła</a>
            </div>
        </div>
    );
};

export default LoginForm;
