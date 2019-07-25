import React from 'react';
import './style.css';
import styled, { keyframes } from 'styled-components';

const cloudHeight = 100;
const getChute = altitude => window.innerHeight - altitude;

const fallingKeyFrame = chute => keyframes`
    from {
        transform: translateY(-100px);
    }
    to {
        transform: translateY(${chute}px);
    }
`;

const StyledCumulus = styled.div`
  animation-name: ${props => fallingKeyFrame(getChute(props.altitude))};
  animation-duration: 5s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
`;

const Cumulus = ({ altitude }) => {
  return (
    <StyledCumulus className="cumulus" altitude={altitude}>
      <div className="cloud" />
      <div className="surrimage">
        <div className="rimage">Nuage</div>
      </div>
    </StyledCumulus>
  );
};

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
        const altitude = (cloudIndex + 1) * cloudHeight;
        console.log(altitude);
        return <Cumulus key={cloudIndex} altitude={altitude} />;
      })}
    </div>
  );
};

export default Ciel;
