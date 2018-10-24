import chalk from "chalk";

export const Init = args => {
  if (args.help) {
    console.log(`
      Initialize a new duck project in the current directory.

      Usage:
        $ duck init
    `);

    process.exit(0);
  }

  console.log(chalk.red("INIT NOT YET IMPLEMENTED"));
};
