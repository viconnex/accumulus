import React from 'react';
import Tone from 'tone';
import styled from 'styled-components';
import makePiece from '../../helpers/generator';

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

const pentaMinor = {
  // G: ['As4', 'Cs5', 'Ds5', 'F5'],
  e: ['F3', 'Gs3', 'C4', 'Cs4', 'Ds4', 'F4', 'Gs4'],
  B: ['F3', 'Gs3', 'C4', 'Cs4', 'Ds4', 'F4', 'Gs4'],
  G: ['F3', 'Gs3', 'C4', 'Cs4', 'Ds4', 'F4', 'Gs4'],
  D: ['F3', 'Gs3', 'C4', 'Cs4', 'Ds4', 'F4', 'Gs4'],
  A: ['F3', 'Gs3', 'C4', 'Cs4', 'Ds4', 'F4', 'Gs4'],
  E: ['F3', 'Gs3', 'C4', 'Cs4', 'Ds4', 'F4', 'Gs4'],
};

const pentaBuffers = {};

for (let i in pentaMinor) {
  for (let j of pentaMinor[i]) {
    // const sound = new Tone.Buffer(require('../../../tonejs-instruments/samples/harmonium/' + j + '.wav'));
    const sound = new Tone.Buffer(require('../../assets/samples/piano/' + j + '.wav'));
    pentaBuffers[j] = sound;
  }
}

console.log(pentaBuffers.F4);

const notez = {
  B: ['F6', 'G6', 'A6', 'B6'],
  G: ['B5', 'C6', 'D6', 'Eb6'],
  D: ['D#5', 'F5', 'G5', 'A5'],
  A: ['A4', 'B4', 'C5', 'D5'],
  E: ['D4', 'Eb4', 'F4', 'G4'],
};

const NoteButton = props => {
  return <Note {...props} />;
};

function noteHandler(note, Component, catchNote) {
  const filter = new Tone.Filter({
    frequency: 2100,
    Q: 10,
    rolloff: -12,
  }).toMaster();
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
  }).connect(filter);

  // const filtered = filter.connect(synth).toMaster()

  // const player = new Tone.Player(require(`./frontend/src/assets/samples`)).toMaster();

  return (
    <Component
      onClick={() => {
        catchNote(note);
        // player.triggerRelease();
        // player.start();
      }}
      // onMouseEnter={() => synth.triggerAttack(note)}
      // onMouseLeave={() => synth.triggerRelease()}
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
    Tone.Transport.cancel();
    const notes = Object.keys(trackedNotes).reduce(
      (result, key) => (trackedNotes[key] ? [...result, trackedNotes[key]] : result),
      [],
    );
    if (notes.length > 0) {
      const distortion = new Tone.Distortion(0.6);
      const tremolo = new Tone.Tremolo().start();
      const polySynth = new Tone.PolySynth(notes.length, Tone.Synth).toMaster().chain(distortion, tremolo, Tone.Master);
      // polySynth.triggerAttackRelease(notes, '8n');
    }

    const players = notes.reduce(async (result, note) => {
      console.log(pentaBuffers[note].duration);
      const reverb = await new Tone.Reverb(15).generate();
      return {
        ...result,
        [note]: new Tone.Player(pentaBuffers[note]).connect(reverb),
      };
    }, {});

    [
      /*...notes*/
    ].forEach((note, i) => {
      const startAtTime = i / 2;
      console.log(Math.random() * 2);
      Tone.Transport.schedule(function play(time) {
        players[note].start(time);
        Tone.Transport.schedule(play, `+${Math.floor(Math.random() * 12) + 1}`);
      }, Math.floor(Math.random() * 12) + 1);
    });

    makePiece(notes).then(cleanUp => {
      Tone.Transport.start();
    });

    // Tone.Transport.toggle();
  };

  const clearChord = () => {
    setTrackedNotes(Object.keys(notez).reduce((result, key) => ({ ...result, [key]: null }), {}));
    Tone.Transport.stop();
    Tone.Transport.cancel();
  };

  React.useEffect(() => {
    // makePiece().then(cleanUp => {
    // Tone.Transport.start();
    // Tone.Transport.stop();
    // Tone.Transport.cancel();
    // cleanUp();
    // });
  }, []);

  return (
    <Container>
      <div>
        <button onClick={() => playChord()}>Play Chord</button>
        <button onClick={() => clearChord()}>Clear Notes</button>
        <div>Notes : {Object.keys(trackedNotes).map(key => trackedNotes[key])}</div>
      </div>
      {Object.keys(pentaMinor).map((string, index) => {
        return <String>{pentaMinor[string].map(note => noteHandler(note, NoteButton, onNoteCatch(string)))}</String>;
      })}
    </Container>
  );
};
