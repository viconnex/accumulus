import React from 'react';
import Cumulus2 from '../Cumulus/Cumulus';
import './style.css';

const cloudBaseHeight = 50;
const cloudHeight = 85;

const Ciel = () => {
  const [clouds, setClouds] = React.useState([]);

  const addCloud = () => {
    const l = [...clouds, clouds.length];
    setClouds(l);
  };

  return (
    <div className="ciel">
      <button onClick={addCloud} className="addCloud">
        Nuage
      </button>
      {clouds.map(cloudIndex => {
        const chute = window.innerHeight - cloudIndex * cloudHeight - cloudBaseHeight;
        return <Cumulus2 chute={chute} />;
      })}
    </div>
  );
};

export default Ciel;
