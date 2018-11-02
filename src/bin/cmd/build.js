import chalk from "chalk";
import _ from "lodash";
import chokidar from "chokidar";
import { existsSync } from "fs";
import { join, resolve, basename } from "path";
import { build } from "../lib/build";
import { printAndExit } from "../lib/utils/logger";
import { logBuildHelp } from "./helps";
import { clearCache } from "../lib/utils/require";
import { REQUIRED_SUBDIRS, TMP_FOLDER } from "../lib/constants";

export const Build = async args => {
  if (args.help) {
    logBuildHelp();
  }

  // Start
  const dir = resolve(args.path);
  if (args.watch) {
    console.log(chalk.green(`🦆  Watching decks in ${basename(dir)}...`));
  } else {
    console.log(chalk.green(`🦆  Building decks in ${basename(dir)}...`));
  }

  // Check Dependencies
  if (!existsSync(dir)) {
    printAndExit(chalk.red(`No such directory ${basename(dir)}.`));
  }

  REQUIRED_SUBDIRS.forEach(subdir => {
    if (!existsSync(join(dir, subdir))) {
      printAndExit(chalk.red(`Couldn\'t find ${subdir}. Exiting.`));
    }
  });

  // Build
  try {
    await build(dir);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

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
        // TODO: This is a weird constant
        const pathRegex = new RegExp(`${resolve(`./${TMP_FOLDER}`)}.*`);
        clearCache(pathRegex);
        console.log(chalk.green(`\n🛠  Rebuilding ${basename(dir)}`));
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
  printAndExit(chalk.green("✨ Build complete!"));
};
