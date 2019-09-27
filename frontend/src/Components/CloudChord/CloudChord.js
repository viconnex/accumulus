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

const CloudChord = ({ chord }) => {
  return (
    <React.Fragment>
      <LeftNote chordAltitude={chord.chordAltitude}>
        <Nuage nuageName={chord.leftNote} baseWidth="150" />
      </LeftNote>
      <RightNote chordAltitude={chord.chordAltitude}>
        <Nuage nuageName={chord.rightNote} baseWidth="150" />
      </RightNote>
    </React.Fragment>
  );
};

export default CloudChord;
