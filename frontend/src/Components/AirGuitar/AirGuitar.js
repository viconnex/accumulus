import React from 'react';
import { CloudChord } from 'Components/CloudChord';

const AirGuitar = ({ chords }) => {
  return (
    <div>
      {chords.map(y => {
        return <CloudChord y={y} />;
      })}
    </div>
  );
};

export default AirGuitar;
