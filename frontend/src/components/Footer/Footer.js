import React from 'react';

function Footer(props) {
    return (
        <div>
            {/* Footer */}
            <footer className="footer-container" style={{marginTop: 50}}>
                <div className="footer-content">
                    <div className="footer-section about">
                        <h3>O nas</h3>
                        <p>
                            Jesteśmy firmą, która dostarcza wysokiej jakości usługi. Naszym celem jest zapewnienie najlepszej obsługi klienta i innowacyjnych rozwiązań.
                        </p>
                    </div>

                    <div className="footer-section links">
                        <h3>Szybkie linki</h3>
                        <ul>
                            <li><a href="#home">Strona główna</a></li>
                            <li><a href="#about">O nas</a></li>
                            <li><a href="#services">Usługi</a></li>
                            <li><a href="#contact">Kontakt</a></li>
                        </ul>
                    </div>

                    <div className="footer-section contact">
                        <h3>Kontakt</h3>
                        <p>Email: kontakt@naszafirma.pl</p>
                        <p>Telefon: +48 123 456 789</p>
                    </div>

                    <div className="footer-section social-media">
                        <h3>Znajdź nas</h3>
                        <div className="social-icons">
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 Hotel Weles. Wszystkie prawa zastrzeżone.</p>
                </div>
            </footer>
        </div>
    );
}

export default Footer;