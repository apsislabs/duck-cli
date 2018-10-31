import _ from "lodash";
import yoga from "yoga-layout";
export const getJustifyContent = val => {
  let opts = {
    center: yoga.JUSTIFY_CENTER,
    "flex-end": yoga.JUSTIFY_FLEX_END,
    "flex-start": yoga.JUSTIFY_FLEX_START,
    "space-around": yoga.JUSTIFY_SPACE_AROUND,
    "space-between": yoga.JUSTIFY_SPACE_BETWEEN,
    "space-evenly": yoga.JUSTIFY_SPACE_EVENLY
  };
  return _.get(opts, val, yoga.JUSTIFY_FLEX_START);
};
export const getAlign = val => {
  let opts = {
    auto: yoga.ALIGN_AUTO,
    baseline: yoga.ALIGN_BASELINE,
    center: yoga.ALIGN_CENTER,
    "flex-end": yoga.ALIGN_FLEX_END,
    "flex-start": yoga.ALIGN_FLEX_START,
    "space-around": yoga.ALIGN_SPACE_AROUND,
    "space-between": yoga.ALIGN_SPACE_BETWEEN,
    stretch: yoga.ALIGN_STRETCH
  };
  return _.get(opts, val, yoga.ALIGN_FLEX_START);
};
export const getFlexDirection = val => {
  let opts = {
    column: yoga.FLEX_DIRECTION_COLUMN,
    "column-reverse": yoga.FLEX_DIRECTION_COLUMN_REVERSE,
    count: yoga.FLEX_DIRECTION_COUNT,
    row: yoga.FLEX_DIRECTION_ROW,
    "row-reverse": yoga.FLEX_DIRECTION_ROW_REVERSE
  };
  return _.get(opts, val, yoga.FLEX_DIRECTION_ROW);
};
const getDirection = val => {
  let opts = {
    inherit: yoga.DIRECTION_INHERIT,
    ltr: yoga.DIRECTION_LTR,
    rtl: yoga.DIRECTION_RTL
  };
  return _.get(opts, val, yoga.DIRECTION_INHERIT);
};
export const getFlexWrap = val => {
  let opts = {
    "no-wrap": yoga.WRAP_NO_WRAP,
    wrap: yoga.WRAP_WRAP,
    "wrap-reverse": yoga.WRAP_WRAP_REVERSE
  };
  return _.get(opts, val, yoga.WRAP_WRAP);
};
export const getEdge = val => {
  let opts = {
    left: yoga.EDGE_LEFT,
    top: yoga.EDGE_TOP,
    right: yoga.EDGE_RIGHT,
    bottom: yoga.EDGE_BOTTOM,
    start: yoga.EDGE_START,
    end: yoga.EDGE_END,
    horizontal: yoga.EDGE_HORIZONTAL,
    vertical: yoga.EDGE_VERTICAL,
    all: yoga.EDGE_ALL
  };
  return _.get(opts, val, yoga.EDGE_ALL);
};
export const getDisplay = val => {
  let opts = {
    flex: yoga.DISPLAY_FLEX,
    none: yoga.DISPLAY_NONE
  };
  return _.get(opts, val, yoga.DISPLAY_FLEX);
};
const getUnit = val => {
  let opts = {
    auto: yoga.UNIT_AUTO,
    percent: yoga.UNIT_PERCENT,
    point: yoga.UNIT_POINT,
    undefined: yoga.UNIT_UNDEFINED
  };
  return opts[val];
};
const getOverflow = val => {
  let opts = {
    hidden: yoga.OVERFLOW_HIDDEN,
    scroll: yoga.OVERFLOW_SCROLL,
    visible: yoga.OVERFLOW_VISIBLE
  };
  return opts[val];
};
const getPositionType = val => {
  let opts = {
    absolute: yoga.POSITION_TYPE_ABSOLUTE,
    relative: yoga.POSITION_TYPE_RELATIVE
  };
  return opts[val];
};
