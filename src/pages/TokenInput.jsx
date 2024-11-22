import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TokenInput.css';

const TokenInput = () => {
    const [testToken, setTestToken] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!testToken) {
            setMessage("Please enter a valid token.");
            return;
        }
        
        try {
            const response = await axios.post('http://localhost:8014/accept_invitation/', {
                token: testToken
            });
            console.log('Success:', response.data);
            navigate('/calendar'); 
        } catch (error) {
            if (error.response) {
                console.error('Error:', error.response.data);
                setMessage(error.response.data.detail[0].msg || "An error occurred"); // Display specific error message
            } else {
                console.error('Error:', error.message);
                setMessage("An unexpected error occurred.");
            }        }
    };
    

    return (
        <div>
            <h2>Accepter l'Invitation</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Code d'Invitation :
                    <input 
                        type="text" 
                        value={testToken} 
                        onChange={(e) => setTestToken(e.target.value)} 
                        required 
                    />
                </label>
                <button type="submit">Accepter</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default TokenInput;
