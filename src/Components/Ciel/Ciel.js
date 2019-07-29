import React from 'react';
import Cumulus from '../Cumulus/Cumulus';
import Textfield from '@material-ui/core/Textfield';
import './style.css';

const rimages = require('../../utils/dictionnage.json');

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
    var nuageName = state.nuageName.toLocaleLowerCase();
    const preRime = state.nuageName.split('age');
    if (preRime.length === 1 || (preRime[preRime.length - 1] !== '' && preRime[preRime.length - 1] !== ' ')) {
      // eslint-disable-next-line no-alert
      alert('Ce mot ne rime pas avec nuage');
      setState({ ...state, nuageName: '' });

      return;
    }
    if (nuageName.charAt(nuageName.length - 1) === ' ') {
      nuageName = nuageName.slice(0, -1);
    }
    if (state.clouds.includes(nuageName)) {
      setState({ ...state, nuageName: '' });

      return;
    }
    if (rimages[nuageName]) {
      addCloud(state.nuageName);
    } else {
      // eslint-disable-next-line no-alert
      alert("Ce mot n'existe pas encore");
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
