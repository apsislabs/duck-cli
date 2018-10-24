import chalk from "chalk";

export const printAndExit = helpString => {
  console.log(helpString);

  process.exit(0);
};
