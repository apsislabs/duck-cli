import React, { Component } from "react";
export const Text = ({ children, color, x, y, ...props }) => (
  <React.Fragment>
    {children && (
      <text {...props}>
        <tspan x={x} y={y} fill={color}>
          {children}
        </tspan>
      </text>
    )}
  </React.Fragment>
);
