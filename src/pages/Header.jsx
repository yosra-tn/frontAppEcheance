import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const userId = localStorage.getItem('userId');
  const isLoggedIn = Boolean(userId);
  return (
    <header>
      <h1>Mon Application de Gestion des Échéances</h1>
      <nav>
        {isLoggedIn===false ? (
          <>
            <Link to="/">Accueil</Link>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        ) : (          
          <>
            <Link to="/calendar">Calendrier</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
