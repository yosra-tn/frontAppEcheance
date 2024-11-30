import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import './Auth.css';

function FormUpdateMdp() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const userId = localStorage.getItem('userId');
    
    const HandleSubmit = async (e) => {
        e.preventDefault();
        if(newPassword !== confirmPassword){
            setMessage('Les mots de passe ne correspondent pas');
            return;
        }
        try {
            const response = await axios.put(`http://127.0.0.1:8000/update_password/?user_id=${userId}`, {
              old_password: oldPassword, 
              new_password: newPassword  
            }
            );
            if (response.data.message === 'Password updated successfully') {
                setMessage('Mot de passe changé avec succès.');
              } else {
                setMessage('Erreur lors du changement de mot de passe.');
              }
            } catch (error) {
              console.error(error);
              setMessage('Une erreur est survenue.');
            }
    }

  return (
    <div className="auth-container" >
        <h2 className="auth-title" >Changer le mot de passe</h2>
        <form onSubmit={HandleSubmit} className="auth-form" >
            <input type="password" placeholder="Ancien mot de passe" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            <input type="password" placeholder="Nouveau mot de passe" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <input type="password" placeholder="Confirmer mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />  
            <button type='submit' className="auth-button" >Valider</button>
        </form>
        {message && <p className="error" >{message}</p>}
    </div>
  )
}

export default FormUpdateMdp

