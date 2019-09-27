import React, { useState } from 'react';

import Textfield from '@material-ui/core/Textfield';

import './style.css';
import Musicumulus from 'Components/Cumulus/Musicumulus';
import { CloudChord } from 'Components/CloudChord';
import { AirGuitar } from 'Components/AirGuitar';

const cloudBaseHeight = 50;
const cloudBaseWidth = 150;
const chuteMax = window.innerHeight;
const deriveMax = window.innerWidth - cloudBaseWidth;
const twoPi = Math.PI * 2;

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

  const dessineLeNuage = event => {
    event.preventDefault();
    var nuageNameLowerCase = nuageName.split(' ')[0].toLocaleLowerCase();

    if (clouds.includes(nuageNameLowerCase)) {
      setNuageName('');
      return;
    }
    addCloud(nuageNameLowerCase);
    setHasAlreadyDrawn(true);
  };

  const chords = [chuteMax - 150, chuteMax - 300, chuteMax - 450, chuteMax - 600];

  const musicSheet = chords.map(chord => ({ chord, note: Math.random() * deriveMax }));

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
