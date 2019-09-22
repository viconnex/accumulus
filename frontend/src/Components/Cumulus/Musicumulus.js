import React, { useEffect, useState } from 'react';
import { TweenLite, TweenMax, Linear, Power4 } from 'gsap/TweenMax';
import { random } from 'utils/helpers';
import { NuageShape } from './NuageShape';
import { Nuage } from './Nuage';
import { RainyLetter } from './RainyLetter';
import './style.css';

// TweenLite.defaultEase = Linear.easeNone;

const cloudBaseHeight = 50;
const cloudBaseWidth = 150;
const chuteMax = window.innerHeight - 10;
const deriveMax = window.innerWidth - cloudBaseWidth;
const twoPi = Math.PI * 2;

const Musicumulus = ({ nuageName, musicSheet }) => {
  // reference to the DOM node
  var cumulus = null;

  useEffect(() => {
    TweenLite.set(cumulus, {
      x: musicSheet[0].note,
      y: chuteMax,
    });

    const blowUp = cumulus => () => {
      TweenMax.to(cumulus, 1, {
        y: -300,
      });
    };

    const twinTo = (index, cumulus) => () => {
      TweenMax.to(cumulus, 1, {
        x: musicSheet[index].note,
        y: musicSheet[index].chord,
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
