import PropTypes from "prop-types";
import React from "react";
import { ins } from "../lib/utils";
import { Column } from "./Column";
import { DeckConsumer } from "./DeckContext";
import { TrimLine } from "./TrimLine";

const BaseCard = ({
  children,
  cutColor = "red",
  cutMargin = ins(0.125),
  cutRadius = ins(0.125),
  height,
  safeColor = "blue",
  safeMargin = ins(0.125),
  safeRadius = ins(0.125),
  width,
  ...props
}) => {
  const style = {
    width,
    height,
    overflow: "hidden",
    maxHeight: "100%",
    maxWidth: "100%"
  };

  return (
    <div style={style}>
      <TrimLine
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 999,
          opacity: 0.45
        }}
        display={process.env.PROOF}
        borderColor={cutColor}
        radius={cutRadius}
        margin={cutMargin}
      >
        <TrimLine
          display={process.env.PROOF}
          borderColor={safeColor}
          radius={safeRadius}
          margin={safeMargin}
        />
      </TrimLine>

      <div {...props}>{children}</div>
    </div>
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
