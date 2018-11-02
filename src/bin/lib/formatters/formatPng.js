import { pngname } from "../utils/filenames";
import fsp from "../utils/fsp";
export const formatPng = async (converter, rendering, idx, output) => {
  const png = await converter.convert(rendering.svg, {
    width: rendering.width,
    height: rendering.height
  });
  await fsp.writeFile(pngname(idx, output), png);
};
