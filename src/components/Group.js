import React, { Component } from "react";
export const Group = ({ name, ...props }) => <g id={name} {...props} />;
