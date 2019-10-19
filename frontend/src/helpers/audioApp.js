import Tone from 'tone';
import StartAudioContext from 'startaudiocontext';

import { AudioSampler } from './audioSampler.js';
import { AudioSynth } from './audioSynth.js';
import { enableMidi, WebMidiControl } from '/imports/AudioMidi.js';

let audioCtx;
let tuna;
let soundsRootUrl;
let timeOrigin;
let outputNode;
let fxNode;
let kickPlayer;
let bassPlayer;
let beatCount = 0;
let midiInput = null;

const handleEvent = user => ({ eventType, xPc, yPc }) => {
  user.touchEvent(eventType, xPc, yPc);
};

export const createUser = function(userStruct) {
  const { voice, sound, quantize } = userStruct;

  let user;

  if (voice == 'sampler') {
    user = new AudioSampler(audioCtx, soundsRootUrl, outputNode, fxNode, quantize, sound);
  } else if (voice == 'synth') {
    user = new AudioSynth(audioCtx, soundsRootUrl, outputNode, fxNode, quantize, sound);
  }

  return {
    sampler: user,
    handleEvent: handleEvent(user),
    onNoteOn: user.onNoteOn,
    onNoteOff: user.onNoteOff,
  };
};

export const initAudio = function(
  soundsRoot,
  initLoop = 1,
  { shouldEnableMidi = false, onMidiNotePlayed = () => {}, msTempo = 1000 } = {},
) {
  // create web audio api context
  audioCtx = Tone.context;
  StartAudioContext(audioCtx);

  //tuna = new Tuna(audioCtx);

  soundsRootUrl = soundsRoot;
  timeOrigin = audioCtx.currentTime;

  // console.log(audioCtx.sampleRate);
  // audio setup
  //
  fxNode = new Tone.Gain();
  postFxNode = new Tone.Gain();
  outputNode = new Tone.Gain();

  outputNode.gain.value = 0.5;
  postFxNode.gain.value = 0.5;

  outputNode.toMaster();
  postFxNode.toMaster();

  // outputNode.gain.value = 1.0;
  /*fxConvolver = new tuna.Convolver({
      highCut: 20000,                         //20 to 22050
      lowCut: 20,                             //20 to 22050
      dryLevel: 0,                            //0 to 1+
      wetLevel: 1,                            //0 to 1+
      level: 0.5,                               //0 to 1+, adjusts total output of both wet and dry
      impulse: `${soundsRootUrl}/impulse/033.wav`,    //the path to your impulse response
      bypass: 0
    });*/
  let url = `${soundsRootUrl}/impulse/033.wav`;
  fxMasterEffect = new Tone.Convolver(url, () => console.log('ir loaded'));

  fxMasterEffect = new Tone.Freeverb(0.9, 1000);

  fxMasterEffect.connect(postFxNode);

  fxNode.gain.value = 0.4;
  fxNode.connect(fxMasterEffect);

  const initKickLoop = initLoopNumber => {
    kickPlayer = createUser({
      voice: 'sampler',
      sound: 'base_0' + initLoopNumber,
      quantize: 1,
    });

    if (initLoopNumber === 0) {
      // kick loop
      bassPlayer = createUser({
        voice: 'synth',
        sound: 'bass',
        quantize: 1,
      });
    }
    // kickPlayer.fxGainNode.value = 0.7;
    kickPlayer.sampler.masterGainNode.gain.value = 0.5;

    setInterval(function() {
      kickPlayer.sampler.touchEvent('startPlaying', 0, 0.8);

      if (initLoopNumber === 0) {
        if (beatCount % 16 == 0) {
          bassPlayer.sampler.touchEvent('startPlaying', 0.99, 0.8);
        } else if (beatCount % 16 == 8) {
          bassPlayer.sampler.touchEvent('startPlaying', 0.7, 0.8);
        }
      }
      beatCount = (beatCount + 1) % 16;
    }, msTempo);
  };

  if (initLoop) {
    initKickLoop(initLoop);
  }
  if (shouldEnableMidi) {
    enableMidi(() => {
      midiInput = new WebMidiControl('USB Keystation 49e');

      if (midiInput.input) {
        const midiUser = createUser({
          voice: 'synth',
          sound: 'monoMarti',
        });

        midiInput.addValueListener('pitchbend', value => {
          console.log('pitch + ', value);
          midiUser.handleEvent({
            eventType: 'stillPlaying',
            xPc: value,
            yPc: null,
          });
        });

        midiInput.addValueListener('controlchange', value => {
          midiUser.handleEvent({
            eventType: 'stillPlaying',
            xPc: null,
            yPc: value / 127,
          });
        });

        midiInput.addNoteListener('noteon', (noteAndOctave, number) => {
          midiUser.onNoteOn(noteAndOctave);
          onMidiNotePlayed(noteAndOctave, number);
        });

        midiInput.addNoteListener('noteoff', (noteAndOctave, number) => {
          midiUser.onNoteOff(noteAndOctave);
        });
      }
    });
  }
};

export default { initAudio, createUser };
