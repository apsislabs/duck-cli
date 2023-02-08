import pc from "picocolors";
import _ from "lodash";
import parseArgs from "minimist";
import { Build } from "./cmd/build.js";
import { logDefaultHelp } from "./cmd/helps.js";
import { Init } from "./cmd/init.js";

process.on("SIGINT", () => {
  process.exit(0);
});

process.on("SIGTERM", () => {
  process.exit(0);
});

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
    w: "watch",
    v: "verbose",
    D: "decks",
    f: "formats"
  },
  string: ["decks", "formats"],
  boolean: ["h", "P", "w", "v"],
  string: ["p"],
  default: { path: "./", proof: false, watch: false, verbose: false }
});

const cmd = argv._[0];
const availableCmds = _.keys(commands);

if (argv.proof) {
  process.env.PROOF = true;
}

if (argv.verbose) {
  process.env.VERBOSE = true;
}

if (!cmd && argv.help) {
  logDefaultHelp(availableCmds);
}

if (!cmd) {
  const promise = commands[defaultCmd](argv);
  if (promise) {
    promise
      .then(() => process.exit(0))
      .catch(e => console.error(pc.red(e.stack)));
  }
} else if (cmd && _.has(commands, cmd)) {
  const promise = commands[cmd](argv);
  if (promise) {
    promise
      .then(() => process.exit(0))
      .catch(e => {
        console.error(pc.red(e.stack));
      });
  }
} else {
  console.warn(pc.yellow(`Warning: Unknown Command: ${cmd}`));
  logDefaultHelp(availableCmds);
}
