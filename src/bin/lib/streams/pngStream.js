import miss from "mississippi";
import { formatPng } from "../formatters/formatPng";
import { pngname } from "../utils/filenames";
import fsp from "../utils/fsp";
import { progressBar } from "../utils/progressBar";

export const pngStream = ({ output, page, config, size = 0, deckKey = "" }) => {
  const pngBar = progressBar(`[${deckKey}] PNG`, size);
  let pngIndex = 0;

  return miss.through.obj(async (chunk, _enc, cb) => {
    let pngBuffer = await formatPng(page, chunk);
    let pngName = await fsp
      .writeFile(pngname(config.filename, deckKey, pngIndex, output), pngBuffer)
      .then(pngBar.tick());

    pngIndex++;
    cb(null, pngBuffer);
  });
};
