import React, { Component } from "react";
export const CutArea = ({
  radius = 37.5,
  margin = 37.5,
  width = 850,
  height = 1125,
  color = "red",
  strokeDasharray = "3 3",
  ...props
}) => (
  <rect
    x={margin}
    y={margin}
    rx={radius}
    ry={radius}
    width={width - margin * 2}
    height={height - margin * 2}
    strokeWidth="2"
    stroke={color}
    fill="none"
    strokeDasharray={strokeDasharray}
    {...props}
  />
);
