import React from 'react';
import Tone from 'tone';
import styled from 'styled-components';

const Button = styled.button`
  padding: 0.5em 1em;
`;

const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const NoteButton = props => {
  return <Button {...props} />;
};

function noteHandler(note, Component) {
  const synth = new Tone.Synth().toMaster();

  return (
    <Component onMouseEnter={() => synth.triggerAttack(note)} onMouseLeave={() => synth.triggerRelease()}>
      {note}
    </Component>
  );
}

export default () => {
  return (
    <div>
      <h4>somethings</h4>
      {notes.map(note => noteHandler(`${note}3`, NoteButton))}
    </div>
  );
};
