import React from "react";
import _ from "lodash";

import { splitText } from "../lib/splittext";
import { downvg } from "../lib/downvg";

export const Text = ({
  lineHeight = "22px",
  fontSize = "12px",
  fontFamily = "Helvetica",
  fontStyle = "regular",
  children,
  color,
  x,
  y,
  ...props
}) => {
  const lines = splitText(children, props.width, {
    fontFamily,
    fontSize,
    lineHeight
  });

  const spans = _.map(lines, (l, i) => (
    <tspan
      key={i}
      x={x}
      dy={i > 0 ? lineHeight : undefined}
      dangerouslySetInnerHTML={{ __html: downvg(l) }}
    />
  ));

  return (
    <React.Fragment>
      {children && (
        <text
          fontFamily={fontFamily}
          fontSize={fontSize}
          fontStyle={fontStyle}
          fill={color}
          y={y}
          {...props}
        >
          {spans}
        </text>
      )}
    </React.Fragment>
  );
};
