import React from 'react';
import './Auth.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const response = await axios.post("http://127.0.0.1:8000/login", {
                username: userName,
                password,
            });
            if (response.data.userId) {
                localStorage.setItem('userId', response.data.userId);
            }
            console.log('Login successful:', response.data);
            navigate('/calendar');
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.detail || 'Une erreur s\'est produite.');
            } else {
                setErrorMessage('Erreur de connexion au serveur.');
            }        
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Connexion</h2>
            <form method='POST' onSubmit={handleSubmit} className="auth-form">
                <label htmlFor="username">Nom d'utilisateur</label>
                <input placeholder="Nom d'utilisateur" type="text" id="username" value={userName} onChange={(e) => setUserName(e.target.value)} required />

                <label htmlFor="password">Mot de passe</label>
                <input placeholder="Mot de passe" type="password" id="password"  value={password} onChange={(e) => setPassword(e.target.value)} required />

                <button type="submit" className="auth-button">Se connecter</button>
                {errorMessage && <p className="error">{errorMessage}</p>}
            </form>
        </div>
    );
}

export default Login;
