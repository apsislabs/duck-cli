import { buildDir } from "@duck/duck";
import { DeckName } from "@duck/duck/dist/types";
import capcon from "capture-console";
import { Command } from "commander";
import { existsSync } from "fs";
import { createSpinner } from "nanospinner";
import { basename, join, resolve } from "path";
import pc from "picocolors";

const DATA_FOLDER = "data";
const TEMPLATE_FOLDER = "templates";
const ASSET_FOLDER = "assets";
const CONF_FILE = "decks.config.yml";
const REQUIRED_SUBDIRS = [DATA_FOLDER, TEMPLATE_FOLDER, CONF_FILE];

const build = new Command();

build
  .name("duck")
  .option("--path <dir>", "directory to build", "./")
  .option("-p, --proof", "output decks with proofing overlay")
  .option("-d, --decks <decks...>", "output specific decks")
  .option("-v, --verbose", "include additional logging during build");

build.parse();

type BuildOptions = {
  path: string;
  proof?: boolean;
  decks?: DeckName[];
  verbose?: boolean;
};

const intercept = async (cb: () => Promise<void> | void) => {
  let output = "";
  try {
    // @ts-expect-error types are declared wrong
    capcon.startIntercept(process.stdout, (stdout: string) => {
      output += stdout;
    });

    await cb();
  } finally {
    capcon.stopIntercept(process.stdout);
    return output;
  }
};

const main = async (options: BuildOptions) => {
  console.log(pc.blue("🦆 quack quack!"));

  const dir = resolve(options.path);

  // Check Dependencies
  if (!existsSync(dir)) {
    console.error(pc.red(`No such directory ${basename(dir)}.`));
    process.exit(1);
  }

  REQUIRED_SUBDIRS.forEach((subdir) => {
    if (!existsSync(join(dir, subdir))) {
      console.error(pc.red(`Couldn\'t find ${subdir}. Exiting.`));
      process.exit(1);
    }
  });

  // Setup Spinner
  const spinner = createSpinner(`building decks in ${basename(dir)}`).start();

  // Handle interrupt
  process.on("SIGINT", () => {
    spinner.clear();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    spinner.clear();
    process.exit(0);
  });

  // Do work
  try {
    const output = await intercept(
      async () => await buildDir(dir, options.proof, options.decks)
    );

    spinner.stop({
      text: pc.green(`done! decks built to ${basename(dir)}/output`),
      color: "green",
      mark: "✨",
    });

    if (options.verbose) {
      console.log(output);
    }
  } catch (err: unknown) {
    spinner.error({ text: `Error during build: ${(err as Error).message}` });
    process.exit(1);
  }

  process.exit(0);
};

main(build.opts());
