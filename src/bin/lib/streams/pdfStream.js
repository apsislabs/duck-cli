import ora from "ora";
import pc from "picocolors";
import { formatPdf } from "../formatters/formatPdf.js";

export const pdfStream = ({ output, config, deckKey = "" }) => {
  const spinner = ora(`[${pc.cyan(deckKey)}]\tFormatting PDF`).start();

  return miss.through.obj(
    async (c, e, cb) => {
      await formatPdf(c, output, config, deckKey);
      cb(null);
    },
    cb => {
      spinner.succeed();
      cb(null, null);
    }
  );
};
