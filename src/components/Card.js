import React from "react";
import { CutArea } from "./CutArea";
export const Card = ({
  safeZone = true,
  cut = true,
  width = 850,
  height = 1125,
  ...props
}) => (
  <g>
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

    {process.env.PROOF &&
      (cut && (
        <CutArea
          id="cut"
          margin="37.5"
          width={width}
          height={height}
          color="red"
          strokeDasharray={null}
        />
      ))}

    {process.env.PROOF &&
      (safeZone && (
        <CutArea
          id="safe_zone"
          margin="75"
          width={width}
          height={height}
          color="blue"
          strokeDasharray="3 3"
        />
      ))}

    {props.children}
  </g>
);
