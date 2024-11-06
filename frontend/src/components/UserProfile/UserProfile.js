import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfile.css';  // Import the CSS file for styling

const UserProfile = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const response =  axios.get("http://127.0.0.1:8000/api/user/")
            .then(function () {
                setUser(response);
                setLoading(false)
            })
            .catch(function () {
                setUser(response);
            });

    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleEditProfile = () => {
        // Add functionality to edit profile
        alert('Edit Profile clicked!');
    };

    const handleDeleteProfile = () => {
        // Add functionality to delete profile
        alert('Delete Profile clicked!');
    };

    return (
        <div className="user-profile">
            <div >
                <div className="profile-content">
                    <div className="profile-picture-container">
                        <img
                            src={user.profile_picture || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                            alt={`${user.username}'s profile`}
                            className="profile-picture"
                        />
                        <div className="edit-picture-overlay">
                            <button className="edit-picture-btn">Edit</button>
                        </div>
                    </div>
                    <h2 className="username">{user.username}</h2>
                    <div className="profile-actions">
                        <button onClick={handleEditProfile} className="edit-btn">Edit Profile</button>
                        <button onClick={handleDeleteProfile} className="delete-btn">Delete Profile</button>
                    </div>
                    <div className="profile-stats">
                        <p><strong>Number of Reservations:</strong> {user.reservations_count}</p>
                        <p><strong>Average Rating:</strong> {user.avg_rating}</p>
                        <p><strong>Completed Reservations:</strong> {user.completed_reservations}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
