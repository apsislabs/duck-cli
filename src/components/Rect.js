import React from "react";
import { svgPropTypes } from "../lib/propTypes";

export const Rect = props => <rect {...props} />;
Rect.propTypes = svgPropTypes;
