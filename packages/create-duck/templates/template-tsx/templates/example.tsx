import React from 'react';
import { CardComponentProps } from "@duck/duck";

const Card: React.FC<CardComponentProps> = (props) => {
  return <div>Hello {props.cardIndex}</div>;
};

export default Card;
