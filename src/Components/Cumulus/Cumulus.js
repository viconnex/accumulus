import React, { useEffect } from 'react';
import { TweenLite } from 'gsap/TweenMax';
import './style.css';

const cloudBaseHeight = 50;
const cloudBaseWidth = 150;
const chuteMax = window.innerHeight - cloudBaseHeight;
const deriveMax = window.innerWidth - cloudBaseWidth - 5;

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

const Cumulus = ({ nuageName }) => {
  // reference to the DOM node
  var myElement = null;
  // reference to the animation
  useEffect(() => {
    const chute = Math.floor(Math.random() * chuteMax);
    const derive = Math.floor(Math.random() * deriveMax);
    TweenLite.to(myElement, 3, { x: derive, y: chute });
  }, [myElement]);

  return (
    <div ref={div => (myElement = div)} className="cumulus">
      <Nuage nuageName={nuageName} />
    </div>
  );
};

export default Cumulus;
