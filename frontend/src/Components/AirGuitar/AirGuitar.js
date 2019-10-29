import React from 'react';
import { Nuage } from 'Components/Cumulus/Nuage';
import styled from 'styled-components';

import { AIR_GUITAR_OFFSET } from 'utils/constants';
import Star from 'icons/star.png';
import { deriveMax, cloudBaseWidth, backgrounds } from 'Components/Musiciel/Musiciel';

const RightNote = styled.div`
  opacity: 0.7;
  position: absolute;
  top: ${props => props.chordAltitude}px;
  right: ${AIR_GUITAR_OFFSET}px;
`;

const LeftNote = styled.div`
  opacity: 0.7;
  position: absolute;
  top: ${props => props.chordAltitude}px;
  left: ${AIR_GUITAR_OFFSET}px;
`;

const StarTarget = styled.div`
  opacity: 0.7;
  position: absolute;
  top: ${props => props.chordAltitude}px;
  left: ${props => props.horizontalPos}px;
`;

const CloudChord = ({ chord, baseWidth, target, background }) => {
  const horizontalPos =
    target * (deriveMax - 2 * AIR_GUITAR_OFFSET - 2 * cloudBaseWidth) + AIR_GUITAR_OFFSET + cloudBaseWidth;
  return (
    <React.Fragment>
      <LeftNote chordAltitude={chord.chordAltitude}>
        <Nuage
          fontColor={'white'}
          color={background}
          nuageName={chord.leftNote}
          baseWidth={baseWidth}
          borderWidth={0}
        />
      </LeftNote>
      <StarTarget chordAltitude={chord.chordAltitude} horizontalPos={horizontalPos}>
        <img alt="" src={Star} style={{ width: '25px' }} />
      </StarTarget>
      <RightNote chordAltitude={chord.chordAltitude}>
        <Nuage
          fontColor={'white'}
          color={background}
          nuageName={chord.rightNote}
          baseWidth={baseWidth}
          borderWidth={0}
        />
      </RightNote>
    </React.Fragment>
  );
};

const AirGuitar = ({ targets, chords, baseWidth }) => {
  return (
    <div>
      {chords.map((chord, index) => {
        return (
          <CloudChord
            key={chord.leftNote + chord.rightNote}
            chord={chord}
            baseWidth={baseWidth}
            target={targets[index]}
            background={backgrounds[index]}
          />
        );
      })}
    </div>
  );
};

export default AirGuitar;
