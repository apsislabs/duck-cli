import pkg from "../package.json";
import parseArgs from "minimist";
import _ from "lodash";
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

const logHelp = () => {
  console.log(`
    Usage:
      $ duck <command>
    Available commands:
      ${_.keys(commands).join(", ")}
    For more information run a command with the --help flag
      $ duck <command> --help
  `);

  process.exit(0);
};

if (!cmd) {
  commands[defaultCmd]();
} else if (cmd && _.has(commands, cmd)) {
  commands[cmd]();
} else {
  logHelp();
}

console.log(chalk.green("Done!"));
