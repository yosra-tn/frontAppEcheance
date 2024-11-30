import React from 'react';
import './Auth.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/register", {
                username,
                email,
                password,
            });
            console.log("User registered:", response.data);
            navigate('/login');
            
        } catch (err) {
            setError(err.response?.data?.detail || "Une erreur est survenue.");
        }
    };
    return (
        <div className="auth-container">
            <h2 className="auth-title">Inscription</h2>
            <form method='POST' onSubmit={handleRegister} className="auth-form">
                <label htmlFor="username">Nom d'utilisateur</label>
                <input placeholder="Nom d'utilisateur" type="text" id="username" alue={username} onChange={(e) => setUsername(e.target.value)} required />

                <label htmlFor="email">Email</label>
                <input placeholder="Email" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}  required />

                <label htmlFor="password">Mot de passe</label>
                <input placeholder="Mot de passe" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}  required />

                <button type="submit" className="auth-button">S'inscrire</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
}

export default SignUp;
