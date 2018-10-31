import React from "react";
import { svgPropTypes } from "./lib/propTypes";

export const Group = ({ name, ...props }) => <g id={name} {...props} />;

Group.propTypes = svgPropTypes;
