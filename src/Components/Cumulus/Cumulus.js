import React, { useEffect } from 'react';
import { TweenLite } from 'gsap/TweenMax';
import './style.css';

const Nuage = ({ nuageName }) => {
  return (
    <div>
      <div className="nuage" />
      <div className="surrimage">
        <div className="rimage">{nuageName}</div>
      </div>
    </div>
  );
};

const Cumulus = ({ chute, nuageName }) => {
  // reference to the DOM node
  var myElement = null;
  // reference to the animation

  useEffect(() => {
    TweenLite.to(myElement, 3, { x: 0, y: chute });
  });

  return (
    <div ref={div => (myElement = div)} className="cumulus">
      <Nuage nuageName={nuageName} />
    </div>
  );
};

export default Cumulus;
