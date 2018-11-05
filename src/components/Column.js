import React from "react";
import { Flex } from "./Flex";
export const Column = ({ style, ...props }) => (
  <Flex
    style={{
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      ...style
    }}
    {...props}
  />
);
