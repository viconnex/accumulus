import React, { useEffect, useState } from 'react';
import { TweenLite, TweenMax, Linear, Power4 } from 'gsap/TweenMax';
import { random } from 'utils/helpers';
import { NuageShape } from './NuageShape';
import { RainyLetter } from './RainyLetter';
import './style.css';

TweenLite.defaultEase = Linear.easeNone;

const cloudBaseHeight = 50;
const cloudBaseWidth = 150;
const chuteMax = window.innerHeight - 10;
const deriveMax = window.innerWidth - 10;
const twoPi = Math.PI * 2;

const Nuage = ({ nuageName, baseWidth, isRaining, handleGoutteDropping }) => {
  return (
    <div>
      <NuageShape baseWidth={baseWidth} color="white" />
      <div className="surrimage">
        <div className="rimage">
          {nuageName.split('').map(letter => (
            <RainyLetter letter={letter} isRaining={isRaining} handleGoutteDropping={handleGoutteDropping} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Cumulus = ({ nuageName, upload, handleSkyLanding, handleRainOver, isRaining }) => {
  // reference to the DOM node
  var cumulus = null;
  const [isVisibleX, setIsVisibleX] = useState(false);
  const [isVisibleY, setIsVisibleY] = useState(false);

  useEffect(() => {
    const xradius = random(1) < 0.35 ? random(deriveMax / 3, deriveMax / 2) : random(deriveMax / 6, deriveMax / 3);
    const yradius = random(1) < 0.35 ? random(chuteMax / 3, chuteMax / 2) : random(chuteMax / 6, chuteMax / 3);
    const xdecalage = deriveMax / 2 - cloudBaseWidth / 2;
    const ydecalage = chuteMax / 2 - cloudBaseHeight / 2;
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

  const [isArrived, arrive] = useState(false);
  useEffect(() => {
    if (isArrived && upload) handleSkyLanding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isArrived]);

  useEffect(() => {
    if (upload) {
      const uploadSpeed = random(1) < 0.3 ? random(0.8, 2) : random(2, 4);
      TweenMax.to(cumulus, uploadSpeed, {
        y: -300,
        onComplete: () => {
          arrive(true);
        },
        ease: Power4.easeIn,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upload]);

  const [gouttesDrops, setGouttesDrops] = useState(0);
  const [isFullyRained, setIsFullyRained] = useState(false);

  const handleGoutteDropping = () => {
    const count = gouttesDrops;
    setGouttesDrops(count + 1);
  };

  useEffect(() => {
    if (gouttesDrops >= nuageName.length) {
      TweenMax.to(cumulus, 1, {
        opacity: 0,
        onComplete: () => {
          setIsFullyRained(true);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gouttesDrops]);

  useEffect(() => {
    if (isFullyRained && isRaining) handleRainOver();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullyRained]);

  const [baseWidth] = useState(Math.max(random(80, 160), nuageName.length * 8));

  return (
    <div ref={div => (cumulus = div)} className="cumulus" style={{ opacity: isVisibleX && isVisibleY ? 1 : 0 }}>
      <Nuage
        color="white"
        nuageName={nuageName}
        baseWidth={baseWidth}
        isRaining={isRaining}
        handleGoutteDropping={handleGoutteDropping}
      />
    </div>
  );
};

export default Cumulus;
