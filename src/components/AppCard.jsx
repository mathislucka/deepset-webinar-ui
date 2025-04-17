import React from 'react';
import '../styles/AppCard.css';

const AppCard = ({ title, description, icon, onClick }) => {
  return (
    <div className="app-card" onClick={onClick}>
      <div className="app-card-icon">
        {icon}
      </div>
      <div className="app-card-content">
        <h3 className="app-card-title">{title}</h3>
        <p className="app-card-description">{description}</p>
      </div>
    </div>
  );
};

export default AppCard;