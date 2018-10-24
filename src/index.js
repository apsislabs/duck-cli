import pkg from "../package.json";
import parseArgs from "minimist";

import { Init } from "./cmd/init.js";
import { Build } from "./cmd/build.js";
import chalk from "chalk";

const commands = {
  init: Init,
  build: Build
};

const argv = parseArgs(process.argv.slice(2));
const defaultCmd = "build";
const cmd = argv._[0];

if (cmd) {
  commands[cmd]();
} else {
  commands[defaultCmd]();
}

console.log(chalk.green("Done!"));
