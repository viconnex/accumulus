import React from 'react';
import Cumulus from '../Cumulus/Cumulus';
import Textfield from '@material-ui/core/Textfield';
import './style.css';

const rimages = require('../../utils/dictionnage.json');

const rimeWith = (word, suffixe) => {
  const preRime = word.split(suffixe);
  return preRime.length > 1 && (preRime[preRime.length - 1] !== '' || preRime[preRime.length - 1] !== ' ');
};

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
    if (!rimeWith(nuageName, 'age') && !rimeWith(nuageName, 'âge')) {
      // eslint-disable-next-line no-alert
      alert('Ce mot ne rime pas avec nuage');

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
      addCloud(nuageName);
    } else {
      // eslint-disable-next-line no-alert
      alert("Ce mot n'existe pas encore");
    }
  };

  return (
    <div className="ciel">
      {state.clouds.map((nuageName, index) => {
        return <Cumulus key={nuageName} nuageName={nuageName} />;
      })}
      <form onSubmit={dessineLeNuage} className="dessinage">
        <Textfield
          onChange={event => {
            setState({ ...state, nuageName: event.target.value });
          }}
          value={state.nuageName}
          placeholder={state.clouds.length === 0 ? 'Nom du nuage' : null}
        />
      </form>
    </div>
  );
};

export default Ciel;
