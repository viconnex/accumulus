import React, { useEffect, useState } from 'react';
import { TweenMax, Power2 } from 'gsap/TweenMax';
import { random } from 'utils/helpers';

const chuteMax = window.innerHeight - 10;

export const RainyLetter = ({ letter, isRaining, handleGoutteDropping }) => {
  var goutte = null;

  const [isDropped, setIsDropped] = useState(false);

  useEffect(() => {
    if (isDropped) handleGoutteDropping();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDropped]);

  useEffect(() => {
    if (isRaining) {
      TweenMax.to(goutte, 1, {
        y: chuteMax + 100,
        ease: Power2.easeIn,
        delay: random(0.3, 4),
        onStart: () => setIsDropped(true),
      });
    }
  }, [isRaining, goutte]);

  return <div ref={div => (goutte = div)}>{letter}</div>;
};
