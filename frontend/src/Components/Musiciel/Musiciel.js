import React, { useState } from 'react';

import Textfield from '@material-ui/core/Textfield';

import { fetchRequest } from 'utils/helpers';
import './style.css';
import Musicumulus from 'Components/Cumulus/Musicumulus';
import { AirGuitar } from 'Components/AirGuitar';
import WanderingCumulus from 'Components/Cumulus/WanderingCumulus';

const cloudBaseWidth = 100;
const cloudHeight = cloudBaseWidth / 3 + (cloudBaseWidth * 35) / 150;
const musicSheetHeight = (window.innerHeight * 2) / 3;
const wanderingHeight = window.innerHeight / 3;
const deriveMax = window.innerWidth - cloudBaseWidth;

const verticalspace = 1.8 * cloudHeight;

const chords = [
  { chordAltitude: musicSheetHeight - cloudHeight, leftNote: 'Ricochet', rightNote: 'Simulacre' },
  { chordAltitude: musicSheetHeight - verticalspace - cloudHeight, leftNote: 'Fantome', rightNote: 'Mur' },
  { chordAltitude: musicSheetHeight - 2 * verticalspace - cloudHeight, leftNote: 'Calme', rightNote: 'Vent' },
  { chordAltitude: musicSheetHeight - 3 * verticalspace - cloudHeight, leftNote: 'Machicoulis', rightNote: 'Vitre' },
];

let cloudId = 0;

const Musiciel = () => {
  // const [clouds, setClouds] = useState(['age', 'cage', 'rage', 'duage', 'hommage']);
  const [clouds, setClouds] = useState([]);
  const [musicumulus, setMusicCloud] = useState(null);
  const [nuageName, setNuageName] = useState('');
  const [hasAlreadyDrawn, setHasAlreadyDrawn] = useState(false);

  const addCloud = nuageName => {
    const l = [...clouds, nuageName];
    setClouds(l);
    setNuageName('');
  };

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
      addCloud({ name: nuageNameLowerCase, sheet, id: cloudId });
    } catch {
      addCloud({
        name: nuageNameLowerCase,
        id: cloudId,
        sheet: chords.map(({ chordAltitude, leftNote, rightNote }) => ({
          chordAltitude,
          leftNote,
          rightNote,
          note: Math.random(),
        })),
      });
    }
    cloudId += 1;
    setHasAlreadyDrawn(true);
  };

  const handleSkyLanding = cloudId => () => {
    const l = clouds.filter(cloud => cloud.id !== cloudId);
    setClouds(l);
  };
  return (
    <div className="ciel">
      {clouds.map(cloud => (
        <WanderingCumulus
          key={cloud.id}
          cloudBaseWidth={cloudBaseWidth}
          cloudHeight={cloudHeight}
          deriveMax={deriveMax}
          nuageName={cloud.name}
          musicSheet={cloud.sheet}
          meanHeight={musicSheetHeight + wanderingHeight / 2}
          wanderingHeight={wanderingHeight}
          handleSkyLanding={handleSkyLanding(cloud.id)}
        />
      ))}
      {musicumulus && (
        <Musicumulus
          nuageName={musicumulus.name}
          musicSheet={musicumulus.sheet}
          deriveMax={deriveMax}
          handleSkyLanding={handleSkyLanding(musicumulus.id)}
        />
      )}
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
