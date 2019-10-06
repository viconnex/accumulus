import React, { useEffect, useState } from 'react';
import { TweenLite, TweenMax } from 'gsap/TweenMax';
import { random } from 'utils/helpers';
import { Nuage } from './Nuage';
import Tone from 'tone';
import './style.css';

const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const getNote = (musicSheet, index) => {
  return `${notes[Math.floor(musicSheet[index].note * notes.length)]}${index}`;
};
// TweenLite.defaultEase = Linear.easeNone;

const chuteMax = window.innerHeight - 10;

const Musicumulus = ({ handleSkyLanding, nuageName, musicSheet, deriveMax }) => {
  // reference to the DOM node
  var cumulus = null;

  const [isArrived, arrive] = useState(false);
  useEffect(() => {
    if (isArrived) handleSkyLanding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isArrived]);

  useEffect(() => {
    const synth = new Tone.Synth().toMaster();

    TweenLite.set(cumulus, {
      x: musicSheet[0].note * deriveMax,
      y: chuteMax,
    });

    const blowUp = (cumulus, note) => () => {
      TweenMax.to(cumulus, 1, {
        y: -300,
        onStart: () => synth.triggerAttack(note),
        onComplete: () => {
          arrive(true);
          synth.triggerRelease();
        },
      });
    };

    const twinTo = (index, cumulus) => () => {
      TweenMax.to(cumulus, random(1, 3), {
        x: musicSheet[index].note * deriveMax,
        y: musicSheet[index].chordAltitude,
        onStart: () => {
          if (index > 0) synth.triggerAttack(getNote(musicSheet, index - 1));
        },
        onComplete: () => {
          // synth.triggerRelease();

          if (index < musicSheet.length - 1) twinTo(index + 1, cumulus)();
          else blowUp(cumulus, getNote(musicSheet, index))();
        },
        // ease: Power4.easeOut,
      });
    };

    twinTo(0, cumulus)();
  }, [cumulus]);

  const [baseWidth] = useState(Math.max(random(80, 160), nuageName.length * 8));

  return (
    <div ref={div => (cumulus = div)} className="cumulus">
      <Nuage nuageName={nuageName} baseWidth={baseWidth} />
    </div>
  );
};

export default Musicumulus;
