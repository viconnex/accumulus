import React, { useState, useEffect } from 'react';
import sockeIOClient from 'socket.io-client';

import Textfield from '@material-ui/core/TextField';

import { fetchRequest } from '../../utils/helpers';
import './style.css';
import Musicumulus from '../Cumulus/Musicumulus';
import { AirGuitar } from '../AirGuitar';
import { API_GATEWAY_URL, API_GATEWAY_PATH } from 'utils/constants';

const cloudBaseWidth = 100;
const cloudHeight = cloudBaseWidth / 3 + (cloudBaseWidth * 35) / 150;
const wanderingScaleFactor = 0 / 3;
const musicSheetHeight = window.innerHeight * (1 - wanderingScaleFactor);
// const wanderingHeight = window.innerHeight * wanderingScaleFactor;
const deriveMax = window.innerWidth - cloudBaseWidth;
const verticalspace = 2.5 * cloudHeight;

const chords = [
  { chordAltitude: musicSheetHeight - cloudHeight, leftNote: 'Ricochet', rightNote: 'Simulacre' },
  { chordAltitude: musicSheetHeight - verticalspace - cloudHeight, leftNote: 'Fantome', rightNote: 'Mur' },
  { chordAltitude: musicSheetHeight - 2 * verticalspace - cloudHeight, leftNote: 'Calme', rightNote: 'Vent' },
  { chordAltitude: musicSheetHeight - 3 * verticalspace - cloudHeight, leftNote: 'Machicoulis', rightNote: 'Vitre' },
];

const createCloud = (id, name, sheet) => {
  return {
    id,
    name,
    sheet,
  };
};

const Musiciel = () => {
  const [cloudId, setCloudId] = useState(0);
  const [clouds, setClouds] = useState([]);
  const [nuageName, setNuageName] = useState('');
  const [hasAlreadyDrawn, setHasAlreadyDrawn] = useState(false);

  const createRandomSheet = () => {
    return chords.map(({ chordAltitude, leftNote, rightNote }) => ({
      chordAltitude,
      leftNote,
      rightNote,
      note: Math.random(),
    }));
  };

  const addCloud = cloud => {
    const l = [...clouds, cloud];
    setClouds(l);
    setNuageName('');
  };

  useEffect(() => {
    const socket = sockeIOClient(API_GATEWAY_URL, { path: API_GATEWAY_PATH });
    socket.on('upload', upcomingClouds => {
      const l = [
        ...clouds,
        ...upcomingClouds.map((cloudName, index) => createCloud(cloudId + index, cloudName, createRandomSheet())),
      ];
      setClouds(l);
      setCloudId(cloudId + upcomingClouds.length);
    });
    return () => {
      socket.close();
    };
  }, [clouds, cloudId]);

  const dessineLeNuage = async event => {
    event.preventDefault();
    var nuageNameLowerCase = nuageName.split(' ')[0].toLocaleLowerCase();

    const body = {
      word: nuageNameLowerCase,
      chords,
    };
    try {
      const response = await fetchRequest('http://127.0.0.1:5000/word_music_sheet', 'POST', body);
      const sheet = await response.json();
      addCloud(createCloud(cloudId, nuageNameLowerCase, sheet));
    } catch {
      addCloud(createCloud(cloudId, nuageNameLowerCase, createRandomSheet()));
    }
    setHasAlreadyDrawn(true);
    setCloudId(cloudId + 1);
  };

  const handleSkyLanding = cloudId => () => {
    const l = clouds.filter(cloud => cloud.id !== cloudId);
    setClouds(l);
  };
  return (
    <div className="ciel">
      {clouds.map(cloud => (
        <Musicumulus
          key={cloud.id}
          cloudBaseWidth={cloudBaseWidth}
          cloudHeight={cloudHeight}
          deriveMax={deriveMax}
          nuageName={cloud.name}
          musicSheet={cloud.sheet}
          // meanHeight={musicSheetHeight + wanderingHeight / 2}
          // wanderingHeight={wanderingHeight}
          handleSkyLanding={handleSkyLanding(cloud.id)}
        />
      ))}
      <AirGuitar chords={chords} baseWidth={Math.round(cloudBaseWidth)} />
      <div className="superficiel">
        <form onSubmit={dessineLeNuage} className="dessinage">
          <Textfield
            onChange={event => {
              setNuageName(event.target.value);
            }}
            value={nuageName}
            placeholder={clouds.length === 0 && !hasAlreadyDrawn ? 'Nommage' : null}
          />
        </form>
      </div>
    </div>
  );
};

export default Musiciel;
