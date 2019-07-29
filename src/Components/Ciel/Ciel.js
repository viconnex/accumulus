import React from 'react';
import Cumulus from '../Cumulus/Cumulus';
import Textfield from '@material-ui/core/Textfield';
import './style.css';

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
      alert('Ce mot ne rime pas avec nuage');
    }
  };

  return (
    <div className="ciel">
      <form onSubmit={dessineLeNuage} className="dessinage">
        <Textfield
          onChange={event => {
            setState({ ...state, nuageName: event.target.value });
          }}
          value={state.nuageName}
        />
      </form>
      {state.clouds.map((nuageName, index) => {
        return <Cumulus key={nuageName} nuageName={nuageName} />;
      })}
    </div>
  );
};

export default Ciel;
