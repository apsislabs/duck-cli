import PropTypes from "prop-types";

export const flexboxPropTypes = {
  alignContent: PropTypes.oneOf([
    "center",
    "flex-end",
    "flex-start",
    "space-around",
    "space-between",
    "stretch"
  ]),
  alignItems: PropTypes.oneOf([
    "baseline",
    "center",
    "flex-end",
    "flex-start",
    "stretch"
  ]),
  alignSelf: PropTypes.oneOf([
    "baseline",
    "center",
    "flex-end",
    "flex-start",
    "stretch"
  ]),
  children: PropTypes.node,
  display: PropTypes.oneOf(["flex", "inline-flex"]),
  element: PropTypes.oneOf([
    "article",
    "aside",
    "div",
    "figure",
    "footer",
    "header",
    "main",
    "nav",
    "section"
  ]),
  flex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  flexBasis: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  flexDirection: PropTypes.oneOf([
    "column-reverse",
    "column",
    "row-reverse",
    "row"
  ]),
  flexGrow: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  flexShrink: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  flexWrap: PropTypes.oneOf(["nowrap", "wrap-reverse", "wrap"]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  inline: PropTypes.bool,
  justifyContent: PropTypes.oneOf([
    "center",
    "flex-end",
    "flex-start",
    "space-around",
    "space-between"
  ]),
  margin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  marginBottom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  marginLeft: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  marginRight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  marginTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  order: PropTypes.number,
  padding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  paddingBottom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  paddingLeft: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  paddingRight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  paddingTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export const svgPropTypes = {
  x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  viewBox: PropTypes.string
};
