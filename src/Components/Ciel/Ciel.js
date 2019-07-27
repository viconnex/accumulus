import React from 'react';
import Cumulus from '../Cumulus/Cumulus';
import './style.css';

const cloudBaseHeight = 50;
const cloudHeight = 85;

const Ciel = () => {
  const [state, setState] = React.useState({
    clouds: [],
    nuageName: null,
  });

  const addCloud = nuageName => {
    const l = [...state.clouds, nuageName];
    setState({ ...state, clouds: l });
  };

  const dessineLeNuage = event => {
    event.preventDefault();
    addCloud(state.nuage);
    setState({ ...state, nuageName: null });
  };

  return (
    <div className="ciel">
      <form onSubmit={dessineLeNuage}>
        <input
          type="text"
          onChange={event => {
            setState({ ...state, nuageName: event.target.value });
          }}
          value={state.nuageName}
        />
        <input type="submit" />
      </form>
      <button onClick={addCloud} className="addCloud">
        Nuage
      </button>
      {state.clouds.map((nuageName, index) => {
        const chute = window.innerHeight - index * cloudHeight - cloudBaseHeight;
        return <Cumulus key={nuageName} chute={chute} nuageName={nuageName} />;
      })}
    </div>
  );
};

export default Ciel;
