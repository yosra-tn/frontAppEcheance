import React from 'react';
import './HomePage.css';
import HomePageImg from '../assets/HomePageImg.png'; // Corriger l'importation de l'image

function HomePage() {
  return (
    <div className="home-container"> 
      <div className="quote-container">
        <p className="quote">
          Transformez le chaos des échéances en sérénité. 
          Avec notre application, chaque date importante devient une opportunité de briller !
        </p>
      </div>
      <div className="image-container">
        <img src={HomePageImg} alt="Inspiration" className="inspiration-image" /> 
      </div>
    </div>
  );
}

export default HomePage;
