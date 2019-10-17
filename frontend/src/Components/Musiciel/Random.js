import React from 'react';

import makePiece, { generateRandomSequence, pentaMinor } from '../../helpers/generator';

export default () => {
  React.useEffect(() => {
    const keys = Object.keys(pentaMinor);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    generateRandomSequence(randomKey);
  }, []);

  return null;
};
