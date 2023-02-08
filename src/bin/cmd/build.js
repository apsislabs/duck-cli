import pc from "picocolors";
import _ from "lodash";
import chokidar from "chokidar";
import { existsSync } from "fs";
import { join, resolve, basename } from "path";
import { build } from "../lib/build.js";
import { printAndExit } from "../lib/utils/logger.js";
import { logBuildHelp } from "./helps.js";
import { clearCache } from "../lib/utils/require.js";
import {
  REQUIRED_SUBDIRS,
  TMP_REGEX,
  TEMPLATE_FOLDER,
  DATA_FOLDER
} from "../lib/constants.js";

const doBuild = async (dir, args, uncache = false) => {
  if (uncache) {
    clearCache(TMP_REGEX);
  }

  // Build
  try {
    await build(dir, args);
  } catch (err) {
    console.log(pc.red("⚠️ Error while building:\n"));
    console.error(err.stack);
    return false;
  }

  console.log(pc.green("✨ Build complete!\n"));
  return true;
};

export const Build = async args => {
  if (args.help) {
    logBuildHelp();
    process.exit(0);
  }

  // Start
  const dir = resolve(args.path);
  const verb = args.watch ? "Watching" : "Building";

  console.log(pc.blue(`🦆 ${verb} decks in ${basename(dir)}...\n`));

  // Check Dependencies
  if (!existsSync(dir)) {
    printAndExit(pc.red(`No such directory ${basename(dir)}.`));
  }

  REQUIRED_SUBDIRS.forEach(subdir => {
    if (!existsSync(join(dir, subdir))) {
      printAndExit(pc.red(`Couldn\'t find ${subdir}. Exiting.`));
    }
  });

  // Do initial build
  await doBuild(dir, args);

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
      watcher.on("add", async () => await doBuild(dir, args, true));
      watcher.on("change", async () => await doBuild(dir, args, true));

      // Handle removing files
      watcher.on("unlink", async p => {
        watcher.unwatch(p);
        await doBuild(dir, args, true);
      });

      // Handle errors
      watcher.on("error", error => {
        console.log(pc.red(error));
        rej(error);
      });
    });
  }

  // Done
  process.exit(0);
};
