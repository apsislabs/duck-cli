import chalk from "chalk";
import _ from "lodash";
import parseArgs from "minimist";
import { Build } from "./cmd/build.js";
import { Init } from "./cmd/init.js";
import { logDefaultHelp } from "./cmd/helps.js";

const commands = {
  init: Init,
  build: Build
};

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    h: "help",
    p: "path"
  },
  boolean: ["h"],
  string: ["p"],
  default: { path: "./" }
});

const defaultCmd = "build";
const cmd = argv._[0];

if (!cmd && argv.help) {
  logDefaultHelp(_.keys(commands));
}

if (!cmd) {
  commands[defaultCmd](argv);
} else if (cmd && _.has(commands, cmd)) {
  commands[cmd](argv);
} else {
  logHelp();
}

console.log(chalk.green("Done!"));
