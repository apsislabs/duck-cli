import React from "react";
import { Flex } from "./Flex";
export const Row = ({ height = "auto", width = "100%", style, ...props }) => (
  <Flex
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      width,
      height,
      ...style
    }}
    {...props}
  />
);
