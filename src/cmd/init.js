import chalk from "chalk";
import { logInitHelp } from "./helps";

export const Init = args => {
  if (args.help) {
    logInitHelp();
  }

  console.log(chalk.red("INIT NOT YET IMPLEMENTED"));
};
