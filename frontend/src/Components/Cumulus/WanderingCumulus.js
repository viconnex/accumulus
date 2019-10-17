import React, { useEffect, useState } from 'react';
import { TweenLite, TweenMax } from 'gsap/TweenMax';
import { random } from 'utils/helpers';
import { Nuage } from './Nuage';
import './style.css';

// TweenLite.defaultEase = Linear.easeNone;

const twoPi = Math.PI * 2;

const WanderingCumulus = ({
  handleSkyLanding,
  nuageName,
  cloudBaseWidth,
  cloudHeight,
  deriveMax,
  meanHeight,
  wanderingHeight,
}) => {
  // reference to the DOM node
  var cumulus = null;
  const [isVisibleX, setIsVisibleX] = useState(false);
  const [isVisibleY, setIsVisibleY] = useState(false);

  const [isArrived, arrive] = useState(false);
  useEffect(() => {
    if (isArrived) handleSkyLanding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isArrived]);

  useEffect(() => {
    const xradius = random(1) < 0.35 ? random(deriveMax / 3, deriveMax / 2) : random(deriveMax / 6, deriveMax / 3);
    const yradius =
      random(1) < 0.35
        ? random(wanderingHeight / 3, wanderingHeight / 2)
        : random(wanderingHeight / 6, wanderingHeight / 3);
    const xdecalage = deriveMax / 2 - cloudBaseWidth / 2;
    const ydecalage = meanHeight - cloudHeight / 2;
    const xspeed = random(1) < 0.2 ? random(20, 50) : random(50, 150);
    const yspeed = random(1) < 0.2 ? random(20, 50) : random(50, 150);

    TweenLite.set(cumulus, {
      x: random(-twoPi, twoPi) + xdecalage,
      y: random(-twoPi, twoPi) + ydecalage,
    });

    TweenMax.to(cumulus, xspeed, {
      x: '+=' + twoPi,
      repeat: -1,
      modifiers: {
        x: function(x) {
          return Math.cos(x) * xradius + xdecalage;
        },
      },
      onStart: () => setIsVisibleX(true),
    });

    TweenMax.to(cumulus, yspeed, {
      y: '+=' + twoPi,
      repeat: -1,
      modifiers: {
        y: function(y) {
          return Math.sin(y) * yradius + ydecalage;
        },
      },
      onStart: () => setIsVisibleY(true),
    });
  }, [cumulus]);

  const [baseWidth] = useState(Math.max(random(80, 160), nuageName.length * 8));

  return (
    <div ref={div => (cumulus = div)} className="cumulus" style={{ opacity: isVisibleX && isVisibleY ? 1 : 0 }}>
      <Nuage nuageName={nuageName} baseWidth={baseWidth} />
    </div>
  );
};

export default WanderingCumulus;
