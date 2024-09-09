import { readFileSync } from "fs";
import yaml from "js-yaml";
import { assign, cloneDeep, pickBy, reduce } from "lodash-es";
import { join } from "path";

import { BuildCmdArgs, DeckConfig, DeckName } from "../types.js";

export const CONFIG_FILE_NAME = "decks.config.yml";

const DEFAULT_CONFIG: DeckConfig = {
  width: 825,
  height: 1125,
  backgroundColor: "#fff",
  bleed: .125,
  format: ["png"],
  pdf: {
    size: "letter",
    layout: "landscape",
    trim_lines: true,
    margin: 0.25,
  },
};

export const loadConfig = (
  root: string,
  args: BuildCmdArgs = {}
): Record<DeckName, DeckConfig> => {
  const loaded = loadFile(root);
  const filtered = filterConfigs(loaded, args);

  return fillDefaults(filtered);
};

const loadFile = (root: string) =>
  yaml.load(readFileSync(join(root, CONFIG_FILE_NAME), "utf8")) as Record<
    DeckName,
    DeckConfig
  >;

const filterConfigs = (
  confs: Record<DeckName, DeckConfig>,
  args: BuildCmdArgs = {}
): Record<DeckName, DeckConfig> =>
  args.decks
    ? pickBy(
        confs,
        (_conf, deck) => args.decks && args.decks.includes(deck as DeckName)
      )
    : confs;

const fillDefaults = (confs: Record<DeckName, DeckConfig>) =>
  reduce(
    confs,
    (acc, conf, deck) => {
      acc[deck as DeckName] = assign(cloneDeep(DEFAULT_CONFIG), conf);
      return acc;
    },
    {} as Record<DeckName, DeckConfig>
  );
