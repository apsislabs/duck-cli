import "babel-polyfill";
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
    P: "proof",
    w: "watch"
  },
  boolean: ["h", "P", "w"],
  string: ["p"],
  default: { path: "./", proof: false, watch: false }
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
  const promise = commands[defaultCmd](argv);
  if (promise) {
    promise
      .then(() => process.exit(0))
      .catch(e => console.error(chalk.red(e.stack)));
  }
} else if (cmd && _.has(commands, cmd)) {
  const promise = commands[cmd](argv);
  if (promise) {
    promise.then(() => process.exit(0)).catch(e => {
      console.error(chalk.red(e.stack));
    });
  }
} else {
  console.warn(chalk.yellow(`Warning: Unknown Command: ${cmd}`));
  logDefaultHelp(availableCmds);
}
