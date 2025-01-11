import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import client from "../client";
import { API_BASE_URL } from "../../config";
import { browserHistory } from 'react-router';

import "./PaymentSim.css";

const PaymentSim = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [error, setError] = useState("");
    const [flag, setFlag] = useState(false);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const paymentOption = queryParams.get("type");

    const params = useParams();
    const [reservation, setReservation] = useState(null);

    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const response = await client.get(`${API_BASE_URL}/reservation/${params.id}`);
                setReservation(response.data);
            } catch (error) {
                console.error("Error fetching reservation:", error);
            }
        };

        if (!reservation) {
            fetchReservation();
        }

        if (flag) {
            if (countdown > 0) {
                const timer = setTimeout(() => {
                    setCountdown(countdown - 1);
                }, 1000);
                return () => clearTimeout(timer);
            } else {
                navigate("/userReservations/");
            }
        }

    }, [countdown, flag, location, location.pathname, navigate, params, reservation]);


    const handlePayment = () => {
        setError("");
        setIsProcessing(true);

        setTimeout(() => {
            setIsProcessing(false);
            setIsPaid(true);
            setFlag(true);

            try {
                const csrfToken = Cookies.get("csrftoken");
                if (!csrfToken) {
                    console.error("CSRF token not found!");
                    return;
                }

                client.post(
                    `${API_BASE_URL}/reservation/${params.id}/`,
                    { operation_type: "zapłata" },
                    { headers: { "X-CSRFToken": csrfToken } }
                );
            } catch (error) {
                console.error("Error processing payment:", error);
            }
        }, 2000);
    };

    return (
        <div className="payment-sim__container">
            <h2>Podsumowanie płatności</h2>
            <p className="payment-sim__text">
                {paymentOption?.toString() === "deposit" ? (
                    <div>
                        Do zapłaty: <strong>{reservation?.deposit} zł</strong>
                    </div>
                ) : (
                    <div>
                        Do zapłaty: <strong>{reservation?.price} zł</strong>
                    </div>
                )}
            </p>

            {!isPaid ? (
                <div className="payment-sim__form-container">
                    <p className="payment-sim__info-text">
                        Po naciśnięciu przycisku zostaniesz przekierowany do strony płatności.
                        Po otrzymaniu odpowiedzi od serwisu płatniczego, status Twojej rezerwacji zmieni się na
                        "Opłacony", jeśli opłacono całość, lub "Częściowo opłacony", jeśli opłacono tylko zadatek.
                        <br />
                        W razie problemów prosimy o skontaktowanie się z <a href="#">obsługą klienta</a>.
                        Dziękujemy za zainteresowanie naszym hotelem i życzymy miłego pobytu!
                    </p>
                    {error && <p className="payment-sim__error">{error}</p>}
                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className={
                            isProcessing ? "payment-sim__button-disabled" : "payment-sim__button"
                        }
                    >
                        {isProcessing ? "Przetwarzanie..." : "Zapłać"}
                    </button>
                </div>
            ) : (
                <div className="payment-sim__container">
                    <h1 className="payment-sim__message">Transakcja zakończona sukcesem!</h1>
                    <p className="payment-sim__info">
                        Przekierowanie na stronę rezerwacji nastąpi za <strong>{countdown}</strong> sekund.
                    </p>
                </div>
            )}
        </div>
    );
};

export default PaymentSim;
