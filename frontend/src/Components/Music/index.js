import React from 'react';
import Tone from 'tone';
import styled from 'styled-components';

import drum from '../../assets/sounds/drum0.wav';
import bass from '../../assets/sounds/bass0.wav';

const drumBuffer = new Tone.Buffer(require('../../assets/sounds/drum0.wav'));
const bassBuffer = new Tone.Buffer(bass);

const String = styled.div`
  width: 100%;
  display: flex;
`;

const Note = styled.button`
  padding: 0.5em 1em;
  flex-grow: 1;
`;

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const notez = {
  e: ['E5', 'F5', 'Gb5', 'G5'],
  B: ['B4', 'C5', 'Db5', 'D5'],
  G: ['G4', 'Ab4', 'A4', 'Bb4'],
  D: ['D4', 'Eb4', 'E4', 'F4'],
  A: ['A3', 'Bb3', 'B3', 'C4'],
  E: ['E3', 'F3', 'Gb3', 'G3'],
};

const NoteButton = props => {
  return <Note {...props} />;
};

function noteHandler(note, Component, catchNote) {
  const synth = new Tone.Synth({
    oscillator: {
      type: 'sawtooth',
    },
    envelope: {
      attack: 0.005,
      decay: 0.1,
      sustain: 0.3,
      release: 0.5,
    },
  }).toMaster();
  return (
    <Component
      onClick={() => {
        catchNote(note);
        synth.triggerRelease();
      }}
      onMouseEnter={() => synth.triggerAttack(note)}
      onMouseLeave={() => synth.triggerRelease()}
    >
      {note}
    </Component>
  );
}

export default () => {
  const [trackedNotes, setTrackedNotes] = React.useState(
    Object.keys(notez).reduce((result, key) => ({ ...result, [key]: null }), {}),
  );

  const onNoteCatch = string => note => {
    setTrackedNotes(tracked => ({
      ...tracked,
      [string]: note,
    }));
  };

  const playChord = () => {
    const notes = Object.keys(trackedNotes).reduce(
      (result, key) => (trackedNotes[key] ? [...result, trackedNotes[key]] : result),
      [],
    );
    if (notes.length > 0) {
      const distortion = new Tone.Distortion(0.6);
      const tremolo = new Tone.Tremolo().start();
      const polySynth = new Tone.PolySynth(notes.length, Tone.Synth).toMaster(); // .chain(distortion, tremolo, Tone.Master);
      polySynth.triggerAttackRelease(notes, '8th');
    }
  };

  React.useEffect(() => {
    async function loadWav() {
      try {
        const players = await new Tone.Players({ bassBuffer, drumBuffer }).toMaster();

        console.log(players.get('drumBuffer'))
        const drumz = players.get('drumBuffer');
        const bassz = players.get('bassBuffer');
        const drumLoop = new Tone.Loop(time => {
          drumz.start(0);
        }, '8n');
        Tone.Transport.toggle()
        for (let i in players._players) {
          // console.log(i, players._players[i]._buffer.duration);
          /*const loop = new Tone.Loop(function(time) {
            players._players[i].start(0);
          }, '2nd').start(0);*/
          // players._players[i].start(0);
        }
      } catch (error) {
        console.log(error);
      }
    }
    loadWav();
  }, []);
  return (
    <Container>
      <div>
        <button onClick={() => playChord()}>Play Chord</button>
        <button
          onClick={() => setTrackedNotes(Object.keys(notez).reduce((result, key) => ({ ...result, [key]: null }), {}))}
        >
          Clear Notes
        </button>
        <div>Notes : {Object.keys(trackedNotes).map(key => trackedNotes[key])}</div>
      </div>
      {Object.keys(notez).map((string, index) => {
        return <String>{notez[string].map(note => noteHandler(note, NoteButton, onNoteCatch(string)))}</String>;
      })}
    </Container>
  );
};
