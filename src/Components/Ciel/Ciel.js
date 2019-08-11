import React, { useState, useEffect } from 'react';
import Cumulus from '../Cumulus/Cumulus';
import Textfield from '@material-ui/core/Textfield';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { fetchRequest } from '../../utils/helpers';
import UploadLogo from '../../icons/upload.png';

import './style.css';

// const rimages = require('../../utils/dictionnage.json');

const rimeWith = (word, suffixe) => {
  const preRime = word.split(suffixe);
  return preRime.length > 1 && preRime[preRime.length - 1] === '';
};

const nuagesToCloud = (name, clouds) => {
  const url = 'https://theodercafe.com/api/accumulus';
  const body = { name, nuages: clouds };
  fetchRequest(url, 'POST', body);
};

const Ciel = () => {
  // const [clouds, setClouds] = useState(['age', 'cage', 'rage', 'duage', 'hommage']);
  const [clouds, setClouds] = useState([]);
  const [nuageName, setNuageName] = useState('');
  const [upload, setUpload] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [cloudsLandedCount, setCloudsLandedCount] = useState(0);

  const addCloud = nuageName => {
    const l = [...clouds, nuageName];
    setClouds(l);
    setNuageName('');
  };

  const dessineLeNuage = event => {
    event.preventDefault();
    var nuageNameLowerCase = nuageName.split(' ')[0].toLocaleLowerCase();
    if (!rimeWith(nuageNameLowerCase, 'age') && !rimeWith(nuageNameLowerCase, 'âge')) {
      // eslint-disable-next-line no-alert
      alert('Ce mot ne rime pas avec nuage');

      return;
    }

    if (nuageNameLowerCase.charAt(nuageNameLowerCase.length - 1) === ' ') {
      nuageNameLowerCase = nuageNameLowerCase.slice(0, -1);
    }
    if (clouds.includes(nuageNameLowerCase)) {
      setNuageName('');

      return;
    }
    addCloud(nuageNameLowerCase);
    // if (rimages[nuageName]) {
    //   addCloud(nuageName);
    // } else {
    //   eslint-disable-next-line no-alert
    //   alert("Ce mot n'existe pas encore");
    // }
  };
  const handleUpload = () => {
    if (clouds.length > 0 && !upload) {
      nuagesToCloud('bibi', clouds);
      setUpload(true);
      setHasUploaded(true);
    }
  };

  useEffect(() => {
    if (upload && cloudsLandedCount >= clouds.length && clouds.length > 0) {
      setUpload(false);
      setCloudsLandedCount(0);
      setClouds([]);
    }
  }, [cloudsLandedCount, upload, clouds]);

  const handleSkyLanding = () => {
    const count = cloudsLandedCount;
    setCloudsLandedCount(count + 1);
  };

  return (
    <div className="ciel">
      {clouds.map(nuageName => {
        return <Cumulus key={nuageName} nuageName={nuageName} upload={upload} handleSkyLanding={handleSkyLanding} />;
      })}
      <div className="superficiel">
        <form onSubmit={dessineLeNuage} className="dessinage">
          <Textfield
            onChange={event => {
              setNuageName(event.target.value);
            }}
            value={nuageName}
            placeholder={clouds.length === 0 && !hasUploaded ? 'Nommage' : null}
          />
        </form>
        <Tooltip title="Envoyage">
          <IconButton style={{ position: 'absolute', right: '10px', top: '5px' }} onClick={handleUpload}>
            <img alt="" src={UploadLogo} style={{ width: '25px', opacity: '0.9' }} className={upload ? 'upload' : ''} />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default Ciel;
