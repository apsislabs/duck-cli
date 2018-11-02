import chalk from "chalk";

export const verboseLog = string => {
  if (process.env.VERBOSE) {
    console.log(string);
  }
};

export const printAndExit = helpString => {
  console.log(helpString);

  process.exit(0);
};
