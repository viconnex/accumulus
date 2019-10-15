import Tone from 'tone';
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
      // const compressor = new Tone.Compressor().connect(Tone.Master);
      // reverb.connect(compressor);
      //reverb.connect(Tone.Master)
      // const autoFilter = new Tone.AutoFilter(Math.random() / 100 + 0.01, 400, 2);
      // autoFilter.connect(reverb);
      // autoFilter.start();
      const playbackRate = 0.25;
      const vol = new Tone.Volume(-10);
      // vol.connect(autoFilter);
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
      play(sequence.slice(2, sequence.length - 1));
      play(sequence.slice(-1));

      return () => {
        [piano, reverb, /*autoFilter,*/ vol].forEach(node => node.dispose());
      };
    })
    .catch(e => console.error(e));
};

export default makePiece;
