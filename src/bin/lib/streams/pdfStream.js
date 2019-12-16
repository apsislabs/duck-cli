import miss from "mississippi";
import { formatPdf } from "../formatters/formatPdf";
import ora from "ora";
import chalk from "chalk";

export const pdfStream = ({ output, config, deckKey = "" }) => {
  const spinner = ora(`[${chalk.cyan(deckKey)}]\tFormatting PDF`).start();

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
