import React from "react";

const overlayStyles = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 999
};

export const Overlay = ({ styles, ...props }) => {
  styles = { ...overlayStyles, ...styles };

  return <div styles={styles} {...props} />;
};
