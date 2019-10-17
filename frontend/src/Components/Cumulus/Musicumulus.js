import React, { useEffect, useState } from 'react';
import { TweenLite, TweenMax } from 'gsap/TweenMax';
import { random } from 'utils/helpers';
import { Nuage } from './Nuage';
import Tone from 'tone';
import './style.css';
import { playNote, addPattern, patterns } from '../../helpers/generator';

const chuteMax = window.innerHeight - 10;

const ableton = ['Drums2', 'Bass1', 'Chords3', 'Melodies4'];

const Musicumulus = ({ handleSkyLanding, baseWidth, nuageName, musicSheet, deriveMax, initialPos, pentaKey }) => {
  // reference to the DOM node
  var cumulus = null;

  const [isArrived, arrive] = useState(false);
  useEffect(() => {
    if (isArrived) handleSkyLanding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isArrived]);

  useEffect(() => {
    TweenLite.set(cumulus, {
      x: initialPos.x,
      y: initialPos.y,
    });

    const blowUp = (cumulus, note) => () => {
      TweenMax.to(cumulus, 1, {
        y: 0,
        onStart: () => null, // playNote(note),
        onComplete: () => {
          setTimeout(() => {
            arrive(true);
            Tone.Transport.stop();
            Tone.Transport.cancel();
          }, 10000);
          // Tone.Transport.stop();
          // Tone.Transport.cancel();
          // synth.triggerRelease();
        },
      });
    };

    const twinTo = (index, cumulus) => () => {
      TweenMax.to(cumulus, random(1, 3), {
        x: musicSheet[index].note * deriveMax,
        y: musicSheet[index].chordAltitude,
        onStart: () => {
          if (index > 0) {
            // playNote(Math.floor(musicSheet[index].note * 7), pentaKey);
          }
        },
        onComplete: () => {
          if (index < musicSheet.length - 1) {
            addPattern(null, `${patterns[index]}${Math.ceil(Math.random() * 4)}`).then(() => {
              twinTo(index + 1, cumulus)();
            });
          } else {
            // playNote(Math.floor(musicSheet[index].note * 7), pentaKey);
            // addPattern(null, `${patterns[index]}${Math.ceil(Math.random() * 4)}`);
            addPattern(null, `${patterns[index]}${Math.ceil(Math.random() * 4)}`).then(() => {
              blowUp(cumulus, null)();
            });
          }
        },
        // ease: Power4.easeOut,
      });
    };

    twinTo(0, cumulus)();
  }, [cumulus]);

  const cleanUp = () => {};

  return (
    <div ref={div => (cumulus = div)} className="cumulus">
      <Nuage nuageName={nuageName} baseWidth={baseWidth} />
    </div>
  );
};

export default Musicumulus;
