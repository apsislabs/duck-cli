import miss from "mississippi";
import { progressBar } from "../utils/progressBar";
import { formatSvg } from "../formatters/formatSvg";

export const svgStream = ({ output, size = 0 }) => {
  let svgIndex = 0;
  const svgBar = progressBar("SVG", size);

  return miss.through.obj(async (chunk, enc, cb) => {
    await formatSvg(chunk, svgIndex, output).then(() => svgBar.tick());
    svgIndex++;

    cb(null, chunk);
  });
};
