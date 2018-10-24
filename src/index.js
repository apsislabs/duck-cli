import chalk from "chalk";
import { buildCommand } from './cmd/build';

console.log(
  chalk.hex("#B7A57A").bgHex("#4B2E83").bold("GO"),
  chalk.hex("#4B2E83").bgHex("#B7A57A").bold("HUSKIES!!!")
);

buildCommand("test")


