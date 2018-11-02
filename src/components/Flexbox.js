import React from "react";
import yoga, { Node } from "yoga-layout";
import { flexboxPropTypes } from "../lib/propTypes";
import {
  getEdge,
  getAlign,
  getDisplay,
  getFlexDirection,
  getFlexWrap,
  getJustifyContent
} from "../lib/yoga";

const setPercent = (node, percentKey, nonPercentKey, fallbackKey, value) => {
  if (value) {
    const parsedValue = parseFloat(value, 10);
    const isPercent = value.toString().indexOf("%") !== -1;

    if (isPercent) {
      node[percentKey](parsedValue);
    } else {
      node[nonPercentKey](parsedValue);
    }
  } else {
    node[fallbackKey]();
  }
};

const setNodePadding = (node, val, dir) => {
  const edge = getEdge(dir);
  if (val) {
    if (val === "auto") {
      node.setPaddingAuto(edge);
    } else if (val.indexOf("%") !== -1) {
      node.setPaddingPercent(edge, parseFloat(val, 10));
    } else {
      node.setPadding(edge, val);
    }
  }
};

const setNodeMargin = (node, val, dir) => {
  const edge = getEdge(dir);
  if (val) {
    if (val === "auto") {
      node.setMarginAuto(edge);
    } else if (val.indexOf("%") !== -1) {
      node.setMarginPercent(edge, parseFloat(val, 10));
    } else {
      node.setMargin(edge, val);
    }
  }
};

const setStyles = (node, style = {}) => {
  if (style.alignContent) {
    const alignContent = getAlign(style.alignContent);
    node.setAlignContent(alignContent);
  }

  if (style.alignItems) {
    const alignItems = getAlign(style.alignItems);
    node.setAlignItems(alignItems);
  }

  if (style.display) {
    const display = getDisplay(style.display);
    node.setDisplay(display);
  }

  if (style.flexDirection) {
    const flexDirection = getFlexDirection(style.flexDirection);
    node.setFlexDirection(flexDirection);
  }

  if (style.flexWrap) {
    const flexWrap = getFlexWrap(style.flexWrap);
    node.setFlexWrap(flexWrap);
  }

  if (style.justifyContent) {
    const justifyContent = getJustifyContent(style.justifyContent);
    node.setJustifyContent(justifyContent);
  }

  if (style.aspectRatio) {
    node.setAspectRatio(style.aspectRatio);
  }

  if (style.flex) {
    node.setFlex(style.flex);
  }

  if (style.flexGrow) {
    node.setFlexGrow(style.flexGrow);
  }

  if (style.flexShrink) {
    node.setFlexShrink(style.flexShrink);
  }

  if (style.flexBasis) {
    node.setFlexBasis(style.flexBasis);
  }

  if (style.flexBasisPercent) {
    node.setFlexBasisPercent(style.flexBasisPercent);
  }

  // Set Height
  if (style.minHeight) {
    node.setMinHeight(style.minHeight);
  }

  if (style.maxHeight) {
    node.setMaxHeight(style.maxHeight);
  }

  setPercent(
    node,
    "setHeightPercent",
    "setHeight",
    "setHeightAuto",
    style.height
  );

  // Set Width
  if (style.minWidth) {
    node.setMinWidth(style.minWidth);
  }

  if (style.maxWidth) {
    node.setMaxWidth(style.maxWidth);
  }

  setPercent(node, "setWidthPercent", "setWidth", "setWidthAuto", style.width);

  // Borders
  if (style.borderWidth) {
    node.setBorder(getEdge("all"), style.borderWidth);
  }

  // Margins
  setNodeMargin(node, style.marginTop, "top");
  setNodeMargin(node, style.marginRight, "right");
  setNodeMargin(node, style.marginBottom, "bottom");
  setNodeMargin(node, style.marginleft, "left");

  if (style.margin) {
    node.setMargin(getEdge("all"), style.margin);
  }

  // Padding
  setNodePadding(node, style.paddingTop, "top");
  setNodePadding(node, style.paddingRight, "right");
  setNodePadding(node, style.paddingBottom, "bottom");
  setNodePadding(node, style.paddingleft, "left");

  if (style.padding) {
    node.setPadding(getEdge("all"), style.padding);
  }

  return node;
};

const mergeStyles = ({ style, width, height, strokeWidth }) => {
  return {
    ...style,
    width,
    height,
    borderWidth: strokeWidth
  };
};

export const Flexbox = ({ children, ...props }) => {
  // Create Root Node
  let root = Node.create();
  let rootStyle = mergeStyles(props);
  root = setStyles(root, rootStyle);

  // Create Child Nodes & Add Styles
  React.Children.forEach(children, (c, i) => {
    let child = Node.create();
    let style = mergeStyles(c.props);
    child = setStyles(child, style);
    root.insertChild(child, i);
    return child;
  });

  // Calculate the Layout
  root.calculateLayout(rootStyle.width, rootStyle.height, yoga.DIRECTION_LTR);
  const rootLayout = root.getComputedLayout();

  // Clone Children with new Layout props
  const newChildren = React.Children.map(children, (c, i) => {
    let childNode = root.getChild(i);
    let layout = childNode.getComputedLayout();

    return React.cloneElement(c, {
      width: layout.width,
      height: layout.height,
      transform: `translate(${layout.left} ${layout.top})`
    });
  });

  // Return new group with layout applied
  return (
    <g
      width={rootLayout.width}
      height={rootLayout.height}
      transform={`translate(${rootLayout.left} ${rootLayout.top})`}
    >
      {newChildren}
    </g>
  );
};

Flexbox.propTypes = flexboxPropTypes;

Flexbox.defaultProps = { display: "flex", flex: 1 };
