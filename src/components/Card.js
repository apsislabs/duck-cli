import React from "react";
import { CutArea } from "./CutArea";
import { DeckConsumer } from "./DeckContext";
import PropTypes from "prop-types";

const BaseCard = ({ safeZone = true, cut = true, children, ...props }) => {
  const {
    width,
    height,
    cutMargin = 37.5,
    safeMargin = 75,
    cutColor = "red",
    safeColor = "blue"
  } = props;

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
      margin={cutMargin}
      width={width}
      height={height}
      color={cutColor}
      strokeDasharray={null}
    />
  );

  const SafeZone = (
    <CutArea
      id="safe_zone"
      margin={safeMargin}
      width={width}
      height={height}
      color={safeColor}
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

const cardPropTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  cutMargin: PropTypes.number,
  safeMargin: PropTypes.number,
  cutColor: PropTypes.string,
  safeColor: PropTypes.string
};

BaseCard.propTypes = cardPropTypes;
Card.propTypes = cardPropTypes;
