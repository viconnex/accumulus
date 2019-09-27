import React, { useState } from 'react';

import Textfield from '@material-ui/core/Textfield';

import { fetchRequest } from 'utils/helpers';
import './style.css';
import Musicumulus from 'Components/Cumulus/Musicumulus';
import { AirGuitar } from 'Components/AirGuitar';

const cloudBaseWidth = 150;
const cloudHeight = cloudBaseWidth / 3 + (cloudBaseWidth * 35) / 150;
const chuteMax = window.innerHeight;
const deriveMax = window.innerWidth - cloudBaseWidth;

const verticalspace = 1.8 * cloudHeight;

const chords = [
  { chordAltitude: chuteMax - cloudHeight, leftNote: 'Ricochet', rightNote: 'Simulacre' },
  { chordAltitude: chuteMax - verticalspace - cloudHeight, leftNote: 'Fantome', rightNote: 'Mur' },
  { chordAltitude: chuteMax - 2 * verticalspace - cloudHeight, leftNote: 'Calme', rightNote: 'Vent' },
  { chordAltitude: chuteMax - 3 * verticalspace - cloudHeight, leftNote: 'Machicoulis', rightNote: 'Vitre' },
];

const listchords = [
  { chordAltitude: chuteMax - cloudHeight, word1: 'Ricochet', word2: 'Simulacre' },
  { chordAltitude: chuteMax - verticalspace - cloudHeight, word1: 'Fantome', word2: 'Mur' },
  { chordAltitude: chuteMax - 2 * verticalspace - cloudHeight, word1: 'Calme', word2: 'Vent' },
  { chordAltitude: chuteMax - 3 * verticalspace - cloudHeight, word1: 'Machicoulis', word2: 'Vitre' },
];

const Musiciel = () => {
  // const [clouds, setClouds] = useState(['age', 'cage', 'rage', 'duage', 'hommage']);
  const [clouds, setClouds] = useState([]);
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

    // if (clouds.includes(nuageNameLowerCase)) {
    //   setNuageName('');
    //   return;
    // }
    const body = {
      word: nuageNameLowerCase,
      listchords,
    };
    const response = await fetchRequest('http://127.0.0.1:5000/word_music_sheet', 'POST', body);
    const sheet = await response.json();
    console.log('sheet', sheet);
    addCloud(nuageNameLowerCase);

    setHasAlreadyDrawn(true);
  };

  const musicSheet = chords.map(chord => ({ chordAltitude: chord.chordAltitude, note: Math.random() * deriveMax }));

  return (
    <div className="ciel">
      {clouds.map(nuageName => {
        return <Musicumulus key={nuageName} nuageName={nuageName} musicSheet={musicSheet} />;
      })}
      <AirGuitar chords={chords} />
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
