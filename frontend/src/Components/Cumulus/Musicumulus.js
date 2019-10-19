import React, { useEffect, useState } from 'react';
import { TweenLite, TweenMax, Bounce } from 'gsap/TweenMax';
import { random } from 'utils/helpers';
import { Nuage } from './Nuage';
import Tone from 'tone';
import './style.css';
import { playNote, addPattern, patterns } from '../../helpers/generator';
import { deriveMax } from 'Components/Musiciel/Musiciel';
import { AIR_GUITAR_OFFSET } from 'utils/constants';

const ableton = ['Drums2', 'Bass1', 'Chords3', 'Melodies4'];

const Musicumulus = ({
  cloudId,
  handleSkyLanding,
  baseWidth,
  nuageName,
  musicSheet,
  initialPos,
  pentaKey,
  replacementPos,
}) => {
  // reference to the DOM node
  var cumulus = null;
  const volume = new Tone.Channel(-5).connect(Tone.Master);
  console.log(musicSheet);

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
        // opacity: replacementPos ? 1 : 0,
        onStart: () => null, // playNote(note),
        onComplete: () =>
          new Promise(resolve => {
            function hoverinCloud(destination) {
              TweenMax.to(cumulus, 3, {
                y: destination,
                ease: Bounce.easeOut,
                onComplete: () => hoverinCloud(destination === 95 ? 100 : 95),
              });
            }
            hoverinCloud(95);
            setTimeout(() => {
              /*TweenMax.to(cumulus, 3, {
                // x: replacementPos.x,
                y: 50,
                ease: Bounce.easeOut,
                onComplete: () => {
                  // arrive(true);
                  TweenMax.to(cumulus, 5, {});
                },
              });*/
              Tone.Transport.stop();
              Tone.Transport.cancel();
              let initialVolume = -10;
              const interval = setInterval(() => {
                volume.volume.value = initialVolume;
                initialVolume -= 0.25;
              }, 100);
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
        x: musicSheet[index].note * (deriveMax - 2 * AIR_GUITAR_OFFSET) + AIR_GUITAR_OFFSET,
        y: musicSheet[index].chordAltitude,
        onStart: () => {
          if (index > 0) {
            // playNote(Math.floor(musicSheet[index].note * 7), pentaKey);
          }
        },
        onComplete: () => {
          if (index < musicSheet.length - 1) {
            addPattern(null, `${patterns[index]}${Math.ceil(musicSheet[index].note * 8)}`, volume).then(() => {
              twinTo(index + 1, cumulus)();
            });
          } else {
            addPattern(null, `${patterns[index]}${Math.ceil(musicSheet[index].note * 8)}`, volume).then(() => {
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
