import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import client from "../client";
import { API_BASE_URL } from "../../config";

import "./PaymentSim.css";

const PaymentSim = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [reservation, setReservation] = useState(null);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(5);
    const navigate = useNavigate();
    const [flag, setFlag] = useState(false);
    const [flagBase, setFlagBase] = useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const paymentOption = queryParams.get("type");
    const params = useParams();

    // Fetch reservation on mount
    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const response = await client.get(`${API_BASE_URL}/reservation/${params.id}`);
                setReservation(response.data);
                setFlagBase(true)
                console.log("Reservation fetched successfully:", response.data);
            } catch (err) {
                console.error("Error fetching reservation:", err);
            }
        };

        if (!flagBase) {
            fetchReservation();
        }

        if (flag) {
            if (countdown > 0) {
                const timer = setTimeout(() => {
                    setCountdown(countdown - 1);
                }, 1000);
                return () => clearTimeout(timer);
            } else {
                navigate(`/manage_reservation/${params.id}/`);
            }
        }


    }, [countdown, flag, flagBase, navigate, params.id, reservation]);


    // Handle browser navigation
   useEffect(() => {
    const cancelReservation = async () => {
        try {
            console.log("Attempting to cancel reservation...");
            const response = await client.put(`${API_BASE_URL}/reservation/${params.id}`, {
                status: "Anulowana",
            });
            console.log("Reservation canceled successfully:", response.data);
        } catch (err) {
            console.error("Error canceling reservation:", err);
        }
    };

    const handlePopState = () => {
        console.log("Back button pressed, canceling reservation...");
        cancelReservation(); // Działa dla cofania
    };

    const handleBeforeUnload = (event) => {
        console.log("Before unload triggered, canceling reservation...");
        // Tylko dla śledzenia logów — brak pewności co do wykonania zapytania!
        cancelReservation();
        event.preventDefault();
        event.returnValue = ""; // Wymusza dialog w niektórych przeglądarkach
    };

    // Obsługa cofania (popstate)
    window.addEventListener("popstate", handlePopState);

    // Obsługa zamykania/odświeżania (beforeunload)
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Czyszczenie eventów
    return () => {
        window.removeEventListener("popstate", handlePopState);
        window.removeEventListener("beforeunload", handleBeforeUnload);
    };
}, [params.id]);

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            const csrfToken = Cookies.get("csrftoken");
            if (!csrfToken) throw new Error("CSRF token not found!");

            await client.post(
                `${API_BASE_URL}/reservation/${params.id}/`,
                { operation_type: paymentOption?.toString() === "deposit" ? "zapłata częściowa": paymentOption?.toString() === "additional"? "dopłata":"zapłata"},
                { headers: { "X-CSRFToken": csrfToken } }
            );

            setIsPaid(true);
            setFlag(true);
            console.log("Payment processed successfully!");
        } catch (err) {
            setError("Błąd podczas przetwarzania płatności.");
            console.error("Error processing payment:", err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="payment-sim__container">


            {reservation?.status !== "Opłacona"?
                (!isPaid  ? (
                <div className="payment-sim__form-container">
                    <h2 style={{textAlign: "center"}}>Podsumowanie płatności</h2>
                    <p className="payment-sim__text">
                        {paymentOption?.toString() === "deposit" ? (
                            <div style={{textAlign: "center"}}>
                                Do zapłaty: <strong>{reservation?.deposit} zł</strong>
                            </div>
                        ) : (paymentOption?.toString() === "additional")?
                            <div style={{textAlign: "center"}}>
                                Do zapłaty: <strong>{reservation?.price - reservation?.paid_amount} zł</strong>
                            </div>
                            :
                            (
                            <div style={{textAlign: "center"}}>
                                Do zapłaty: <strong>{reservation?.price} zł</strong>
                            </div>
                        )}
                    </p>
                    <p className="payment-sim__info-text">
                        Po naciśnięciu przycisku zostaniesz przekierowany do strony płatności.
                        Po otrzymaniu odpowiedzi od serwisu płatniczego, status Twojej rezerwacji zmieni się na
                        "Opłacony", jeśli opłacono całość, lub "Częściowo opłacony", jeśli opłacono tylko zadatek.
                    </p>
                    {error && <p className="payment-sim__error">{error}</p>}
                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className={isProcessing ? "payment-sim__button-disabled" : "payment-sim__button"}
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
            ))
                :
            <h1 className="payment-sim__message">Rezerwacja została już opłacona!</h1>}

        </div>
    );
};

export default PaymentSim;
