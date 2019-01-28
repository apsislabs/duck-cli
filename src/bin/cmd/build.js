import chalk from "chalk";
import _ from "lodash";
import chokidar from "chokidar";
import { existsSync } from "fs";
import { join, resolve, basename } from "path";
import { build } from "../lib/build";
import { printAndExit } from "../lib/utils/logger";
import { logBuildHelp } from "./helps";
import { clearCache } from "../lib/utils/require";
import {
  REQUIRED_SUBDIRS,
  TMP_REGEX,
  TEMPLATE_FOLDER,
  DATA_FOLDER
} from "../lib/constants";

const doBuild = async (dir, args) => {
  // Build
  try {
    await build(dir, args);
  } catch (err) {
    console.error(chalk.red(err));
    process.exit(1);
  }

  console.log(chalk.green("✨ Build complete!"));
};

export const Build = async args => {
  if (args.help) {
    logBuildHelp();
  }

  // Start
  const dir = resolve(args.path);
  const verb = args.watch ? "Watching" : "Building";

  console.log(chalk.green(`🦆 ${verb} decks in ${basename(dir)}...`));

  // Check Dependencies
  if (!existsSync(dir)) {
    printAndExit(chalk.red(`No such directory ${basename(dir)}.`));
  }

  REQUIRED_SUBDIRS.forEach(subdir => {
    if (!existsSync(join(dir, subdir))) {
      printAndExit(chalk.red(`Couldn\'t find ${subdir}. Exiting.`));
    }
  });

  // Do initial build
  doBuild(dir, args);

  // Setup watcher
  if (args.watch) {
    await new Promise((res, rej) => {
      const watcher = chokidar.watch(
        [resolve(`./${TEMPLATE_FOLDER}/`), resolve(`./${DATA_FOLDER}/`)],
        {
          ignored: ["node_modules", /(^|[\/\\])\../],
          ignoreInitial: true,
          persistent: true,
          awaitWriteFinish: {
            stabilityThreshold: 50,
            pollInterval: 10
          }
        }
      );

      // Handle new and modified files
      watcher.on("add", () => doBuild(dir, args));
      watcher.on("change", () => doBuild(dir, args));

      // Handle removing files
      watcher.on("unlink", p => {
        watcher.unwatch(p);
        doBuild(dir, args);
      });

      // Handle errors
      watcher.on("error", error => {
        console.log(chalk.red(error));
        rej(error);
      });
    });
  }

  // Done
  printAndExit(chalk.green("✨ Build complete!"));
};
