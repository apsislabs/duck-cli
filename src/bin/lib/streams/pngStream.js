import ora from "ora";
import miss from "mississippi";
import pc from "picocolors";
import { formatPng } from "../formatters/formatPng.js";
import { pngname } from "../utils/filenames.js";
import fsp from "../utils/fsp.js";

export const pngStream = ({ output, page, config, size = 0, deckKey = "" }) => {
  let pngIndex = 0;
  const spinner = ora(`[${pc.cyan(deckKey)}]\tBuffering PNGs`).start();

  return miss.through.obj(
    async (chunk, _enc, cb) => {
      let pngBuffer = await formatPng(page, chunk);
      await fsp.writeFile(
        pngname(config.filename, deckKey, pngIndex, output),
        pngBuffer
      );

      pngIndex++;

      cb(null, pngBuffer);
    },
    cb => {
      spinner.succeed();
      cb(null, null);
    }
  );
};
