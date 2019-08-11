import React from 'react';
import styled from 'styled-components';

export const NuageShape = styled.div`
  opacity: 0.7;
  width: ${props => props.basWidth}px;
  height: 50px;
  border-radius: 100px;
  position: relative;
  background: #ffffff;
  color: black;

  &:before,
  &:after {
    content: '';
    border-radius: 100px;
    position: absolute;
    background: #ffffff;
  }
  &:before {
    width: 50px;
    height: 50px;
    top: -35px;
    left: 22px;
  }
  &:after {
    width: 80px;
    height: 80px;
    top: -35px;
    right: 22px;
  }
`;
