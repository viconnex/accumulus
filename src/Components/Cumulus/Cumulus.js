import React, { useEffect } from 'react';
import { TweenLite } from 'gsap/TweenMax';
import './style.css';

const Nuage = () => (
  <div>
    <div className="nuage" />
    <div className="surrimage">
      <div className="rimage">Nuage</div>
    </div>
  </div>
);

const Cumulus = ({ chute }) => {
  // reference to the DOM node
  var myElement = null;
  // reference to the animation

  useEffect(() => {
    TweenLite.to(myElement, 1, { x: 0, y: chute });
  });

  return (
    <div ref={div => (myElement = div)} className="cumulus">
      <Nuage />
    </div>
  );
};

export default Cumulus;
