import React, { useEffect, useState } from 'react';
import { TweenLite, TweenMax } from 'gsap/TweenMax';
import { random } from 'utils/helpers';
import { Nuage } from './Nuage';
import './style.css';
import { deriveMax, cloudBaseWidth } from 'Components/Musiciel/Musiciel';

// TweenLite.defaultEase = Linear.easeNone;

const twoPi = Math.PI * 2;

const WanderingCumulus = ({
  cloudId,
  isOptimal,
  nuageName,
  baseWidth,
  cloudHeight,
  meanHeight,
  wanderingHeight,
  initialPos,
}) => {
  // reference to the DOM node
  var cumulus = null;
  const [isVisibleX, setIsVisibleX] = useState(false);
  const [isVisibleY, setIsVisibleY] = useState(false);

  // const [isArrived, arrive] = useState(false);

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
      x: initialPos ? initialPos.x : random(-twoPi, twoPi) + xdecalage,
      y: initialPos ? initialPos.y : random(-twoPi, twoPi) + ydecalage,
      opacity: 0,
    });
    TweenMax.to(cumulus, xspeed, {
      x: '+=' + twoPi,
      opactity: 1,
      repeat: -1,
      modifiers: {
        x: function(x) {
          return Math.cos(x) * xradius + xdecalage;
        },
      },
      onStart: () => {
        setIsVisibleX(true);
      },
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

    // wander(cumulus, initialPos)();
    // TweenMax.to(cumulus, 3, {
    //   x: random(-twoPi, twoPi) + xdecalage,
    //   y: random(-twoPi, twoPi) + ydecalage,
    //   onComplete: () => {
    //   },
    // });
  }, [cumulus]);

  return (
    <div
      id={cloudId}
      ref={div => (cumulus = div)}
      className="cumulus"
      style={{ opacity: isVisibleX && isVisibleY ? 0.7 : 0 }}
    >
      <Nuage color={isOptimal ? 'yellow' : 'white'} fontColor={'black'} nuageName={nuageName} baseWidth={baseWidth} />
    </div>
  );
};

export default WanderingCumulus;
