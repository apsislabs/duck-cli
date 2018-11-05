import React from "react";
import { ins } from "../lib/utils";

export const TrimLine = ({
  borderColor = "red",
  borderStyle = "dashed",
  borderWidth = 3,
  children,
  display = false,
  margin = ins(0.125),
  radius = ins(0.125),
  ...props
}) => (
  <div
    style={{
      margin: margin,
      boxSizing: "border-box",
      borderRadius: radius,
      borderStyle: borderStyle,
      borderColor: display ? borderColor : "transparent",
      borderWidth: borderWidth,
      height: `calc(100% - ${margin * 2}px)`,
      width: `calc(100% - ${margin * 2}px)`
    }}
    {...props}
  >
    {children}
  </div>
);
