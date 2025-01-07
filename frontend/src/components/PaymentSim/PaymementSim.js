import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import Cookies from "js-cookie";
import client from "../client";
import {API_BASE_URL} from "../../config";

const PaymentSim = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [error, setError] = useState("");
    const [flag, setFlag] = useState(false);
    const csrfToken = Cookies.get("csrftoken");

    const params = useParams()
    const [reservation, setReservation] = useState(null);

    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5); // Czas w sekundach do przekierowania


    // Fetch list of hotels
    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const response = await client.get(`${API_BASE_URL}/reservation/${params.id}`,);
                setReservation(response.data);
                console.log(response.data)
            } catch (error) {
                console.error("Error fetching reservation:", error);
            }
        };

        if (!reservation) fetchReservation();

        if (flag) {
            if (countdown > 0) {
                const timer = setTimeout(() => {
                    setCountdown(countdown - 1);
                }, 1000);
                return () => clearTimeout(timer); // Czyszczenie timeoutu
            } else {
                navigate("/userReservations/"); // Przekierowanie po odliczeniu
            }
        }


    }, [countdown, flag, navigate, params, reservation]);


    const handlePayment = () => {
        if (!cardNumber || !expiryDate || !cvv) {
            setError("Wszystkie pola muszą być wypełnione.");
            return;
        }

        setError("");
        setIsProcessing(true);

        // Symulacja opóźnienia
        setTimeout(() => {
            setIsProcessing(false);
            setIsPaid(true);
            setFlag(true)

            try {
                const csrfToken = Cookies.get("csrftoken"); // Extract CSRF token from cookies
                if (!csrfToken) {
                    console.error("CSRF token not found!");
                    return;
                }
                      const response = client.post(`${API_BASE_URL}/reservation/${params.id}/`,{
                          operation_type: "zapłata"
                          }, // Your data payload goes here if needed
                {
                  headers: {
                    "X-CSRFToken": csrfToken,
                  },
                },
                      );
                      console.log(response.data)

            } catch (error) {
                console.error("Error fetching reservation:", error);
            }

        }, 2000);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Strona płatności</h1>
            <p style={styles.text}>
                Do zapłaty: <strong>{reservation?.price} zł</strong>
            </p>

            {!isPaid ? (
                <div style={styles.formContainer}>
                    <p style={styles.infoText}>
                        Wprowadź dane swojej karty, aby dokonać płatności.
                    </p>
                    <div style={styles.inputGroup}>
                        <label>Numer karty:</label>
                        <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Data ważności (MM/RR):</label>
                        <input
                            type="text"
                            placeholder="MM/RR"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>CVV:</label>
                        <input
                            type="password"
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    {error && <p style={styles.error}>{error}</p>}
                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        style={isProcessing ? styles.buttonDisabled : styles.button}
                    >
                        {isProcessing ? "Przetwarzanie..." : "Zapłać"}
                    </button>
                </div>
            ) : (
                <div style={styles.container}>
                    <h1 style={styles.message}>Transakcja zakończona sukcesem!</h1>
                    <p style={styles.info}>
                        Przekierowanie na stronę rezerwacji nastąpi za <strong>{countdown}</strong> sekund.
                    </p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "'Arial', sans-serif",
        backgroundColor: "#f5f5f5",
        padding: "20px",
    },
    header: {
        fontSize: "24px",
        marginBottom: "20px",
    },
    text: {
        fontSize: "18px",
        marginBottom: "20px",
    },
    formContainer: {
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    },
    infoText: {
        fontSize: "16px",
        marginBottom: "20px",
    },
    inputGroup: {
        marginBottom: "15px",
    },
    input: {
        width: "100%",
        padding: "10px",
        fontSize: "16px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        marginTop: "5px",
    },
    button: {
        width: "100%",
        padding: "10px 20px",
        fontSize: "16px",
        color: "#fff",
        backgroundColor: "#28a745",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    buttonDisabled: {
        width: "100%",
        padding: "10px 20px",
        fontSize: "16px",
        color: "#fff",
        backgroundColor: "#aaa",
        border: "none",
        borderRadius: "5px",
        cursor: "not-allowed",
    },
    success: {
        color: "#28a745",
        fontSize: "18px",
        fontWeight: "bold",
    },
    error: {
        color: "red",
        fontSize: "14px",
        marginBottom: "15px",
    },
};

export default PaymentSim;