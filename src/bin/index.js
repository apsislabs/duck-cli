import chalk from "chalk";
import _ from "lodash";
import parseArgs from "minimist";
import { Build } from "./cmd/build.js";
import { Init } from "./cmd/init.js";
import { logDefaultHelp } from "./cmd/helps.js";

const defaultCmd = "build";
const commands = {
  init: Init,
  build: Build
};

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    h: "help",
    p: "path",
    P: "proof"
  },
  boolean: ["h", "P"],
  string: ["p"],
  default: { path: "./", proof: false }
});

const cmd = argv._[0];
const availableCmds = _.keys(commands);

if (argv.proof) {
  process.env.PROOF = true;
}

if (!cmd && argv.help) {
  logDefaultHelp(availableCmds);
}

if (!cmd) {
  commands[defaultCmd](argv);
} else if (cmd && _.has(commands, cmd)) {
  commands[cmd](argv);
} else {
  console.warn(chalk.yellow(`Warning: Unknown Command: ${cmd}`));
  logDefaultHelp(availableCmds);
}
