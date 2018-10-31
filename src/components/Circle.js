import React from "react";
import { svgPropTypes } from "./lib/propTypes";

export const Circle = props => <circle {...props} />;
Circle.propTypes = svgPropTypes;
