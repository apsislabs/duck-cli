import { resolve, join } from "path";
import chalk from "chalk";
import { existsSync } from "fs";
import { logBuildHelp } from "./helps";
import { printAndExit } from "../lib/utils/logger";
import { build } from "../lib/build";

const REQUIRED_SUBDIRS = ["data", "templates", "deck.config.yml"];

export const Build = async args => {
  if (args.help) {
    logBuildHelp();
  }

  // Start
  const dir = resolve(args.path);
  console.log(chalk.green(`Building decks in ${dir}`));

  // Check Dependencies
  if (!existsSync(dir)) {
    printAndExit(chalk.red(`No such directory ${dir}.`));
  }

  REQUIRED_SUBDIRS.forEach(subdir => {
    if (!existsSync(join(dir, subdir))) {
      printAndExit(chalk.red(`Couldn\'t find ${subdir}. Exiting.`));
    }
  });

  // Build
  await build(dir);

  // Done
  printAndExit(chalk.green("Build complete!"));
};
