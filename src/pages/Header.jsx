import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <h1>Mon Application de Gestion des Échéances</h1>
      <nav>
        <Link to="/">Accueil</Link>
        <Link to="/login">Connexion</Link>
        <Link to="/register">Inscription</Link>
        <Link to="/calendar">Calendrier</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/SharingAndCollaboration">Partage et Collaboration</Link>
      </nav>
    </header>
  );
}

export default Header;
