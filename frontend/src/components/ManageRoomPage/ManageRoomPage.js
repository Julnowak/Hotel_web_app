import React, {useState, useEffect} from "react";
import {Form, Button, Container, Alert, Row, Col, Card} from "react-bootstrap";
import axios from "axios";
import {useParams, useNavigate, useLocation} from "react-router-dom";
import {API_BASE_URL} from "../../config";
import OneRoomVisual from "./OneRoomVisual";
import Cookies from "js-cookie";

const ManageRoomPage = () => {
    const params = useParams();
    const [roomData, setRoomData] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const hotelId = queryParams.get("hotelId");
    const [flag, setFlag] = useState(false);
    const [image, setImage] = useState('');

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/manage/room/${params.id}/`,
                    {
                        params: {
                            hotel_id: hotelId,
                        },
                    }
                );
                setRoomData(response.data);
                setImage(response.data.image.slice(15));
                setFlag(true);
            } catch (error) {
                setErrorMessage("Błąd podczas ładowania danych pokoju.");
                console.error("Error fetching room details:", error);
            }
        };

        if (!flag) {
            fetchRoomDetails();
        }
    }, [flag, hotelId, params.id]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        if (name === "price" &&  (0 >= value || value > 100000) ){
            return;
        }
        if (name === "people_capacity" &&  (0 >= value || value > 20)){
            return;
        }
        setRoomData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const csrfToken = Cookies.get("csrftoken"); // Extract CSRF token from cookies
                if (!csrfToken) {
                    console.error("CSRF token not found!");
                    return;
                }
            await axios.put(`${API_BASE_URL}/manage/room/${roomData.room_id}/`, roomData, {
                headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json',
            }
            });
            setStatusMessage("Dane pokoju zostały zaktualizowane.");
        } catch (error) {
            setErrorMessage("Błąd podczas aktualizacji danych pokoju.");
            console.error("Error updating room details:", error);
        }
    };

    return (
        <Container className="py-5">
            <h1 className="text-center mb-4">Strona zarządzania pokojem</h1>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {statusMessage && <Alert variant="success">{statusMessage}</Alert>}

            <h2>Lokacja pokoju</h2>
            <div style={{width: 600, margin: "auto"}}>
                <OneRoomVisual hotelId={hotelId} floorId={roomData?.floor}/>

                <Card className="shadow">
                    <Card.Body>
                        <Row>
                            <Col style={{textAlign: "center"}}>
                                <strong>{roomData?.hotel.slice(0, -6)}</strong>
                                <br></br>
                                <strong>{roomData?.hotel.slice(-6)}</strong>
                            </Col>
                            <Col style={{textAlign: "center"}}>
                                <strong>Numer pokoju:</strong><br/>
                                <div>{roomData?.room_number}</div>
                            </Col>
                            <Col style={{textAlign: "center"}}>
                                <strong>Numer piętra:</strong><br/>{roomData?.floor}
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </div>

            <h2 style={{marginTop: 40}}>Dane o pokoju</h2>
            {roomData ? (
                <>
                    <Row className="mb-4 align-items-center">
                        {/* Image Section */}
                        <Col md={6}>
                            <Card className="shadow">
                                <Card.Img
                                    variant="top"
                                    src={image}
                                    alt="Zdjęcie pokoju"
                                    style={{borderRadius: "0.5rem", maxWidth: "100%"}}
                                />
                            </Card>
                        </Col>

                        {/* Visualization Section */}
                        <Col md={6}>
                            <div className="d-flex justify-content-center align-items-center" style={{height: "100%"}}>
                                <Form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
                                    <Row className="g-4">

                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Typ Pokoju</Form.Label>
                                                <Form.Select
                                                    name="type"
                                                    value={roomData.type}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="standard">Standard</option>
                                                    <option value="deluxe">Deluxe</option>
                                                    <option value="suite">Apartament</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Cena [zł]</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    step="0.01"
                                                    name="price"
                                                    value={roomData.price}
                                                    disabled={!roomData.custom}
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>

                                            <Form.Group>
                                              <Form.Check
                                                type="checkbox"
                                                name="custom"
                                                label="Edytowalny"
                                                style={{ accentColor: "black"}}
                                                checked={roomData.custom}
                                                onChange={(e) =>
                                                  setRoomData((prevData) => ({
                                                    ...prevData,
                                                    custom: e.target.checked,
                                                  }))
                                                }
                                              />
                                            </Form.Group>
                                        </Col>


                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Status</Form.Label>
                                                <Form.Select
                                                    name="status"
                                                    value={roomData.status}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="Wolny">Wolny</option>
                                                    <option value="Zajęty">Zajęty</option>
                                                    <option value="Do naprawy">Do naprawy</option>
                                                    <option value="Do sprzątania">Do sprzątania</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Maksymalna liczba gości</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="people_capacity"
                                                    value={roomData.people_capacity}
                                                    onChange={handleInputChange}
                                                    min={1}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <div className="text-center mt-4">
                                        <Button style={{ margin: 10}} type="submit" variant="dark" className="px-5">
                                            Zapisz Zmiany
                                        </Button>
                                        <Button style={{ margin: 10}}
                                            variant="secondary"
                                            className="px-5 ms-3"
                                            onClick={() => navigate(-1)}
                                        >
                                            Powrót
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </Col>
                    </Row>


                </>
            ) : (
                <p className="text-center">Ładowanie danych pokoju...</p>
            )}
        </Container>
    );
};

export default ManageRoomPage;
