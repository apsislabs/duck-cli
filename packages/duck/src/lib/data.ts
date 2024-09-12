import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { reduce, times, flatMap, cloneDeep } from "lodash-es";
import { join } from "path";
import {
  DATA_DIR_NAME,
  IMAGE_COLUMN_PREFIX,
  MD_COLUMN_PREFIX,
} from "../constants.js";
import { CardData, DeckConfig, DeckName } from "../types.js";
import { marked } from "marked";
import { loadAsset } from "../utils/fs.js";

export const loadData = (
  root: string,
  config: Record<DeckName, DeckConfig>,
): Record<DeckName, CardData[]> => {
  const data = loadRawData(root, config);

  return explodeData(data);
};

const loadRawData = (root: string, config: Record<DeckName, DeckConfig>) => {
  return reduce(
    config,
    (acc, _conf, deck) => {
      const raw = parse(loadDataFile(root, deck as DeckName), {
        skipEmptyLines: true,
        columns: true,
      });
      acc[deck as DeckName] = processData(root, raw);

      return acc;
    },
    {} as Record<DeckName, CardData[]>,
  );
};

const processData = (root: string, data: CardData[]) => {
  return data.map((row) => {
    return Object.fromEntries(
      Object.entries(row).map((entry) => {
        if (!entry[1]) {
          return entry;
        }

        if (entry[0].startsWith(IMAGE_COLUMN_PREFIX)) {
          return [entry[0], loadAsset(root, entry[1].toString())];
        } else if (entry[0].startsWith(MD_COLUMN_PREFIX)) {
          return [entry[0], marked.parse(entry[1].toString())];
        }

        return entry;
      }),
    );
  });
};

const explodeData = (
  data: Record<DeckName, CardData[]>,
): Record<DeckName, CardData[]> => {
  return reduce(
    data,
    (acc, cards, deck) => {
      acc[deck as DeckName] = cards.flatMap((d) => {
        const { qty = 1 } = d;
        return times(Number(qty), () => cloneDeep(d));
      });

      return acc;
    },
    {} as Record<DeckName, CardData[]>,
  );
};

const loadDataFile = (root: string, deck: DeckName) => {
  return readFileSync(join(root, DATA_DIR_NAME, `${deck}.csv`), "utf8");
};
