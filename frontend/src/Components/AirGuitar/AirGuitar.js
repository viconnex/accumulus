import React from 'react';
import { Nuage } from 'Components/Cumulus/Nuage';
import styled from 'styled-components';

const RightNote = styled.div`
  opacity: 0.7;
  position: absolute;
  top: ${props => props.chordAltitude}px;
  right: 30px;
`;

const LeftNote = styled.div`
  opacity: 0.7;
  position: absolute;
  top: ${props => props.chordAltitude}px;
  left: 30px;
`;

const CloudChord = ({ chord, baseWidth }) => {
  return (
    <React.Fragment>
      <LeftNote chordAltitude={chord.chordAltitude}>
        <Nuage nuageName={chord.leftNote} baseWidth={baseWidth} />
      </LeftNote>
      <RightNote chordAltitude={chord.chordAltitude}>
        <Nuage nuageName={chord.rightNote} baseWidth={baseWidth} />
      </RightNote>
    </React.Fragment>
  );
};

const AirGuitar = ({ chords, baseWidth }) => {
  return (
    <div>
      {chords.map(chord => {
        return <CloudChord key={chord.leftNote + chord.rightNote} chord={chord} baseWidth={baseWidth} />;
      })}
    </div>
  );
};

export default AirGuitar;
