import miss from "mississippi";
import { formatPng } from "../formatters/formatPng";
import { pngname } from "../utils/filenames";
import fsp from "../utils/fsp";
import ora from "ora";
import chalk from "chalk";

export const pngStream = ({ output, page, config, size = 0, deckKey = "" }) => {
  let pngIndex = 0;
  const spinner = ora(`[${chalk.cyan(deckKey)}]\tBuffering PNGs`).start();

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
