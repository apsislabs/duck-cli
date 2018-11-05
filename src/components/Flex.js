import React from "react";
export const Flex = ({ children, style, ...props }) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      ...style
    }}
    {...props}
  >
    {children}
  </div>
);
