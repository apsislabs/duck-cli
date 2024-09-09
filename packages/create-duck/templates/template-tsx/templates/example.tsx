import React from "react";
import { CardComponentProps } from "@duck/duck";

const Card: React.FC<CardComponentProps> = (props) => {
  return <div style={{ padding: 37.5 }}>Hello {props.cardIndex}</div>;
};

export default Card;
