import React from 'react';
import Cumulus from '../Cumulus/Cumulus';
import Textfield from '@material-ui/core/Textfield';
import './style.css';

const cloudBaseHeight = 50;
const cloudHeight = 85;

const Ciel = () => {
  const [state, setState] = React.useState({
    clouds: [],
    nuageName: '',
  });
  const addCloud = nuageName => {
    const l = [...state.clouds, nuageName];
    setState({ nuageName: '', clouds: l });
  };

  const dessineLeNuage = event => {
    event.preventDefault();
    const rime = state.nuageName.split('age');
    if (rime.length > 1 && rime[rime.length - 1] === '') {
      addCloud(state.nuageName);
    } else {
      // eslint-disable-next-line no-alert
      alert('ce mot ne rime pas avec age');
    }
  };

  return (
    <div className="ciel">
      <form onSubmit={dessineLeNuage}>
        <Textfield
          onChange={event => {
            setState({ ...state, nuageName: event.target.value });
          }}
          value={state.nuageName}
        />
      </form>
      {state.clouds.map((nuageName, index) => {
        const chute = window.innerHeight - index * cloudHeight - cloudBaseHeight;
        return <Cumulus key={nuageName} chute={chute} nuageName={nuageName} />;
      })}
    </div>
  );
};

export default Ciel;
