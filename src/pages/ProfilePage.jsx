import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfilePage.css';

function ProfilePage() {
    const [userData, setUserData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error("User ID non trouvé dans le stockage local");
            return;
        }
        
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/get_user/', {
                    params: { user_id: userId },
                });
                setUserData(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données utilisateur :', error);
            }
        };
    
        fetchUserData();
    }, []);

    const handlePasswordChange = () => {
        navigate('/FormUpdateMdp');
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <div className='profile-container'>
            <div className='profile-title'>Mes informations personnelles</div>
            <div className="profile-info">
                <div className="profile-item">
                    <label className="profile-label">Nom d'utilisateur:</label>
                    <span className="profile-data">{userData.username}</span>
                </div>
                <div className="profile-item">
                    <label className="profile-label">Email:</label>
                    <span className="profile-data">{userData.email}</span>
                </div>
            </div>
            <div className="profile-actions">
                <button className="profile-button" onClick={handlePasswordChange}>Modifier Mot de Passe</button>
                <button className="profile-button logout" onClick={handleLogout}>Se Déconnecter</button>
            </div>
        </div>
    );
}

export default ProfilePage;
