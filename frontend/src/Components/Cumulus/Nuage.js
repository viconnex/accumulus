import React from 'react';
import { NuageShape } from './NuageShape';

export const Nuage = ({ nuageName, baseWidth, color, borderWidth }) => {
  return (
    <div>
      <NuageShape baseWidth={baseWidth} color={color} borderWidth={borderWidth || 0} />
      <div className="surrimage">
        <div className="rimage">{nuageName}</div>
      </div>
    </div>
  );
};
