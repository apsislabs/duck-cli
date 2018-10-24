import chalk from "chalk";
import { logBuildHelp } from "./helps";

export const Build = args => {
  if (args.help) {
    logBuildHelp();
  }

  console.log(chalk.yellow("Building!"));
};
