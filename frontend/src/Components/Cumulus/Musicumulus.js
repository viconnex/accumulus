import React, { useEffect, useState } from 'react';
import { TweenLite, TweenMax, Bounce } from 'gsap/TweenMax';
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
  const volume = new Tone.Channel(-5).connect(Tone.Master);

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
        onComplete: () =>
          new Promise(resolve => {
            setTimeout(() => {
              TweenMax.to(cumulus, 3, {
                x: replacementPos.x,
                y: replacementPos.y,
                ease: Bounce.easeOut,
                onComplete: () => {
                  // arrive(true);
                },
              });
              Tone.Transport.stop();
              Tone.Transport.cancel();
              let initialVolume = -10;
              const interval = setInterval(() => {
                volume.volume.value = initialVolume;
                initialVolume -= 0.25;
              }, 200);
              setTimeout(() => {
                clearInterval(interval);
                resolve();
              }, 5000);
            }, 10000);
          }).then(() => arrive(true)),
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
            addPattern(null, `${patterns[index]}${Math.ceil(Math.random() * 8)}`, volume).then(() => {
              twinTo(index + 1, cumulus)();
            });
          } else {
            addPattern(null, `${patterns[index]}${Math.ceil(Math.random() * 8)}`, volume).then(() => {
              blowUp(cumulus, null);
            });
          }
        },
        // ease: Power4.easeOut,
      });
    };

    twinTo(0, cumulus)();
  }, [cumulus]);

  return (
    <div id={cloudId} ref={div => (cumulus = div)} className="cumulus" style={{ opacity: 0.9 }}>
      <Nuage nuageName={nuageName} baseWidth={baseWidth} />
    </div>
  );
};

export default Musicumulus;
