import React, { useEffect, useState } from 'react';
import { TweenLite, TweenMax } from 'gsap/TweenMax';
import { random } from 'utils/helpers';
import { Nuage } from './Nuage';
import Tone from 'tone';
import './style.css';
import { playNote, addPattern, patterns } from '../../helpers/generator';

const ableton = ['Drums2', 'Bass1', 'Chords3', 'Melodies4'];

const Musicumulus = ({
  cloudId,
  handleSkyLanding,
  baseWidth,
  nuageName,
  musicSheet,
  deriveMax,
  initialPos,
  pentaKey,
  replacementPos,
}) => {
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

    const blowUp = (cumulus, note) => {
      TweenMax.to(cumulus, 5, {
        y: 100,
        opacity: replacementPos ? 1 : 0,
        onStart: () => null, // playNote(note),
        onComplete: () => {
          setTimeout(() => {
            Tone.Transport.stop();
            Tone.Transport.cancel();
            if (!replacementPos) {
              arrive(true);
            } else {
              TweenMax.to(cumulus, 3, {
                x: replacementPos.x,
                y: replacementPos.y,
                onComplete: () => {
                  arrive(true);
                },
              });
            }
          }, 1000);
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
              blowUp(cumulus, null);
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
    <div id={cloudId} ref={div => (cumulus = div)} className="cumulus" style={{ opacity: 0.9 }}>
      <Nuage nuageName={nuageName} baseWidth={baseWidth} />
    </div>
  );
};

export default Musicumulus;
