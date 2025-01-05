import React, {useEffect, useState} from 'react';
import './UserProfile.css';
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {Button, Card} from "react-bootstrap";
import StarRating from "../StarRating/StarRating";

// AXIOS CONNECTION FOR LOGIN //
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://127.0.0.1:3000"
})

// AXIOS CONNECTION FOR LOGIN //


const UserProfile = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [resNum, setResNum] = useState('');
    const [meanRating, setMeanRating] = useState('');
    const [totalDays, setTotalDays] = useState('');
    const [surname, setSurname] = useState('');
    const [image, setImage] = useState('');
    const [lastLogin, setLastLogin] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [userType, setUserType] = useState('');
    const [likedHotels, setLikedHotels] = useState([]);
    const [hotel, setHotel] = useState(null);
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: 'Abhishek Bachchan',
        creditCard: '*******',
        reservations: 3,
        rating: 2.1,
        daysSpent: 20,
        avatar: 'https://biofeedzoo.pl/data/include/img/news/1685189763.webp' // Placeholder image, replace with user's actual image URL
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editableUser, setEditableUser] = useState(user);


    useEffect(() => {
        client.get(`http://127.0.0.1:8000/api/user/`)
            .then(response => {
                console.log(response.data)
                setEmail(response.data['user'].email)
                setUsername(response.data['user'].username)
                setSurname(response.data['user'].surname)
                setName(response.data['user'].name)
                setLastLogin(response.data['user'].last_login)
                setUserType(response.data['user'].user_type)
                setPhone(response.data['user'].telephone)
                setAddress(response.data['user'].address)
                setTotalDays(response.data['total_days'])
                setMeanRating(response.data['mean_rating'])
                setResNum(response.data['reservations_number'])
                setLikedHotels(response.data['user'].liked_hotels)
                // console.log(response.data)

                const fetchHotels = async () => {
                    try {
                        const rep = await client.get(`http://127.0.0.1:8000/api/hotel/${response.data['user'].recepcionist_hotel}/`);
                        setHotel("Weles " + rep.data.localization)
                        console.log(rep.data)
                    } catch (error) {
                        console.error("Error fetching hotels:", error);
                    }
                };

                if (!hotel && response.data['user'].recepcionist_hotel) {
                    fetchHotels();

                }

                if (response.data['user'].profile_picture) {
                    setImage(response.data['user'].profile_picture.slice(15))
                }
            })
            .catch(function () {
                console.log("error")
            });

    }, [image, resNum]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (event) => {
        const {name, value} = event.target; // Get name and value from input element
        switch (name) {
            case 'username':
                setUsername(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'name':
                setName(value);
                break;
            case 'surname':
                setSurname(value);
                break;
            case 'telephone':
                setPhone(value);
                break;
            case 'address':
                setAddress(value);
                break;
            default:
                break;
        }
    };

    const handleSave = () => {
        setUser(editableUser);
        setIsEditing(false);
        const csrfToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken'))
            ?.split('=')[1];

        client.put('http://127.0.0.1:8000/api/user/', {
            email: email,
            username: username,
            surname: surname,
            name: name,
            userType: userType,
            phone: phone,
            address: address,
        }, {
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.status === 200) {
                    console.log("Udało się");
                } else {
                    console.log("Failed to update user");
                }
            })
            .catch(error => console.error('Error:', error));
    };


    const handleCancel = () => {
        setEditableUser(user);
        setIsEditing(false);
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            client.delete('http://127.0.0.1:8000/api/user/', {
                headers: {
                    'X-CSRFToken': document.cookie
                        .split('; ')
                        .find(row => row.startsWith('csrftoken'))
                        ?.split('=')[1],  // Ensure CSRF token is correctly extracted
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (response.status === 204) {
                        console.log("User deleted successfully");
                        alert("Account deleted!");
                        localStorage.clear();
                        navigate('/')
                        window.location.reload()
                    } else {
                        console.log("Failed to delete user");
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    };


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser((prevUser) => ({
                    ...prevUser,
                    avatar: reader.result
                }));
            };
            reader.readAsDataURL(file);

            const csrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken'))
                ?.split('=')[1];

            // Create a FormData object and append the image
            const formData = new FormData();
            formData.append('profile_picture', file);

            client.post('http://127.0.0.1:8000/api/user/upload-avatar/', formData, {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'multipart/form-data',  // Required for file upload
                },
            })
                .then(response => {
                    if (response.status === 200) {
                        setImage(response.data.profile)
                        console.log("Udało się");
                    } else {
                        console.log("Failed to update user");
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    };


    return (
        <div className="profile-container">
            <h2>Mój profil</h2>
            <div className="profile-content">
                <div className="avatar">
                    {image ?
                        <img src={image} alt="User avatar"/>
                        : <img src={"https://static.thenounproject.com/png/3918329-200.png"} alt="User avatar"/>
                    }

                    <div className="avatar-edit-icon" onClick={() => document.getElementById('fileInput').click()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                             className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path
                                d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd"
                                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                        </svg>
                    </div>
                    <input
                        type="file"
                        id="fileInput"
                        style={{display: 'none'}}
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                <div className="profile-info">
                    {userType === "recepcjonista" ?
                    <p><strong>Hotel: </strong>{hotel}</p>: null}
                    {isEditing ? (
                        <>
                            <p><strong>Nazwa użytkownika:</strong></p>
                            <input
                                type="text"
                                name="username"
                                value={username}
                                onChange={handleInputChange}
                                className="profile-input"
                            />
                            <p><strong>E-mail:</strong>
                                <input
                                    type="text"
                                    name="email"
                                    value={email}
                                    onChange={handleInputChange}
                                    className="profile-input"
                                />
                            </p>

                            <p><strong>Imię:</strong>
                                <input
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={handleInputChange}
                                    className="profile-input"
                                /></p>
                            <p><strong>Nazwisko:</strong>
                                <input
                                    type="text"
                                    name="surname"
                                    value={surname}
                                    onChange={handleInputChange}
                                    className="profile-input"
                                /></p>

                            <p><strong>Telefon:</strong>
                                <input
                                    type="text"
                                    name="telephone"
                                    value={phone}
                                    onChange={handleInputChange}
                                    className="profile-input"
                                />
                            </p>
                            <p><strong>Adres:</strong>
                                <input
                                    type="text"
                                    name="address"
                                    value={address}
                                    onChange={handleInputChange}
                                    className="profile-input"
                                /></p>

                            <div className="profile-buttons">
                                <button className="save-btn" onClick={handleSave}>Zapisz zmiany</button>
                                <button className="cancel-btn" onClick={handleCancel}>Anuluj</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p><strong>Nazwa użytkownika:</strong> {username}</p>
                            <p><strong>E-mail:</strong> {email ? email : null}</p>
                            <p><strong>Ostatnie
                                logowanie:</strong> {lastLogin?.slice(0, 10)}, {lastLogin?.slice(11, 19)}</p>

                            <span>&nbsp;</span>
                            <p><strong>Imię:</strong> {name ? name : "---"}</p>
                            <p><strong>Nazwisko:</strong> {surname ? surname : "---"}</p>

                            <p><strong>Telefon:</strong> {phone ? phone : "---"}</p>
                            <p><strong>Adres:</strong> {address ? address : "---"}</p>

                            <div className="profile-buttons">
                                <button className="edit-btn" onClick={handleEditToggle}>Edytuj</button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {userType === "klient" ?
            <div>
            <h2>Ulubione hotele</h2>
            {likedHotels?.map((hotel: Hotel) => (
                <div key={hotel.hotel_id}>
                    <h4 style={{margin:5}}>{hotel.localization}</h4>
                    <p>{hotel.address}</p>
                  </div>
            ))}
            </div>: null}


            {userType === "klient" ?
            <h2>Statystyki</h2>: null}

            {userType === "klient" ?
                <div className="profile-stats">

                    <p>Liczba rezerwacji: {resNum}</p>
                    <p>Średnia ocen: {meanRating.toFixed(2)}</p>
                    <p>Dni spędzone w naszych hotelach: {totalDays}</p>
                </div> :  null}

            <div className="down-buttons">
                {userType === "klient" ?
                    <button className="delete-btn" onClick={handleDeleteAccount}>Usuń
                        konto</button>
                    : null}

            </div>
        </div>
    );
};

export default UserProfile;
