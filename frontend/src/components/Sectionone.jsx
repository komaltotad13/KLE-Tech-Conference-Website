// Section_one.jsx
import React from 'react';
import './Sectionone.css';
import image1 from '../images/bulb.jpg';
import image2 from '../images/brain.jpg';
import image3 from '../images/agri.jpg';
import image4 from '../images/testtube.avif';

function Sectionone() {
  return (
    <div className="section-one-container">
      <h2 className="section-heading">Upcomming 2024 Conferences</h2>
      <div className="card-container">
        <div className="card">
          <img src={image1} alt="Card 1" />
          <h3>Card 1 Title</h3>
        </div>
        <div className="card">
          <img src={image2} alt="Card 2" />
          <h3>Card 2 Title</h3>
        </div>
        <div className="card">
          <img src={image3} alt="Card 3" />
          <h3>Card 3 Title</h3>
        </div>
        <div className="card">
          <img src={image4} alt="Card 4" />
          <h3>Card 4 Title</h3>
        </div>
      </div>
    </div>
  );
}

export default Sectionone;
