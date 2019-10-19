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
const wanderingScaleFactor = 1 / 3.5;
const uploadedScaleFactor = 1 / 3.5;

const musicSheetHeight = Math.round(window.innerHeight * (1 - wanderingScaleFactor - uploadedScaleFactor));
const wanderingHeight = Math.round(window.innerHeight * wanderingScaleFactor * 0.8);
const uploadedHeight = Math.round(window.innerHeight * uploadedScaleFactor);
export const deriveMax = window.innerWidth - cloudBaseWidth;
const verticalspace = Math.round((musicSheetHeight - headerHeight) / 2.5);

const REPLACEMENT_THRESHOLD = 0.9;

const createCloud = (id, name, sheet, initialPos, baseWidth) => {
  const cloud = {
    id,
    name,
    sheet,
    initialPos,
    baseWidth,
  };
  const closeWords = [];
  sheet.forEach((chord, index) => {
    if (1 - chord.note > REPLACEMENT_THRESHOLD) {
      closeWords.push({ x: 30, y: chord.chordAltitude, index, pos: 'left' });
    }
    if (chord.note > REPLACEMENT_THRESHOLD) {
      closeWords.push({ x: deriveMax - 30, y: chord.chordAltitude, index, pos: 'right' });
    }
  });

  if (closeWords.length > 0) {
    cloud.replacementPos = closeWords[Math.round(Math.random() * closeWords.length)];
  }

  return cloud;
};

const initialPos = sheet => {
  return { x: sheet[0].note * deriveMax, y: chuteMax };
};

const Musiciel = ({ location: { search } }) => {
  const [cloudId, setCloudId] = useState(0);
  const [clouds, setClouds] = useState([]);
  const [uploadedClouds, setUploadedClouds] = useState([]);
  const [pentaKey, setPentaKey] = useState('F');
  const [musicloud, setMusicloud] = useState(null);
  const [nuageName, setNuageName] = useState('');
  const [hasAlreadyDrawn, setHasAlreadyDrawn] = useState(false);
  const [words, setWords] = useState([
    { left: 'ricochet', right: 'sapin' },
    { left: 'flibustier', right: 'verrou' },
    { left: 'machicoulis', right: 'fantôme' },
    { left: 'ascenseur', right: 'coquelicot' },
  ]);

  const chords = words.map((wordPair, index) => {
    return {
      chordAltitude: musicSheetHeight + uploadedHeight - index * verticalspace,
      leftNote: wordPair.left,
      rightNote: wordPair.right,
    };
  });

  const createRandomSheet = () => {
    return chords.map(({ chordAltitude, leftNote, rightNote }) => ({
      chordAltitude,
      leftNote,
      rightNote,
      note: Math.random(),
    }));
  };

  const getBaseWidth = () => {
    return Math.max(Math.round(random(50, 130)), nuageName.length * 8);
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

  const addCloud = newCloud => {
    const l = [...clouds, newCloud];
    setClouds(l);
  };

  const getMusicSheet = async (word, chords) => {
    try {
      const response = await fetchRequest('http://127.0.0.1:5000/word_music_sheet', 'POST', { word, chords });
      const sheet = await response.json();
      return sheet;
    } catch {
      return createRandomSheet();
    }
  };

  // receive clouds from other skies
  useEffect(() => {
    const socket = sockeIOClient(API_GATEWAY_URL, { path: API_GATEWAY_PATH });
    socket.on('upload', async upcomingClouds => {
      if (upcomingClouds.length === 0) return;
      let musicloudOffset = 0;
      if (musicloud === null) {
        const newMusicloudName = upcomingClouds.shift();
        const sheet = await getMusicSheet(newMusicloudName, chords);
        const baseWidth = getBaseWidth();
        setMusicloud(createCloud(cloudId, newMusicloudName, sheet, initialPos(sheet), baseWidth));
        musicloudOffset += 1;
      }

      for (let index = 0; index < upcomingClouds.length; index++) {
        const sheet = await getMusicSheet();
        const baseWidth = getBaseWidth();
        clouds.push(
          createCloud(cloudId + musicloudOffset + index, upcomingClouds[index], sheet, initialPos(sheet), baseWidth),
        );
      }
      setClouds(clouds);
      setCloudId(cloudId + upcomingClouds.length);
    });
    return () => {
      socket.close();
    };
  }, [clouds, cloudId]);

  const dessineLeNuage = async event => {
    event.preventDefault();
    var nuageNameLowerCase = nuageName.split(' ')[0].toLocaleLowerCase();

    const sheet = await getMusicSheet(nuageNameLowerCase, chords);
    const baseWidth = getBaseWidth();
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
    if (!musicloud.replacementPos) {
      musicloud.initialPos = {
        x: document.getElementById(musicloud.id).getBoundingClientRect().x,
        y: document.getElementById(musicloud.id).getBoundingClientRect().y,
      };
      const newUploadedCloudsList = [...uploadedClouds, musicloud];
      setUploadedClouds(newUploadedCloudsList);
    } else {
      const wordToUpdate = words[musicloud.replacementPos.index];
      words[musicloud.replacementPos.index] = { ...wordToUpdate, [musicloud.replacementPos.pos]: musicloud.name };
      setWords(words);
    }

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
          nuageName={cloud.name}
          baseWidth={cloud.baseWidth}
          cloudBaseWidth={cloudBaseWidth}
          cloudHeight={cloudHeight}
          meanHeight={uploadedHeight + musicSheetHeight + cloudHeight + wanderingHeight / 2}
          wanderingHeight={wanderingHeight}
          style={{ opacity: 0.7 }}
        />
      ))}
      <AirGuitar chords={chords} baseWidth={Math.round(cloudBaseWidth)} />
      {musicloud && (
        <Musicumulus
          cloudId={musicloud.id}
          key={musicloud.id}
          pentaKey={pentaKey}
          initialPos={musicloud.initialPos}
          deriveMax={deriveMax}
          nuageName={musicloud.name}
          musicSheet={musicloud.sheet}
          baseWidth={musicloud.baseWidth}
          handleSkyLanding={handleSkyLanding}
          style={{ opacity: 0.9 }}
          replacementPos={musicloud.replacementPos}
        />
      )}
      {uploadedClouds.map(cloud => (
        <WanderingCumulus
          cloudId={cloud.id}
          key={cloud.id}
          nuageName={cloud.name}
          baseWidth={cloud.baseWidth}
          initialPos={cloud.initialPos}
          cloudBaseWidth={cloudBaseWidth}
          cloudHeight={cloudHeight}
          meanHeight={uploadedHeight / 2}
          wanderingHeight={uploadedHeight}
          style={{ opacity: 0.7 }}
        />
      ))}
      <div className="superficiel">
        <form onSubmit={dessineLeNuage} className="dessinage">
          <Textfield
            // style={{ color: 'lightgray' }}
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
