import React, { Component } from "react";
export const Image = ({ src, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={props.width}
    height={props.height}
  >
    <image xlinkHref={src} {...props} />
  </svg>
);
