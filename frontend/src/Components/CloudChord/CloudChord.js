import React from 'react';
import { Nuage } from 'Components/Cumulus/Nuage';
import styled from 'styled-components';

const StyledChord = styled.div`
  opacity: 0.7;
  position: absolute;
  top: ${props => props.y}px;
`;

const CloudChord = ({ y }) => {
  return (
    <StyledChord y={y}>
      <Nuage name="Salopette" baseWidth="150" />
    </StyledChord>
  );
};

export default CloudChord;
