import React from 'react';
import { useHistory } from 'react-router-dom';
import './CardWidget.css'; 

const CardWidget = ({ title, description, icon, link }) => {
  const history = useHistory();

  const handleCardClick = () => {
    history.push(link);
  };

  return (
    <div className="card-widget" onClick={handleCardClick}>
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default CardWidget;
