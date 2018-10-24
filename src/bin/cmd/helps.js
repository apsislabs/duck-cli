import { printAndExit } from "../lib/utils/logger";

export const logDefaultHelp = cmds => {
  printAndExit(`
    Usage:
      $ duck <command>
    Available commands:
      ${cmds.join(", ")}
    For more information run a command with the --help flag
      $ duck <command> --help
  `);
};

export const logBuildHelp = () => {
  printAndExit(`
    Build the duck project in the current directory.

    Usage:
      $ duck build

    duck build --help   display help
    duck build --path   set the path to build from
    duck build --proof  include proof lines
  `);
};

export const logInitHelp = () => {
  printAndExit(`
    Initialize a new duck project in the current directory.

    Usage:
      $ duck init
  `);
};
