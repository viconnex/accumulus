import styled from 'styled-components';

export const NuageShape = styled.div`
  opacity: 0.7;
  width: ${props => props.baseWidth}px;
  height: ${props => props.baseWidth / 3}px;
  border-radius: ${props => props.baseWidth}px;
  position: relative;
  background: #ffffff;
  color: black;

  &:before,
  &:after {
    content: '';
    border-radius: ${props => props.baseWidth}px;
    position: absolute;
    background: #ffffff;
  }
  &:before {
    width: ${props => props.baseWidth / 3}px;
    height: ${props => props.baseWidth / 3}px;
    top: -${props => (props.baseWidth * 35) / 150}px;
    left: ${props => (props.baseWidth * 22) / 150}px;
  }
  &:after {
    width: ${props => (props.baseWidth * 80) / 150}px;
    height: ${props => (props.baseWidth * 80) / 150}px;
    top: -${props => (props.baseWidth * 35) / 150}px;
    right: ${props => (props.baseWidth * 22) / 150}px;
  }
`;
