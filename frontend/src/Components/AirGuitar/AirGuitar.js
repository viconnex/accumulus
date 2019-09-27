import React from 'react';
import { CloudChord } from 'Components/CloudChord';

const AirGuitar = ({ chords }) => {
  return (
    <div>
      {chords.map(chord => {
        return <CloudChord chord={chord} />;
      })}
    </div>
  );
};

export default AirGuitar;
