import React, { useState, useEffect } from 'react';
import sockeIOClient from 'socket.io-client';
import Tone from 'tone';
import styled from 'styled-components';

import Textfield from '@material-ui/core/TextField';

import { fetchRequest } from '../../utils/helpers';
import './style.css';
import Musicumulus from '../Cumulus/Musicumulus';
import { AirGuitar } from '../AirGuitar';
import { API_GATEWAY_URL, API_GATEWAY_PATH } from 'utils/constants';
import makePiece, { generateRandomSequence } from '../../helpers/generator';
import { pentaMinor } from '../../helpers/generator';
import { addPattern } from '../../helpers/generator';
import WanderingCumulus from 'Components/Cumulus/WanderingCumulus';
import { random } from 'utils/helpers';

const headerHeight = 50;
const cloudBaseWidth = 100;
const chuteMax = window.innerHeight - 10;
const cloudHeight = Math.round(cloudBaseWidth / 3 + (cloudBaseWidth * 35) / 150);
const wanderingScaleFactor = 1 / 3;
const musicSheetHeight = Math.round(window.innerHeight * (1 - wanderingScaleFactor));
const wanderingHeight = window.innerHeight * wanderingScaleFactor;
const deriveMax = window.innerWidth - cloudBaseWidth;
const verticalspace = Math.round((musicSheetHeight - headerHeight) / 4);

const chords = [
  { chordAltitude: musicSheetHeight - cloudHeight, leftNote: 'ricochet', rightNote: 'simulacre' },
  { chordAltitude: musicSheetHeight - verticalspace - cloudHeight, leftNote: 'fantome', rightNote: 'mur' },
  { chordAltitude: musicSheetHeight - 2 * verticalspace - cloudHeight, leftNote: 'calme', rightNote: 'vent' },
  { chordAltitude: musicSheetHeight - 3 * verticalspace - cloudHeight, leftNote: 'machicoulis', rightNote: 'vitre' },
];

const createCloud = (id, name, sheet, initialPos, baseWidth) => {
  return {
    id,
    name,
    sheet,
    initialPos,
    baseWidth,
  };
};

const initialPos = sheet => {
  return { x: sheet[0].note * deriveMax, y: chuteMax };
};

const Musiciel = ({ location: { search } }) => {
  const [cloudId, setCloudId] = useState(0);
  const [clouds, setClouds] = useState([]);
  const [pentaKey, setPentaKey] = useState('F');
  const [musicloud, setMusicloud] = useState(null);
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

  // const urlParam = new URLSearchParams(search);
  // console.log(urlParam.get('all'));
  React.useEffect(() => {
    /*makePiece(pentaMinor[pentaKey]).then(cleanUp => {
      Tone.Transport.start();
    });*/
    const pattern = `Drums${Math.ceil(Math.random() * 4)}`;
    const bass = `Bass${Math.ceil(Math.random() * 4)}`;
    const chord = `Chords${Math.ceil(Math.random() * 4)}`;
    const melody = `Melodies${Math.ceil(Math.random() * 4)}`;

    // console.log('add pattern');
    // addPattern(null, pattern);
    // addPattern(null, bass);
    // addPattern(null, chord);
    // addPattern(null, melody);

    // Tone.Transport.start();
  }, [pentaKey]);

  const switchKey = key =>
    new Promise(resolve => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      resolve();
    }).then(() => setPentaKey(key));

  const addCloud = nuageName => {
    const l = [...clouds, nuageName];
    setClouds(l);
  };

  // receive clouds from other skies
  useEffect(() => {
    const socket = sockeIOClient(API_GATEWAY_URL, { path: API_GATEWAY_PATH });
    socket.on('upload', upcomingClouds => {
      if (upcomingClouds.length === 0) return;

      let musicloudOffset = 0;
      if (musicloud === null) {
        const newMusicloudName = upcomingClouds.shift();
        const sheet = createRandomSheet();
        const baseWidth = Math.max(Math.round(random(80, 160)), nuageName.length * 8);
        setMusicloud(createCloud(cloudId, newMusicloudName, sheet, initialPos(sheet), baseWidth));
        musicloudOffset += 1;
      }

      const l = [
        ...clouds,
        ...upcomingClouds.map((cloudName, index) => {
          const sheet = createRandomSheet();
          const baseWidth = Math.max(Math.round(random(80, 160)), nuageName.length * 8);
          return createCloud(cloudId + musicloudOffset + index, cloudName, sheet, initialPos(sheet), baseWidth);
        }),
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
    let sheet;
    try {
      const response = await fetchRequest('http://127.0.0.1:5000/word_music_sheet', 'POST', body);
      sheet = await response.json();
    } catch {
      sheet = createRandomSheet();
    }
    const baseWidth = Math.max(Math.round(random(80, 160)), nuageName.length * 8);
    const initialPos = { x: sheet[0].note * deriveMax, y: chuteMax };
    if (musicloud === null) {
      setMusicloud(createCloud(cloudId, nuageNameLowerCase, sheet, initialPos, baseWidth));
    } else {
      addCloud(createCloud(cloudId, nuageNameLowerCase, sheet, initialPos, baseWidth));
    }
    setNuageName('');
    setHasAlreadyDrawn(true);
    setCloudId(cloudId + 1);
  };

  const handleSkyLanding = () => {
    if (clouds.length === 0) return setMusicloud(null);
    const initialPos = {
      x: document.getElementById(clouds[0].id).getBoundingClientRect().x,
      y: document.getElementById(clouds[0].id).getBoundingClientRect().y,
    };
    const newMusicloud = clouds.shift();
    newMusicloud.initialPos = initialPos;
    setMusicloud(newMusicloud);
    setClouds(clouds);
  };
  return (
    <div className="ciel">
      {clouds.map(cloud => (
        <WanderingCumulus
          cloudId={cloud.id}
          key={cloud.id}
          cloudBaseWidth={cloudBaseWidth}
          cloudHeight={cloudHeight}
          deriveMax={deriveMax}
          nuageName={cloud.name}
          baseWidth={cloud.baseWidth}
          meanHeight={musicSheetHeight + wanderingHeight / 2}
          wanderingHeight={wanderingHeight}
        />
      ))}
      <AirGuitar chords={chords} baseWidth={Math.round(cloudBaseWidth)} />
      {musicloud && (
        <Musicumulus
          key={musicloud.id}
          pentaKey={pentaKey}
          initialPos={musicloud.initialPos}
          deriveMax={deriveMax}
          nuageName={musicloud.name}
          musicSheet={musicloud.sheet}
          baseWidth={musicloud.baseWidth}
          handleSkyLanding={handleSkyLanding}
        />
      )}
      <div className="superficiel">
        <form onSubmit={dessineLeNuage} className="dessinage">
          <Textfield
            style={{ color: 'lightgray' }}
            onChange={event => {
              setNuageName(event.target.value);
            }}
            value={nuageName}
            placeholder={clouds.length === 0 && !hasAlreadyDrawn ? 'Nommage' : null}
          />
          <div className="ambiancage">
            {Object.keys(pentaMinor).map(key => (
              <KeyButton selected={key === pentaKey} type="button" onClick={() => switchKey(key)}>
                {key}
              </KeyButton>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

const KeyButton = styled.button`
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  color: lightgray;
  text-decoration: ${props => (props.selected ? 'underline' : 'none')};
`;

export default Musiciel;
