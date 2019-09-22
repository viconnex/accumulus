import React from 'react';
import { NuageShape } from './NuageShape';

export const Nuage = ({ nuageName, baseWidth }) => {
  return (
    <div>
      <NuageShape baseWidth={baseWidth} />
      <div className="surrimage">
        <div className="rimage">{nuageName}</div>
      </div>
    </div>
  );
};
