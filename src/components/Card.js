import React from "react";
import { CutArea } from "./CutArea";
import { DeckConsumer } from "./lib/DeckContext";

const BaseCard = ({ safeZone = true, cut = true, children, ...props }) => {
  const { width, height } = props;
  const CardBackground = (
    <rect
      id="background"
      x="0"
      y="0"
      width={width}
      height={height}
      strokeWidth="0"
      fill="none"
      {...props}
    />
  );

  const CutZone = (
    <CutArea
      id="cut"
      margin="37.5"
      width={width}
      height={height}
      color="red"
      strokeDasharray={null}
    />
  );

  const SafeZone = (
    <CutArea
      id="safe_zone"
      margin="75"
      width={width}
      height={height}
      color="blue"
      strokeDasharray="3 3"
    />
  );

  return (
    <g>
      <defs>
        <clipPath id="card">{CardBackground}</clipPath>
        <clipPath id="cut">{CutZone}</clipPath>
        <clipPath id="safe">{SafeZone}</clipPath>
      </defs>

      {CardBackground}

      {process.env.PROOF && (cut && CutZone)}
      {process.env.PROOF && (safeZone && SafeZone)}

      {children}
    </g>
  );
};

export const Card = props => (
  <DeckConsumer>
    {context => {
      let newProps = { width: context.width, height: context.height, ...props };
      return <BaseCard {...newProps} />;
    }}
  </DeckConsumer>
);
