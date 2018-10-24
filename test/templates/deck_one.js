import React from "react";
import moment from 'moment';
export default ({ color }) => (
  <g>
    <circle cx={50} cy={50} r={10} time={moment().toISOString()} fill={color} />
  </g>
);
