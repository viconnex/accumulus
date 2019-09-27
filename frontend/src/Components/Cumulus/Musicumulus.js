import React, { useEffect, useState } from 'react';
import { TweenLite, TweenMax, Linear, Power4 } from 'gsap/TweenMax';
import { random } from 'utils/helpers';
import { Nuage } from './Nuage';
import './style.css';

// TweenLite.defaultEase = Linear.easeNone;

const chuteMax = window.innerHeight - 10;

const Musicumulus = ({ nuageName, musicSheet, deriveMax }) => {
  // reference to the DOM node
  var cumulus = null;

  useEffect(() => {
    TweenLite.set(cumulus, {
      x: musicSheet[0].note * deriveMax,
      y: chuteMax,
    });

    const blowUp = cumulus => () => {
      TweenMax.to(cumulus, 1, {
        y: -300,
      });
    };

    const twinTo = (index, cumulus) => () => {
      TweenMax.to(cumulus, random(0.4, 2), {
        x: musicSheet[index].note * deriveMax,
        y: musicSheet[index].chordAltitude,
        onComplete: index < musicSheet.length - 1 ? twinTo(index + 1, cumulus) : blowUp(cumulus),
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
