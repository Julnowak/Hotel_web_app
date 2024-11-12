import React, {useEffect, useState} from 'react';
import './UserProfile.css';
import axios from "axios";
import {useNavigate} from "react-router-dom";

// AXIOS CONNECTION FOR LOGIN //
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://localhost:3000"
})

// AXIOS CONNECTION FOR LOGIN //


const UserProfile = () => {
    const [email, setEmail] = useState('nan');
    const [username, setUsername] = useState('nan');
    const [name, setName] = useState('nan');
    const [surname, setSurname] = useState('nan');
    const [image, setImage] = useState('nan');
    const [lastLogin, setLastLogin] = useState('nan');
    const [address, setAddress] = useState('nan');
    const [phone, setPhone] = useState('nan');
    const [userType, setUserType] = useState('nan');
    const [errorMessage, setErrorMessage] = useState('');
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
                setImage(response.data['user'].profile_picture.slice(15))
                console.log(image)
            })
            .catch(function () {
                console.log("error")
            });
    }, [image]);


    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEditableUser({
            ...editableUser,
            [name]: value
        });
    };

    const handleSave = () => {
        setUser(editableUser);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditableUser(user);
        setIsEditing(false);
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            // Logic for deleting the account
            alert("Account deleted!");
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
        }
    };


    return (
        <div className="profile-container">
            <h2>Mój profil</h2>
            <div className="profile-content">
                <div className="avatar">
                    <img src={image} alt="User avatar" />
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
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                name="email"
                                value={editableUser.email}
                                onChange={handleInputChange}
                                className="profile-input"
                            />
                            <input
                                type="text"
                                name="name"
                                value={editableUser.name}
                                onChange={handleInputChange}
                                className="profile-input"
                            />
                            <input
                                type="text"
                                name="password"
                                value={editableUser.password}
                                onChange={handleInputChange}
                                className="profile-input"
                            />
                            <input
                                type="text"
                                name="creditCard"
                                value={editableUser.creditCard}
                                onChange={handleInputChange}
                                className="profile-input"
                            />
                            <div className="profile-buttons">
                                <button className="save-btn" onClick={handleSave}>Save</button>
                                <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p>Nazwa użytkownika: {username}</p>
                            <p>E-mail: {email ? email : null}</p>
                            <span>&nbsp;</span>
                            <p>Imię: {name}</p>
                            <p>Nazwisko: {surname}</p>

                            <p>Telefon: {phone}</p>
                            <p>Adres: {address}</p>
                            <p>Ostatnie logowanie: {lastLogin.slice(0,10)}, {lastLogin.slice(11,19)}</p>

                            <div className="profile-buttons">
                                <button className="edit-btn" onClick={handleEditToggle}>Edytuj</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="profile-stats">
                <p>Number of reservations: {user.reservations}</p>
                <p>Average rating: {user.rating}</p>
                <p>Days spent in our hotels: {user.daysSpent}</p>
            </div>

            <div className="profile-buttons">
                <button className="edit-btn" onClick={handleEditToggle}>Zmień hasło</button>
                <button className="delete-btn" onClick={handleDeleteAccount}>Usuń konto</button>
            </div>
        </div>
    );
};

export default UserProfile;
