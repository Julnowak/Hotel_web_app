import React from 'react';

function Footer(props) {
    return (
        <div>
            {/* Footer */}
            <footer className="footer-container" style={{ backgroundColor:"black"}}>
                <div className="footer-content">
                    <div className="footer-section links">
                        <h3>Szybkie linki</h3>
                        <ul>
                            <li><a href={"/"}>Strona główna</a></li>
                            <li><a href={"/gallery"}>Galeria</a></li>
                            <li><a href={"/hotels"}>Hotele</a></li>
                            <li><a href={"/reservation"}>Zarezerwuj</a></li>
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
                            <a href="https://www.facebook.com/"><i className="fab fa-facebook-f"></i></a>
                            <a href="https://x.com/"><i className="fab fa-twitter"></i></a>
                            <a href="https://www.instagram.com/"><i className="fab fa-instagram"></i></a>
                            <a href="https://www.linkedin.com/"><i className="fab fa-linkedin-in"></i></a>
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