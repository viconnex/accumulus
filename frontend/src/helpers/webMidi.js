import WebMidi from 'webmidi';

export const enableMidi = (onSuccess) => {
  WebMidi.enable((err) => {
    if (err) {
      console.log("WebMidi could not be enabled.", err);
    } else {
      onSuccess();
    }
  });
}

export class WebMidiControl {
  constructor(
    interfaceName
  ) {
    this.input = WebMidi.getInputByName(interfaceName);

    if (!this.input) {
      console.warn('could not find midi input: ' + interfaceName);
    }
  }

  addListener(property, cb) {
    this.input.addListener(property, cb);
  }

  addValueListener(property, cb) {
    this.input.addListener(property, 'all', (e) => {
      cb(e.value);
    });
  }

  addNoteListener(property, cb) {
    this.input.addListener(property, 'all', (e) => {
      cb(e.note.name + e.note.octave, e.note.number);
    });
  }
}

export default { enableMidi, WebMidiControl };
