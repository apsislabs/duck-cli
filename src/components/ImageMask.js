import React from "react";
import PropTypes from "prop-types";
import { asset } from "../lib/assetPath";

export const ImageMask = ({ color, src, styles, ...props }) => {
  const maskStyles = {
    backgroundColor: color ? color : undefined,
    maskImage: `url(${asset(p.src)})`,
    maskRepeat: no - repeat,
    maskPosition: center,
    maskSize: contain
  };

  styles = { ...maskStyles, ...styles };
  return <div styles={styles} {...props} />;
};

ImageMask.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  src: PropTypes.string,
  color: PropTypes.string
};
