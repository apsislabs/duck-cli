import minimist from "minimist";
import { BuildCmdArgs, DeckConfig, DeckName } from "./types.js";

import { DEFAULT_PATH } from "./constants.js";
import { buildDir } from "./lib/build.js";
import { resolve } from "path";

export type CardComponentProps<DataType extends unknown = unknown> =
  DataType & {
    [key: string]: any;
    cardIndex: number;
    deck: DeckName;
    config: DeckConfig;
  };

const getArgs = (): BuildCmdArgs => {
  const raw = minimist(process.argv);

  return {
    proof: raw.proof ?? false,
    path: raw.path ?? DEFAULT_PATH,
    decks: raw.decks ?? undefined,
  };
};

const main = async () => {
  const args = getArgs();
  const path = resolve(args.path ?? DEFAULT_PATH);

  buildDir(path, args.proof, args.decks);
};

main();
