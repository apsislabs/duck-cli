export const formatPng = async (converter, rendering) => {
  return converter.convert(rendering.svg, {
    width: rendering.width,
    height: rendering.height
  });
};
