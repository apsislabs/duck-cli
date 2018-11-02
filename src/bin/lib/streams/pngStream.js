import miss from "mississippi";
import { formatPng } from "../formatters/formatPng";
import { pngname } from "../utils/filenames";
import fsp from "../utils/fsp";
import { progressBar } from "../utils/progressBar";

export const pngStream = ({ output, converter, size = 0 }) => {
  const pngBar = progressBar("PNG", size);
  let pngIndex = 0;

  return miss.through.obj(async (chunk, enc, cb) => {
    let pngBuffer = await formatPng(converter, chunk);

    fsp.writeFile(pngname(pngIndex, output), pngBuffer).then(pngBar.tick());
    pngIndex++;

    cb(null, pngBuffer);
  });
};
