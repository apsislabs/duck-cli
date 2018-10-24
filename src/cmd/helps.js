export const logHelp = helpString => {
  console.log(helpString);

  process.exit(0);
};

export const logDefaultHelp = cmds => {
  logHelp(`
    Usage:
      $ duck <command>
    Available commands:
      ${cmds.join(", ")}
    For more information run a command with the --help flag
      $ duck <command> --help
  `);
};

export const logBuildHelp = () => {
  logHelp(`
    Build the duck project in the current directory.

    Usage:
      $ duck build
  `);
};

export const logInitHelp = () => {
  logHelp(`
    Initialize a new duck project in the current directory.

    Usage:
      $ duck init
  `);
};
