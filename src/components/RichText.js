import React, { Component } from "react";
export const RichText = ({ color, x, y, children, textStyle, ...props }) => (
  <React.Fragment>
    {children && (
      <foreignObject x={x} y={y} {...props}>
        <div xmlns="http://www.w3.org/1999/xhtml">
          <div style={textStyle}>{children}</div>
        </div>
      </foreignObject>
    )}
  </React.Fragment>
);
