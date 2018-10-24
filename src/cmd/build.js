import chalk from "chalk";

export const Build = args => {
  if (args.help) {
    console.log(`
      Build the duck project in the current directory.

      Usage:
        $ duck build
    `);

    process.exit(0);
  }

  console.log(chalk.yellow("Building!"));
};
