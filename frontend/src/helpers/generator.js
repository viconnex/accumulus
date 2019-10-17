import Tone from 'tone';

export const pentaMinor = {
  F: ['F3', 'Gs3', 'C4', 'Cs4', 'Ds4', 'F4', 'Gs4'],
  G: ['G2', 'As2', 'D3', 'Ds3', 'F3', 'G3', 'As3'],
  D: ['D4', 'F4', 'A4', 'C5', 'Cs5', 'D5', 'F5'],
  Bb: ['As3', 'Cs4', 'F4', 'Fs4', 'Gs4', 'As4', 'Cs5'],
};

const pentaBuffers = {};

for (let i in pentaMinor) {
  for (let j of pentaMinor[i]) {
    if (pentaBuffers[j]) continue;
    const sound = new Tone.Buffer(require('../assets/samples/piano/' + j + '.wav'));
    pentaBuffers[j] = sound;
  }
}

const players = {};

for (let n in pentaMinor) {
  for (let i of pentaMinor[n]) {
    if (players[i]) continue;
    // const freeverb = new Tone.Freeverb().connect(Tone.Master);
    const compressor = new Tone.Compressor().connect(Tone.Master);
    const autoFilter = new Tone.AutoFilter(Math.random() / 100 + 0.01, 50, 2);
    autoFilter.connect(compressor);
    const vol = new Tone.Volume(-10).connect(autoFilter);
    players[i] = new Tone.Player(pentaBuffers[i]).connect(vol);
  }
}

const pianoNotes = ['A', 'As', 'B', 'C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs'];
const pianoSamples = {};

for (let n in pianoNotes) {
  for (let i = 0; i < 7; i++) {
    const note = `${pianoNotes[n]}${i}`;
    pianoSamples[note] = require(`../assets/samples/piano/${note}.wav`);
  }
}

const getBuffers = (samplesByNote, opts = {}) =>
  new Promise(resolve => {
    const buffers = new Tone.Buffers(samplesByNote, () => resolve(buffers));
  });

const makePiece = sequence => {
  return Promise.all([getBuffers(pianoSamples), new Tone.Reverb(15).generate()])
    .then(([piano, reverb]) => {
      const compressor = new Tone.Compressor().connect(Tone.Master);
      reverb.connect(compressor);
      reverb.connect(Tone.Master);
      const autoFilter = new Tone.AutoFilter(Math.random() / 100 + 0.01, 100, 2);
      autoFilter.connect(reverb);
      autoFilter.start();
      const playbackRate = 0.5;
      const vol = new Tone.Volume(-15);
      vol.connect(autoFilter);
      vol.connect(Tone.Master);
      const play = notes => {
        const note = notes[Math.floor(Math.random() * notes.length)];
        const buf = piano.get(note);
        const source = new Tone.BufferSource(buf)
          .set({ playbackRate, fadeIn: 4, fadeOut: 4, curve: 'linear' })
          .connect(vol);
        source.start('+1', 0, buf.duration / playbackRate);

        Tone.Transport.schedule(() => {
          play(notes);
        }, `+${buf.duration / playbackRate - 4 + Math.random() * 5 - 2.5}`);
      };

      play(sequence.slice(0, 1));
      // play(['A5', 'G5', 'F5', 'D5', 'E5']);
      // play(['F3', 'Gs3', 'C4', 'Cs4', 'Ds4', 'F4', 'Gs4']);
      play(sequence.slice(1, sequence.length - 1));
      play(sequence.slice(-1));

      return () => {
        [piano, reverb, autoFilter, vol].forEach(node => node.dispose());
      };
    })
    .catch(e => console.error(e));
};

export const generateRandomSequence = key => {
  console.log(key, pentaMinor)
  const randomSequence = Array.from(new Array(6)).map(
    _ => pentaMinor[key][Math.floor(Math.random() * pentaMinor[key].length)],
  );

  randomSequence
    .filter((note, i, array) => !array.slice(0, i).includes(note))
    .map(note => ({
      note,
      duration: 6 - (Math.floor(Math.random() * 24) / 100) * (Math.floor(Math.random() * 2) == 1 ? 1 : -1),
    }))
    .forEach(({ note, duration }, i) => {
      const startAtTime = i * 2;
      Tone.Transport.schedule(function play(time) {
        players[note].start(time);
        Tone.Transport.schedule(
          play,
          `+${6 - (Math.floor(Math.random() * 24) / 100) * (Math.floor(Math.random() * 2) == 1 ? 1 : -1)}`,
        );
      }, startAtTime);
    });

  makePiece(randomSequence).then(cleanUp => {
    Tone.Transport.start();

    return cleanUp;
  });
};

export function playNote(indice, key = 'F') {
  const note = pentaMinor[key][indice];
  players[note].start();
}

export default makePiece;
