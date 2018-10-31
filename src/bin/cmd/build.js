import chalk from "chalk";
import chokidar from "chokidar";
import { existsSync } from "fs";
import { join, resolve } from "path";
import { build } from "../lib/build";
import { printAndExit } from "../lib/utils/logger";
import { logBuildHelp } from "./helps";

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

  if (args.watch) {
    await new Promise((res, rej) => {
      const watcher = chokidar.watch(
        [resolve("./templates/"), resolve("./data/")],
        {
          ignored: ["node_modules", /(^|[\/\\])\../],
          ignoreInitial: true,
          persistent: true
        }
      );

      // Add event listeners.
      const rebuild = async p => {
        console.log(chalk.green(`\n=> Rebuilding ${dir}\n`));
        await build(dir);
      };

      // Handle new and modified files
      watcher.on("add", rebuild);
      watcher.on("change", rebuild);

      // Handle removing files
      watcher.on("unlink", p => {
        watcher.unwatch(p);
        rebuild(p);
      });

      // Handle errors
      watcher.on("error", error => {
        console.log(chalk.red(error));
        rej(error);
      });

      // Handle interrupts
      process.on("SIGINT", () => {
        watcher.close();
        res();
      });

      process.on("SIGTERM", () => {
        watcher.close();
        res();
      });
    });
  }

  // Done
  printAndExit(chalk.green("Build complete!"));
};
