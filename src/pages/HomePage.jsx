import React from 'react';
import './HomePage.css';
import HomePageImg from '../assets/HomePageImg.png'; // Corriger l'importation de l'image
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate=useNavigate();
  return (
    <div className="home-container"> 
      <div className="quote-container">
        <p className="quote">
          Transformez le chaos des échéances en sérénité. 
          Avec notre application, chaque date importante devient une opportunité de briller !
        </p>
        <button className="cta-button" onClick={()=>{navigate('/login')}}>Pour commencer il faut se connecter</button>
      </div>
      <div className="image-container">
        <img src={HomePageImg} alt="Inspiration" className="inspiration-image" /> 
      </div>
    </div>
  );
}

export default HomePage;
