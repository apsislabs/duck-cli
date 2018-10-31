import React from "react";
import PropTypes from "prop-types";
import { svgPropTypes } from "../lib/propTypes";

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

Image.propTypes = {
  ...svgPropTypes,
  src: PropTypes.string.isRequired
};
