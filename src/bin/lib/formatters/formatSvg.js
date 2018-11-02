import { svgname } from "../utils/filenames";
import fsp from "../utils/fsp";
export const formatSvg = async (rendering, idx, output) => {
  await fsp.writeFile(svgname(idx, output), rendering.svg);
};
