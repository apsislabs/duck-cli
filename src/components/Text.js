import React from "react";
import _ from "lodash";
import { measureText } from "../lib/measuretext";
import { splitText } from "../lib/splittext";
import { downvg } from "../lib/downvg";

export const Text = ({
  lineHeight = "22px",
  fontSize = "12px",
  fontFamily = "Helvetica",
  fontStyle = "regular",
  baseline = "hanging",
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

  let lineSize = measureText({
    text: lines[0],
    fontFamily,
    fontSize,
    lineHeight
  });

  const spans = _.map(lines, (l, i) => (
    <tspan
      x={x}
      y={i > 0 ? lineHeight : undefined}
      key={i}
      width={lineSize.width.value}
      height={lineSize.height.value}
      dangerouslySetInnerHTML={{ __html: downvg(l) }}
      dominantBaseline="no-change"
    />
  ));

  return (
    <React.Fragment>
      {children && (
        <text
          dominantBaseline={baseline}
          fontFamily={fontFamily}
          fontSize={fontSize}
          fontStyle={fontStyle}
          fill={color}
          y={y}
          width={lineSize.width.value}
          height={lineSize.height.value * lines.length}
          {...props}
        >
          {spans}
        </text>
      )}
    </React.Fragment>
  );
};
